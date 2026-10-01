import hashlib
import re
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

from flask import Blueprint, current_app, jsonify, request

from extensions import db
from models import PasswordResetToken, User
from services import send_password_reset_email


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
RESET_REQUEST_MESSAGE = (
    "If an account with that email exists, a password reset link has been sent."
)
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@auth_bp.post("/forgot-password")
def forgot_password():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "A JSON object is required."}), 400

    email = payload.get("email")
    if not isinstance(email, str):
        return jsonify({"error": "A valid email address is required."}), 400

    email = email.strip().lower()
    if len(email) > 120 or not EMAIL_PATTERN.fullmatch(email):
        return jsonify({"error": "A valid email address is required."}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if user is None or not user.is_active:
        return jsonify({"message": RESET_REQUEST_MESSAGE}), 202

    token = secrets.token_urlsafe(32)
    now = datetime.now(timezone.utc)
    reset_token = PasswordResetToken(
        user_id=user.user_id,
        token_hash=hashlib.sha256(token.encode("utf-8")).hexdigest(),
        expires_at=now + timedelta(hours=1),
    )
    db.session.add(reset_token)

    try:
        db.session.commit()
        frontend_url = current_app.config["FRONTEND_URL"].rstrip("/")
        reset_url = f"{frontend_url}/reset-password?token={quote(token)}"
        send_password_reset_email(email, reset_url)
    except Exception:
        db.session.rollback()
        if reset_token in db.session:
            db.session.delete(reset_token)
            db.session.commit()
        current_app.logger.exception("Unable to send password reset email")

    return jsonify({"message": RESET_REQUEST_MESSAGE}), 202