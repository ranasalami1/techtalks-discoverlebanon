import os
import unittest

from werkzeug.security import generate_password_hash


# IMPORTANT:
# Set the test database BEFORE importing the Flask app.
# This prevents the tests from connecting to the real PostgreSQL database.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"


from app import app
from extensions import db
from models import User


class LoginTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        app.config["TESTING"] = True

        cls.app_context = app.app_context()
        cls.app_context.push()

        db.create_all()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        self.client = app.test_client()

        db.session.query(User).delete()
        db.session.commit()

        self.user = User(
            full_name="Test User",
            email="test@example.com",
            password_hash=generate_password_hash("correct-password"),
        )

        db.session.add(self.user)
        db.session.commit()

    def test_invalid_credentials_return_same_generic_error(self):
        unknown_user = self.client.post(
            "/api/auth/login",
            json={
                "email": "unknown@example.com",
                "password": "wrong-password",
            },
        )

        wrong_password = self.client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrong-password",
            },
        )

        self.assertEqual(unknown_user.status_code, 401)
        self.assertEqual(wrong_password.status_code, 401)

        self.assertEqual(
            unknown_user.get_json(),
            wrong_password.get_json(),
        )

        self.assertEqual(
            unknown_user.get_json()["error"],
            "Invalid email or password",
        )

    def test_valid_credentials_return_public_user_details(self):
        response = self.client.post(
            "/api/auth/login",
            json={
                "email": " TEST@example.com ",
                "password": "correct-password",
            },
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.get_json()["user"]["email"],
            "test@example.com",
        )

        self.assertNotIn(
            "password_hash",
            response.get_json()["user"],
        )

    def test_missing_credentials_return_bad_request(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "test@example.com"},
        )

        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()