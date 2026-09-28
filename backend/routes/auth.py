import re

from flask import Blueprint, request
from werkzeug.security import check_password_hash

from models import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return {"error": "A JSON request body is required"}, 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not email.strip():
        return {"error": "Email and password are required"}, 400
    if not isinstance(password, str) or not password:
        return {"error": "Email and password are required"}, 400

    email = email.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return {"error": "Invalid email or password"}, 401

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return {"error": "Invalid email or password"}, 401

    if not user.is_active:
        return {"error": "This account has been deactivated"}, 403

    return {
        "message": "Logged in successfully",
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
    }, 200
