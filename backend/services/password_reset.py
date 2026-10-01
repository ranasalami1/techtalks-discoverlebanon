import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from extensions import db
from models import PasswordResetToken


RESET_TOKEN_LIFETIME = timedelta(hours=1)


def hash_reset_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_reset_token(user_id, now=None):
    now = _as_utc(now or datetime.now(timezone.utc))
    raw_token = secrets.token_urlsafe(32)

    PasswordResetToken.query.filter_by(user_id=user_id, used_at=None).update(
        {"used_at": now},
        synchronize_session="fetch",
    )

    reset_token = PasswordResetToken(
        user_id=user_id,
        token_hash=hash_reset_token(raw_token),
        expires_at=now + RESET_TOKEN_LIFETIME,
    )
    db.session.add(reset_token)
    return raw_token, reset_token


def find_valid_reset_token(raw_token, now=None):
    if not isinstance(raw_token, str) or not raw_token:
        return None

    now = _as_utc(now or datetime.now(timezone.utc))
    reset_token = PasswordResetToken.query.filter_by(
        token_hash=hash_reset_token(raw_token),
    ).populate_existing().first()
    if reset_token is None or reset_token.used_at is not None:
        return None

    if _as_utc(reset_token.expires_at) <= now:
        return None
    return reset_token


def consume_reset_token(raw_token, now=None):
    if not isinstance(raw_token, str) or not raw_token:
        return False

    now = _as_utc(now or datetime.now(timezone.utc))
    consumed = PasswordResetToken.query.filter_by(
        token_hash=hash_reset_token(raw_token),
        used_at=None,
    ).filter(
        PasswordResetToken.expires_at > now,
    ).update(
        {"used_at": now},
        synchronize_session="fetch",
    )
    return consumed == 1


def _as_utc(value):
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)