import unittest

from flask import Flask
from urllib.parse import parse_qs, urlparse
from extensions import db, jwt
from routes.auth import auth_bp
from unittest.mock import patch

class AuthenticationEndpointsTests(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)

        self.app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY="test-jwt-secret-key-12345678901234567890",
            FRONTEND_URL="http://localhost:3000",
            SMTP_HOST="smtp.example.test",
            SMTP_PORT=587,
            SMTP_USE_TLS=True,
            SMTP_SENDER="noreply@example.test",
            MAIL_FROM="noreply@example.test",
        )

        db.init_app(self.app)
        jwt.init_app(self.app)
        self.app.register_blueprint(auth_bp)

        self.app_context = self.app.app_context()
        self.app_context.push()

        db.create_all()

        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    # =====================================================
    # TEST 1 - SIGN UP
    # =====================================================

    def test_signup_endpoint(self):
        response = self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "Test User",
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(
            response.get_json()["message"],
            "Account created successfully",
        )

        self.assertEqual(
            response.get_json()["user"]["email"],
            "test@example.com",
        )

    # =====================================================
    # TEST 2 - DUPLICATE EMAIL
    # =====================================================

    def test_duplicate_email_is_rejected(self):
        payload = {
            "fullName": "Test User",
            "email": "test@example.com",
            "password": "Password123",
        }

        first_response = self.client.post(
            "/api/auth/signup",
            json=payload,
        )

        self.assertEqual(first_response.status_code, 201)

        payload["email"] = "TEST@example.com"

        second_response = self.client.post(
            "/api/auth/signup",
            json=payload,
        )

        self.assertEqual(second_response.status_code, 409)

        self.assertEqual(
            second_response.get_json()["error"],
            "An account with this email already exists",
        )

    # =====================================================
    # TEST 3 - LOGIN + JWT
    # =====================================================

    def test_login_returns_jwt(self):
        signup_response = self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "Test User",
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        self.assertEqual(signup_response.status_code, 201)

        login_response = self.client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        self.assertEqual(login_response.status_code, 200)

        data = login_response.get_json()

        self.assertEqual(
            data["message"],
            "Logged in successfully",
        )

        self.assertIn("accessToken", data)
        self.assertTrue(data["accessToken"])

        self.assertEqual(
            data["user"]["email"],
            "test@example.com",
        )

    # =====================================================
    # TEST 4 - INVALID LOGIN
    # =====================================================

    def test_invalid_login_credentials(self):
        self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "Test User",
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        response = self.client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "WrongPassword123",
            },
        )

        self.assertEqual(response.status_code, 401)

        self.assertEqual(
            response.get_json()["error"],
            "Invalid email or password",
        )

# =====================================================
# TEST 5 - FORGOT PASSWORD
# =====================================================

    # =====================================================
    # TEST 5 - FORGOT PASSWORD
    # =====================================================

    def test_forgot_password_endpoint(self):
        # Create a user first
        self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "Test User",
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        with patch("routes.auth.send_password_reset_email") as send_email:
            response = self.client.post(
                "/api/auth/forgot-password",
                json={
                    "email": "test@example.com",
                },
            )

        self.assertEqual(response.status_code, 202)

        self.assertIn(
            "message",
            response.get_json(),
        )

       
    # =====================================================
    # TEST 6 - RESET PASSWORD
    # =====================================================

    def test_reset_password_endpoint(self):
        # Create user
        self.client.post(
            "/api/auth/signup",
            json={
                "fullName": "Test User",
                "email": "test@example.com",
                "password": "Password123",
            },
        )

        # Request password reset and capture reset link
        with patch("routes.auth.send_password_reset_email") as send_email:
            forgot_response = self.client.post(
                "/api/auth/forgot-password",
                json={
                    "email": "test@example.com",
                },
            )

        self.assertEqual(forgot_response.status_code, 202)

        reset_url = send_email.call_args.args[1]

        token = parse_qs(
            urlparse(reset_url).query
        )["token"][0]

        # Reset password
        reset_response = self.client.post(
            "/api/auth/reset-password",
            json={
                "token": token,
                "password": "NewPassword123",
            },
        )

        self.assertEqual(reset_response.status_code, 200)

        self.assertEqual(
            reset_response.get_json()["message"],
            "Your password has been reset successfully.",
        )

        # Verify new password works
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "email": "test@example.com",
                "password": "NewPassword123",
            },
        )

        self.assertEqual(login_response.status_code, 200)
        self.assertIn(
            "accessToken",
            login_response.get_json(),
        )

    # =====================================================
    # TEST 7 - INVALID RESET TOKEN
    # =====================================================

    def test_invalid_reset_token_is_rejected(self):
        response = self.client.post(
            "/api/auth/reset-password",
            json={
                "token": "invalid-token",
                "password": "NewPassword123",
            },
        )

        self.assertEqual(
            response.status_code,
            400,
        )

        self.assertEqual(
            response.get_json()["error"],
            "This password reset link is invalid or expired.",
        )

          # =====================================================
    # TEST 7 - INVALID RESET TOKEN
    # =====================================================

    def test_invalid_reset_token_is_rejected(self):
        response = self.client.post(
            "/api/auth/reset-password",
            json={
                "token": "invalid-token",
                "password": "NewPassword123",
            },
        )

        self.assertEqual(
            response.status_code,
            400,
        )

        self.assertEqual(
            response.get_json()["error"],
            "This password reset link is invalid or expired.",
        )


     
if __name__ == "__main__":
    unittest.main()