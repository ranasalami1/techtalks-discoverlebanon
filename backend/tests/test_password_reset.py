import re
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from werkzeug.security import check_password_hash

from app import create_app
from extensions import db
from models import PasswordResetToken, User
from services.password_reset import token_digest


class PasswordResetTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SMTP_HOST": "smtp.example.test",
            "MAIL_FROM": "noreply@example.test",
            "FRONTEND_URL": "http://localhost:3000",
        })
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        user = User(
            full_name="Test User",
            email="user@example.com",
            password_hash="old-password-hash",
        )
        db.session.add(user)
        db.session.commit()
        self.user_id = user.user_id
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def create_token(self, raw_token, expires_at):
        db.session.add(PasswordResetToken(
            user_id=self.user_id,
            token_hash=token_digest(raw_token),
            expires_at=expires_at,
        ))
        db.session.commit()

    def test_forgot_password_sends_link_with_unstored_token(self):
        with patch("routes.auth.send_password_reset_email") as send_email:
            response = self.client.post(
                "/api/auth/forgot-password",
                json={"email": "USER@example.com"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertIn("If an account exists", response.json["message"])
        send_email.assert_called_once()
        email, reset_url = send_email.call_args.args
        self.assertEqual(email, "user@example.com")
        raw_token = re.search(r"[?&]token=([^&]+)", reset_url).group(1)
        reset_token = PasswordResetToken.query.filter_by(user_id=self.user_id).one()
        self.assertEqual(reset_token.token_hash, token_digest(raw_token))
        self.assertNotIn(raw_token, reset_token.token_hash)

    def test_reset_password_changes_hash_and_token_cannot_be_reused(self):
        raw_token = "one-time-token"
        self.create_token(
            raw_token,
            datetime.now(timezone.utc) + timedelta(minutes=30),
        )

        response = self.client.post(
            "/api/auth/reset-password",
            json={"token": raw_token, "password": "new-password-123"},
        )

        self.assertEqual(response.status_code, 200)
        user = db.session.get(User, self.user_id)
        self.assertTrue(check_password_hash(user.password_hash, "new-password-123"))

        replay_response = self.client.post(
            "/api/auth/reset-password",
            json={"token": raw_token, "password": "another-password-123"},
        )
        self.assertEqual(replay_response.status_code, 400)

    def test_expired_token_is_rejected(self):
        self.create_token(
            "expired-token",
            datetime.now(timezone.utc) - timedelta(seconds=1),
        )
        response = self.client.post(
            "/api/auth/reset-password",
            json={"token": "expired-token", "password": "new-password-123"},
        )
        self.assertEqual(response.status_code, 400)

    def test_unknown_token_is_rejected(self):
        response = self.client.post(
            "/api/auth/reset-password",
            json={"token": "unknown-token", "password": "new-password-123"},
        )
        self.assertEqual(response.status_code, 400)

    def test_forgot_password_does_not_disclose_unknown_email(self):
        with patch("routes.auth.send_password_reset_email") as send_email:
            existing = self.client.post(
                "/api/auth/forgot-password", json={"email": "user@example.com"}
            )
            missing = self.client.post(
                "/api/auth/forgot-password", json={"email": "missing@example.com"}
            )

        self.assertEqual(existing.status_code, missing.status_code)
        self.assertEqual(existing.json, missing.json)
        self.assertEqual(send_email.call_count, 1)

    def test_reset_password_rejects_short_password(self):
        response = self.client.post(
            "/api/auth/reset-password",
            json={"token": "some-token", "password": "short"},
        )
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()