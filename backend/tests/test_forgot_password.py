import hashlib
import unittest
from unittest.mock import patch

from flask import Flask

from extensions import db
from models import PasswordResetToken, User
from routes.auth import auth_bp


class ForgotPasswordEndpointTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.app = Flask(__name__)

        cls.app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            FRONTEND_URL="http://localhost:3000",
        )

        db.init_app(cls.app)
        cls.app.register_blueprint(auth_bp)

        with cls.app.app_context():
            db.create_all()

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            db.session.remove()
            db.drop_all()

    def setUp(self):
        self.client = self.app.test_client()

        with self.app.app_context():
            db.session.query(PasswordResetToken).delete()
            db.session.query(User).delete()

            user = User(
                full_name="Test User",
                email="person@example.com",
                password_hash="existing-hash",
            )

            db.session.add(user)
            db.session.commit()

    def test_known_email_sends_link_and_stores_only_token_hash(self):
        with patch("routes.auth.send_password_reset_email") as send_email:
            response = self.client.post(
                "/api/auth/forgot-password",
                json={"email": " PERSON@EXAMPLE.COM "},
            )

        self.assertEqual(response.status_code, 202)

        self.assertEqual(
            response.json["message"],
            "If an account with that email exists, a password reset link has been sent.",
        )

        send_email.assert_called_once()

        recipient, reset_url = send_email.call_args.args

        self.assertEqual(recipient, "person@example.com")

        token = reset_url.split("token=", 1)[1]

        with self.app.app_context():
            reset_token = PasswordResetToken.query.one()

            self.assertEqual(
                reset_token.token_hash,
                hashlib.sha256(token.encode("utf-8")).hexdigest(),
            )

            self.assertNotIn(token, reset_token.token_hash)
            self.assertIsNone(reset_token.used_at)

    def test_unknown_email_returns_same_accepted_response_without_sending(self):
        with patch("routes.auth.send_password_reset_email") as send_email:
            response = self.client.post(
                "/api/auth/forgot-password",
                json={"email": "unknown@example.com"},
            )

        self.assertEqual(response.status_code, 202)

        self.assertEqual(
            response.json["message"],
            "If an account with that email exists, a password reset link has been sent.",
        )

        send_email.assert_not_called()

        with self.app.app_context():
            self.assertEqual(PasswordResetToken.query.count(), 0)

    def test_invalid_email_is_rejected(self):
        response = self.client.post(
            "/api/auth/forgot-password",
            json={"email": "not-an-email"},
        )

        self.assertEqual(response.status_code, 400)

    def test_email_failure_removes_token_and_returns_generic_response(self):
        with patch(
            "routes.auth.send_password_reset_email",
            side_effect=RuntimeError("SMTP unavailable"),
        ):
            response = self.client.post(
                "/api/auth/forgot-password",
                json={"email": "person@example.com"},
            )

        self.assertEqual(response.status_code, 202)

        with self.app.app_context():
            self.assertEqual(PasswordResetToken.query.count(), 0)


if __name__ == "__main__":
    unittest.main()