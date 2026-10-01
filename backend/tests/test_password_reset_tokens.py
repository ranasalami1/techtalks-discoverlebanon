import unittest
from datetime import datetime, timedelta, timezone

from flask import Flask

from extensions import db
from models import PasswordResetToken, User
from services.password_reset import (
    RESET_TOKEN_LIFETIME,
    consume_reset_token,
    create_reset_token,
    find_valid_reset_token,
)


class PasswordResetTokenTests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
        )
        db.init_app(self.app)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.user = User(
            full_name="Test User",
            email="test@example.com",
            password_hash="existing-hash",
        )
        db.session.add(self.user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        db.engine.dispose()
        self.app_context.pop()

    def test_create_stores_only_hash_and_sets_expiration(self):
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        raw_token, record = create_reset_token(self.user.user_id, now=now)
        db.session.commit()

        self.assertNotEqual(record.token_hash, raw_token)
        self.assertEqual(len(record.token_hash), 64)
        self.assertEqual(
            record.expires_at.replace(tzinfo=timezone.utc),
            now + RESET_TOKEN_LIFETIME,
        )
        self.assertIs(find_valid_reset_token(raw_token, now=now), record)

    def test_unknown_and_empty_tokens_are_invalid(self):
        self.assertIsNone(find_valid_reset_token("unknown"))
        self.assertIsNone(find_valid_reset_token(""))
        self.assertFalse(consume_reset_token("unknown"))

    def test_expired_token_is_invalid_and_cannot_be_consumed(self):
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        raw_token, _ = create_reset_token(self.user.user_id, now=now)
        db.session.commit()

        expired_at = now + RESET_TOKEN_LIFETIME
        self.assertIsNone(find_valid_reset_token(raw_token, now=expired_at))
        self.assertFalse(consume_reset_token(raw_token, now=expired_at))

    def test_consumed_token_cannot_be_reused(self):
        raw_token, _ = create_reset_token(self.user.user_id)
        db.session.commit()

        self.assertTrue(consume_reset_token(raw_token))
        db.session.commit()
        self.assertIsNone(find_valid_reset_token(raw_token))
        self.assertFalse(consume_reset_token(raw_token))

    def test_creating_new_token_invalidates_previous_unused_token(self):
        old_token, _ = create_reset_token(self.user.user_id)
        db.session.commit()
        new_token, _ = create_reset_token(self.user.user_id)
        db.session.commit()

        self.assertIsNone(find_valid_reset_token(old_token))
        self.assertIsNotNone(find_valid_reset_token(new_token))

    def test_consumption_rejects_non_string_tokens(self):
        self.assertIsNone(find_valid_reset_token(None))
        self.assertFalse(consume_reset_token(None))


if __name__ == "__main__":
    unittest.main()