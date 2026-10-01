from datetime import datetime, timezone
import smtplib

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy import func
from werkzeug.security import generate_password_hash

from extensions import db
from models import PasswordResetToken, User
from services.password_reset import (
    create_reset_token,
    send_password_reset_email,
    token_digest,
)


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    if not isinstance(email, str):
        return jsonify({"error": "A valid email address is required."}), 400
    email = email.strip().lower()
    if not email or "@" not in email:
        return jsonify({"error": "A valid email address is required."}), 400

    if not current_app.config.get("SMTP_HOST") or not current_app.config.get("MAIL_FROM"):
        return jsonify({"error": "Password reset email delivery is not configured."}), 503

    user = User.query.filter(func.lower(User.email) == email, User.is_active.is_(True)).first()
    if user:
        raw_token, reset_token = create_reset_token(user.user_id)
        PasswordResetToken.query.filter_by(user_id=user.user_id, used_at=None).update(
            {"used_at": reset_token.created_at or db.func.now()},
            synchronize_session=False,
        )
        db.session.add(reset_token)
        db.session.commit()

        reset_url = f"{current_app.config['FRONTEND_URL'].rstrip('/')}/reset-password?token={raw_token}"
        try:
            send_password_reset_email(email, reset_url)
        except (OSError, smtplib.SMTPException):
            current_app.logger.exception("Unable to send password reset email")

    return jsonify({
        "message": "If an account exists for that email, password reset instructions have been sent."
    }), 200


@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token", "")
    password = data.get("password", "")
    if not isinstance(token, str) or not token or not isinstance(password, str):
        return jsonify({"error": "A reset token and new password are required."}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long."}), 400

    reset_token = PasswordResetToken.query.filter_by(token_hash=token_digest(token)).first()
    if not reset_token or reset_token.used_at is not None:
        return jsonify({"error": "This password reset link is invalid or expired."}), 400
    expires_at = reset_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        return jsonify({"error": "This password reset link is invalid or expired."}), 400

    user = db.session.get(User, reset_token.user_id)
    if not user or not user.is_active:
        return jsonify({"error": "This password reset link is invalid or expired."}), 400

    used_at = datetime.now(timezone.utc)
    consumed = PasswordResetToken.query.filter_by(
        reset_id=reset_token.reset_id,
        used_at=None,
    ).filter(
        PasswordResetToken.expires_at > used_at,
    ).update({"used_at": used_at}, synchronize_session=False)
    if consumed != 1:
        db.session.rollback()
        return jsonify({"error": "This password reset link is invalid or expired."}), 400

    user.password_hash = generate_password_hash(password)
    PasswordResetToken.query.filter(
        PasswordResetToken.user_id == user.user_id,
        PasswordResetToken.reset_id != reset_token.reset_id,
        PasswordResetToken.used_at.is_(None),
    ).update({"used_at": db.func.now()}, synchronize_session=False)
    db.session.commit()

    return jsonify({"message": "Your password has been reset successfully."}), 200