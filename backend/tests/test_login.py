import os
import unittest

# Must be set before importing the app: the database engine is created at
# init_app time, so changing the config later would still hit the real DB.
os.environ["DATABASE_URL"] = "sqlite://"

from werkzeug.security import generate_password_hash

from app import app
from extensions import db
from models import User


class LoginEndpointTests(unittest.TestCase):
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
        self.client = app.test_client()
        with app.app_context():
            db.session.add(
                User(
                    full_name="Sam User",
                    email="sam@example.com",
                    password_hash=generate_password_hash("lebanon123"),
                )
            )
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()

    def test_logs_in_with_correct_credentials(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": " SAM@example.com ", "password": "lebanon123"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["user"]["email"], "sam@example.com")
        self.assertEqual(response.json["user"]["fullName"], "Sam User")
        self.assertNotIn("password", response.json["user"])

    def test_rejects_incorrect_password(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "sam@example.com", "password": "wrong-password"},
        )

        self.assertEqual(response.status_code, 401)

    def test_rejects_unknown_email(self):
        response = self.client.post(
            "/api/auth/login",
            json={"email": "nobody@example.com", "password": "lebanon123"},
        )

        self.assertEqual(response.status_code, 401)

    def test_rejects_deactivated_account(self):
        with app.app_context():
            user = User.query.filter_by(email="sam@example.com").one()
            user.is_active = False
            db.session.commit()

        response = self.client.post(
            "/api/auth/login",
            json={"email": "sam@example.com", "password": "lebanon123"},
        )

        self.assertEqual(response.status_code, 403)

    def test_rejects_missing_fields(self):
        response = self.client.post("/api/auth/login", json={"email": "sam@example.com"})

        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
