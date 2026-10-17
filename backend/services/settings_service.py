from extensions import db
from models import UserSettings


def serialize_settings(settings):
    return {
        "language": settings.language,
        "email_notifications": settings.email_notifications,
        "push_notifications": settings.push_notifications,
    }


def get_settings(user_id):
    settings = UserSettings.query.filter_by(
        user_id=user_id
    ).first()

    if settings is None:
        return None

    return serialize_settings(settings)


def update_settings(user_id, data):
    settings = UserSettings.query.filter_by(
        user_id=user_id
    ).first()

    if settings is None:
        return None

    if "language" in data:
        settings.language = data["language"]

    if "email_notifications" in data:
        settings.email_notifications = data["email_notifications"]

    if "push_notifications" in data:
        settings.push_notifications = data["push_notifications"]

    db.session.commit()

    return serialize_settings(settings)