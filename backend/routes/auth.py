import re

from flask import Blueprint, request
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from extensions import db
from models import User, UserSettings


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return {"error": "A JSON request body is required"}, 400

    full_name = data.get("fullName", data.get("full_name"))
    email = data.get("email")
    password = data.get("password")

    if not isinstance(full_name, str) or not 2 <= len(full_name.strip()) <= 100:
        return {"error": "Full name must be between 2 and 100 characters"}, 400
    if not isinstance(email, str):
        return {"error": "A valid email address is required"}, 400

    email = email.strip().lower()
    if len(email) > 120 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return {"error": "A valid email address is required"}, 400
    if not isinstance(password, str) or len(password) < 8 or not re.search(r"\d", password):
        return {"error": "Password must be at least 8 characters and include a number"}, 400

    if User.query.filter_by(email=email).first() is not None:
        return {"error": "An account with this email already exists"}, 409

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
            return {"error": "An account with this email already exists"}, 409
        raise

    return {
        "message": "Account created successfully",
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
    }, 201