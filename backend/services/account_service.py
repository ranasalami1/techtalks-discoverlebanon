from sqlalchemy.exc import IntegrityError

from extensions import db
from models import User


def serialize_account(user):
    return {
        "id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image": user.profile_image,
        "created_at": (
            user.created_at.isoformat()
            if user.created_at is not None
            else None
        ),
    }


def get_account(user_id):
    user = db.session.get(User, user_id)

    if user is None or not user.is_active:
        return None

    return serialize_account(user)


def update_account(user_id, data):
    user = db.session.get(User, user_id)

    if user is None or not user.is_active:
        return None, "not_found"

    if "email" in data:
        new_email = data["email"]

        existing_user = db.session.query(
            User.user_id
        ).filter(
            db.func.lower(User.email) == new_email.lower(),
            User.user_id != user_id,
        ).first()

        if existing_user:
            return None, "duplicate_email"

        user.email = new_email

    if "full_name" in data:
        user.full_name = data["full_name"]

    if "profile_image" in data:
        user.profile_image = data["profile_image"]

    try:
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return None, "duplicate_email"

    return serialize_account(user), None