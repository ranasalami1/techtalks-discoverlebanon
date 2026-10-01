import os
import unittest

# Must be set before importing the app: the database engine is created at
# init_app time, so changing the config later would still hit the real DB.
os.environ["DATABASE_URL"] = "sqlite://"

from werkzeug.security import check_password_hash

from app import app
from extensions import db
from models import User, UserSettings


class SignupEndpointTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(TESTING=True)
        with app.app_context():
            assert db.engine.url.drivername == "sqlite", "Tests must not use the real database"
            db.create_all()

    @classmethod
    def tearDownClass(cls):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def setUp(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

        self.client = app.test_client()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

    def test_creates_user_with_hashed_password_and_default_settings(self):
        response = self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "  Sam User  ",
                "email": " SAM@example.com ",
                "password": "lebanon123",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["user"]["fullName"], "Sam User")
        self.assertEqual(response.json["user"]["email"], "sam@example.com")
        self.assertNotIn("password", response.json["user"])

        with app.app_context():
            user = User.query.filter_by(email="sam@example.com").one()
            self.assertTrue(check_password_hash(user.password_hash, "lebanon123"))
            self.assertNotEqual(user.password_hash, "lebanon123")
            self.assertIsInstance(user.settings, UserSettings)

    def test_rejects_duplicate_email_case_insensitively(self):
        payload = {
            "fullName": "Sam User",
            "email": "sam@example.com",
            "password": "lebanon123",
        }
        self.assertEqual(self.client.post("/api/auth/signup", json=payload).status_code, 201)
        payload["email"] = "SAM@example.com"

        response = self.client.post("/api/auth/signup", json=payload)

        self.assertEqual(response.status_code, 409)

    def test_rejects_invalid_signup_data(self):
        response = self.client.post(
            "/api/auth/signup",
            json={"fullName": "S", "email": "not-an-email", "password": "short"},
        )

        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()