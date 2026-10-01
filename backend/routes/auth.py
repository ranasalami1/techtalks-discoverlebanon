import hashlib
import re
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

from flask import Blueprint, current_app,jsonify, request
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models import PasswordResetToken, User, UserSettings
from services import send_password_reset_email
from services.password_reset import token_digest

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

RESET_REQUEST_MESSAGE = (
    "If an account with that email exists, a password reset link has been sent."
)

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


# =========================================================
# SIGN UP
# =========================================================

@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {"error": "A JSON request body is required"}, 400

    full_name = data.get("fullName", data.get("full_name"))
    email = data.get("email")
    password = data.get("password")

    if (
        not isinstance(full_name, str)
        or not 2 <= len(full_name.strip()) <= 100
    ):
        return {
            "error": "Full name must be between 2 and 100 characters"
        }, 400

    if not isinstance(email, str):
        return {
            "error": "A valid email address is required"
        }, 400

    email = email.strip().lower()

    if (
        len(email) > 120
        or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email)
    ):
        return {
            "error": "A valid email address is required"
        }, 400

    if (
        not isinstance(password, str)
        or len(password) < 8
        or not re.search(r"\d", password)
    ):
        return {
            "error": (
                "Password must be at least 8 characters "
                "and include a number"
            )
        }, 400

    if User.query.filter_by(email=email).first() is not None:
        return {
            "error": "An account with this email already exists"
        }, 409

    user = User(
        full_name=full_name.strip(),
        email=email,
        password_hash=generate_password_hash(password),
        settings=UserSettings(),
    )

    db.session.add(user)

    try:
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        if User.query.filter_by(email=email).first() is not None:
            return {
                "error": "An account with this email already exists"
            }, 409

        raise

    return {
        "message": "Account created successfully",
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
    }, 201


# =========================================================
# LOGIN
# =========================================================

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "error": "A JSON request body is required"
        }, 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not email.strip():
        return {
            "error": "Email and password are required"
        }, 400

    if not isinstance(password, str) or not password:
        return {
            "error": "Email and password are required"
        }, 400

    email = email.strip().lower()

    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return {
            "error": "Invalid email or password"
        }, 401

    user = User.query.filter_by(email=email).first()

    if (
        user is None
        or not check_password_hash(user.password_hash, password)
    ):
        return {
            "error": "Invalid email or password"
        }, 401

    if not user.is_active:
        return {
            "error": "This account has been deactivated"
        }, 403

    access_token = create_access_token(
        identity=str(user.user_id)
    )

    return {
        "message": "Logged in successfully",
        "accessToken": access_token,
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
    }, 200


# =========================================================
# FORGOT PASSWORD
# =========================================================

@auth_bp.post("/forgot-password")
def forgot_password():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "error": "A JSON object is required."
        }), 400

    email = payload.get("email")

    if not isinstance(email, str):
        return jsonify({
            "error": "A valid email address is required."
        }), 400

    email = email.strip().lower()

    if len(email) > 120 or not EMAIL_PATTERN.fullmatch(email):
        return jsonify({
            "error": "A valid email address is required."
        }), 400

    user = User.query.filter(
        db.func.lower(User.email) == email
    ).first()

    if user is None or not user.is_active:
        return jsonify({
            "message": RESET_REQUEST_MESSAGE
        }), 202

    token = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc)

    reset_token = PasswordResetToken(
        user_id=user.user_id,
        token_hash=hashlib.sha256(
            token.encode("utf-8")
        ).hexdigest(),
        expires_at=now + timedelta(hours=1),
    )

    db.session.add(reset_token)

    try:
        db.session.commit()

        frontend_url = current_app.config[
            "FRONTEND_URL"
        ].rstrip("/")

        reset_url = (
            f"{frontend_url}/reset-password"
            f"?token={quote(token)}"
        )

        send_password_reset_email(
            email,
            reset_url,
        )

    except Exception:
        db.session.rollback()

        if reset_token in db.session:
            db.session.delete(reset_token)
            db.session.commit()

        current_app.logger.exception(
            "Unable to send password reset email"
        )

    return jsonify({
        "message": RESET_REQUEST_MESSAGE
    }), 202



# =========================================================
# RESET PASSWORD
# =========================================================

@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json(silent=True) or {}

    token = data.get("token", "")
    password = data.get("password", "")

    if (
        not isinstance(token, str)
        or not token
        or not isinstance(password, str)
    ):
        return jsonify({
            "error": "A reset token and new password are required."
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long."
        }), 400

    reset_token = PasswordResetToken.query.filter_by(
        token_hash=token_digest(token)
    ).first()

    if not reset_token or reset_token.used_at is not None:
        return jsonify({
            "error": "This password reset link is invalid or expired."
        }), 400

    expires_at = reset_token.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at <= datetime.now(timezone.utc):
        return jsonify({
            "error": "This password reset link is invalid or expired."
        }), 400

    user = db.session.get(
        User,
        reset_token.user_id,
    )

    if not user or not user.is_active:
        return jsonify({
            "error": "This password reset link is invalid or expired."
        }), 400

    used_at = datetime.now(timezone.utc)

    consumed = PasswordResetToken.query.filter_by(
        reset_id=reset_token.reset_id,
        used_at=None,
    ).filter(
        PasswordResetToken.expires_at > used_at,
    ).update(
        {"used_at": used_at},
        synchronize_session=False,
    )

    if consumed != 1:
        db.session.rollback()

        return jsonify({
            "error": "This password reset link is invalid or expired."
        }), 400

    user.password_hash = generate_password_hash(password)

    PasswordResetToken.query.filter(
        PasswordResetToken.user_id == user.user_id,
        PasswordResetToken.reset_id != reset_token.reset_id,
        PasswordResetToken.used_at.is_(None),
    ).update(
        {"used_at": db.func.now()},
        synchronize_session=False,
    )

    db.session.commit()

    return jsonify({
        "message": "Your password has been reset successfully."
    }), 200