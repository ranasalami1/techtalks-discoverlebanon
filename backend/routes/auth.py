import re

from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db
from models import User, UserSettings


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# =========================================================
# SIGN UP
# =========================================================

@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {
            "error": "A JSON request body is required"
        }, 400

    full_name = data.get("fullName", data.get("full_name"))
    email = data.get("email")
    password = data.get("password")

    # Validate full name
    if (
        not isinstance(full_name, str)
        or not 2 <= len(full_name.strip()) <= 100
    ):
        return {
            "error": "Full name must be between 2 and 100 characters"
        }, 400

    # Validate email
    if not isinstance(email, str):
        return {
            "error": "A valid email address is required"
        }, 400

    email = email.strip().lower()

    if (
        len(email) > 120
        or not re.fullmatch(
            r"[^\s@]+@[^\s@]+\.[^\s@]+",
            email,
        )
    ):
        return {
            "error": "A valid email address is required"
        }, 400

    # Validate password
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

    # Check duplicate email
    if User.query.filter_by(email=email).first() is not None:
        return {
            "error": "An account with this email already exists"
        }, 409

    # Create user
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

    # Check required fields
    if not isinstance(email, str) or not email.strip():
        return {
            "error": "Email and password are required"
        }, 400

    if not isinstance(password, str) or not password:
        return {
            "error": "Email and password are required"
        }, 400

    email = email.strip().lower()

    # Validate email format
    if not re.fullmatch(
        r"[^\s@]+@[^\s@]+\.[^\s@]+",
        email,
    ):
        return {
            "error": "Invalid email or password"
        }, 401

    # Find user
    user = User.query.filter_by(email=email).first()

    # Verify email and password
    if (
        user is None
        or not check_password_hash(
            user.password_hash,
            password,
        )
    ):
        return {
            "error": "Invalid email or password"
        }, 401

    # Reject inactive accounts
    if not user.is_active:
        return {
            "error": "This account has been deactivated"
        }, 403

    # Create JWT access token
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