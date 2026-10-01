import hashlib
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from flask import current_app

from extensions import db
from models import PasswordResetToken


def token_digest(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_reset_token(user_id):
    token = secrets.token_urlsafe(32)
    reset_token = PasswordResetToken(
        user_id=user_id,
        token_hash=token_digest(token),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    return token, reset_token


def send_password_reset_email(email, reset_url):
    message = EmailMessage()
    message["Subject"] = "Reset your Discover Lebanon password"
    message["From"] = current_app.config["MAIL_FROM"]
    message["To"] = email
    message.set_content(
        "Use the following link to reset your Discover Lebanon password. "
        f"This link expires in one hour:\n\n{reset_url}"
    )

    with smtplib.SMTP(
        current_app.config["SMTP_HOST"], current_app.config["SMTP_PORT"]
    ) as smtp:
        if current_app.config.get("SMTP_USE_TLS", True):
            smtp.starttls()
        username = current_app.config.get("SMTP_USERNAME")
        password = current_app.config.get("SMTP_PASSWORD")
        if username and password:
            smtp.login(username, password)
        smtp.send_message(message)