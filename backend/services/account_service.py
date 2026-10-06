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
        return None

    if "full_name" in data:
        user.full_name = data["full_name"]

    if "email" in data:
        user.email = data["email"]

    if "profile_image" in data:
        user.profile_image = data["profile_image"]

    db.session.commit()

    return serialize_account(user)