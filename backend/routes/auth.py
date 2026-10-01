import re

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash

from extensions import db
from models import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="A JSON object is required."), 400

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if not isinstance(full_name, str) or not 2 <= len(full_name.strip()) <= 100:
        return jsonify(error="Full name must be between 2 and 100 characters."), 400

    if not isinstance(email, str):
        return jsonify(error="A valid email address is required."), 400
    email = email.strip().lower()
    if len(email) > 120 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify(error="A valid email address is required."), 400

    if not isinstance(password, str) or len(password) < 8 or not re.search(r"\d", password):
        return jsonify(error="Password must be at least 8 characters and include a number."), 400

    existing_user = db.session.query(User.user_id).filter(
        db.func.lower(User.email) == email
    ).first()
    if existing_user:
        return jsonify(error="An account with this email already exists."), 409

    user = User(
        full_name=full_name.strip(),
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        duplicate_user = db.session.query(User.user_id).filter(
            db.func.lower(User.email) == email
        ).first()
        if duplicate_user:
            return jsonify(error="An account with this email already exists."), 409
        raise

    return jsonify(
        message="Registration successful.",
        user={
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        },
    ), 201