import os
import unittest

os.environ["DATABASE_URL"] = "sqlite://"

from app import app
from utils.errors import ApiError
from utils.validation import MAX_EMAIL_LENGTH, validate_email_format


class EmailFormatTests(unittest.TestCase):
    def test_accepts_valid_emails_and_normalizes_them(self):
        cases = {
            "sam@example.com": "sam@example.com",
            "  SAM@Example.COM  ": "sam@example.com",
            "first.last+tag@mail.example.co.uk": "first.last+tag@mail.example.co.uk",
            "a_b-c@my-site.org": "a_b-c@my-site.org",
        }
        for raw, expected in cases.items():
            with self.subTest(email=raw):
                self.assertEqual(validate_email_format(raw), expected)

    def test_rejects_invalid_emails(self):
        invalid = [
            "plainaddress",
            "@example.com",
            "sam@",
            "sam@example",
            "sam@@example.com",
            "sam @example.com",
            "sam..x@example.com",
            ".sam@example.com",
            "sam.@example.com",
            "sam@-example.com",
            "sam@example..com",
            "sam@example.c",
        ]
        for raw in invalid:
            with self.subTest(email=raw):
                with self.assertRaises(ApiError) as ctx:
                    validate_email_format(raw)
                self.assertEqual(ctx.exception.status_code, 400)
                self.assertIn("email", ctx.exception.errors)

    def test_rejects_email_longer_than_column(self):
        too_long = "a" * MAX_EMAIL_LENGTH + "@example.com"
        with self.assertRaises(ApiError) as ctx:
            validate_email_format(too_long)
        self.assertEqual(ctx.exception.status_code, 400)


class LoginEmailFormatTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_login_rejects_badly_formatted_email(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "not-an-email", "password": "lebanon123"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["status"], "error")
        self.assertIn("email", response.json["errors"])


if __name__ == "__main__":
    unittest.main()