from extensions import db


class UserSettings(db.Model):
    __tablename__ = "user_settings"

    setting_id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    language = db.Column(
        db.String(20),
        nullable=False,
        default="en"
    )

    email_notifications = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    push_notifications = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        onupdate=db.func.now(),
        nullable=False
    )