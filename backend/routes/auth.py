import re

from flask import Blueprint, request
<<<<<<< HEAD
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from extensions import db
from models import User, UserSettings
=======
from werkzeug.security import check_password_hash

from models import User
>>>>>>> e288d94 (KAN-233: sign in into your account succesully)


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


<<<<<<< HEAD
@auth_bp.post("/signup")
def signup():
=======
@auth_bp.post("/login")
def login():
>>>>>>> e288d94 (KAN-233: sign in into your account succesully)
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return {"error": "A JSON request body is required"}, 400

<<<<<<< HEAD
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
=======
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
>>>>>>> e288d94 (KAN-233: sign in into your account succesully)
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
<<<<<<< HEAD
    }, 201
=======
    }, 200
>>>>>>> e288d94 (KAN-233: sign in into your account succesully)
