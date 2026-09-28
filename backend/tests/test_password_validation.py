import os
import unittest

os.environ["DATABASE_URL"] = "sqlite://"

from utils.errors import ApiError
from utils.validation import (
    MAX_PASSWORD_LENGTH,
    validate_password_requirements,
)


class PasswordRequirementsTests(unittest.TestCase):
    def test_accepts_valid_passwords(self):
        valid = [
            "lebanon123",
            "Passw0rd!",
            "correct horse 9 battery",
            "مرحبا12345",
        ]
        for password in valid:
            with self.subTest(password=password):
                self.assertEqual(validate_password_requirements(password), password)

    def test_rejects_each_broken_rule(self):
        invalid = {
            "short1": "8 characters",
            "onlyletters": "number",
            "12345678": "letter",
            " lebanon123": "space",
            "lebanon123 ": "space",
        }
        for password, expected_text in invalid.items():
            with self.subTest(password=password):
                with self.assertRaises(ApiError) as ctx:
                    validate_password_requirements(password)
                self.assertEqual(ctx.exception.status_code, 400)
                self.assertIn(expected_text, ctx.exception.errors["password"])

    def test_rejects_password_that_is_too_long(self):
        too_long = "a1" * (MAX_PASSWORD_LENGTH // 2 + 1)
        with self.assertRaises(ApiError) as ctx:
            validate_password_requirements(too_long)
        self.assertIn(str(MAX_PASSWORD_LENGTH), ctx.exception.errors["password"])

    def test_reports_every_problem_at_once(self):
        with self.assertRaises(ApiError) as ctx:
            validate_password_requirements("abc")
        message = ctx.exception.errors["password"]
        self.assertIn("8 characters", message)
        self.assertIn("number", message)

    def test_uses_custom_field_name(self):
        with self.assertRaises(ApiError) as ctx:
            validate_password_requirements("abc", field="newPassword")
        self.assertIn("newPassword", ctx.exception.errors)


if __name__ == "__main__":
    unittest.main()