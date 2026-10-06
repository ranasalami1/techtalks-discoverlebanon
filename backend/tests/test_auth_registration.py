import unittest

from flask import Flask
from werkzeug.security import check_password_hash

from extensions import db
from models import User
from routes.auth import auth_bp


class RegistrationTests(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)

        self.app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
        )

        db.init_app(self.app)
        self.app.register_blueprint(auth_bp)

        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()

        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    @staticmethod
    def valid_payload(**overrides):
        payload = {
            "full_name": "Maya Haddad",
            "email": "maya@example.com",
            "password": "securepass1",
        }
        payload.update(overrides)
        return payload

    def test_register_creates_user_with_hashed_password(self):
        response = self.client.post(
            "/api/auth/signup",
            json=self.valid_payload(),
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["user"]["email"], "maya@example.com")
        user = User.query.one()
        self.assertTrue(check_password_hash(user.password_hash, "securepass1"))
        self.assertNotEqual(user.password_hash, "securepass1")

    def test_duplicate_email_returns_conflict(self):
        self.client.post("/api/auth/signup", json=self.valid_payload())

        response = self.client.post("/api/auth/signup", json=self.valid_payload())

        self.assertEqual(response.status_code, 409)
        self.assertIn("already exists", response.json["error"])
        self.assertEqual(User.query.count(), 1)

    def test_duplicate_email_is_case_insensitive(self):
        self.client.post("/api/auth/signup", json=self.valid_payload())

        response = self.client.post(
            "/api/auth/signup",
            json=self.valid_payload(email=" Maya@Example.com "),
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(User.query.count(), 1)

    def test_existing_mixed_case_email_returns_conflict(self):
        db.session.add(User(
            full_name="Maya Haddad",
            email="Maya@Example.com",
            password_hash="existing-hash",
        ))
        db.session.commit()

        response = self.client.post(
            "/api/auth/signup",
            json=self.valid_payload(email="maya@example.com"),
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(User.query.count(), 1)

    def test_registration_rejects_missing_fields(self):
        response = self.client.post(
            "/api/auth/signup",
            json={"email": "maya@example.com", "password": "securepass1"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.query.count(), 0)

    def test_registration_rejects_invalid_email(self):
        response = self.client.post(
            "/api/auth/signup",
            json=self.valid_payload(email="not-an-email"),
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.query.count(), 0)

    def test_registration_rejects_weak_password(self):
        response = self.client.post(
            "/api/auth/signup",
            json=self.valid_payload(password="password"),
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.query.count(), 0)

    def test_registration_rejects_non_object_json(self):
        response = self.client.post("/api/auth/signup", json=["not", "an", "object"])

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.query.count(), 0)


if __name__ == "__main__":
    unittest.main()