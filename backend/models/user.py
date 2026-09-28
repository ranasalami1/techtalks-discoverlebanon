from extensions import db


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    profile_image = db.Column(
        db.String(255),
        nullable=True
    )

    is_active = db.Column(
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

    # Relationships

    settings = db.relationship(
        "UserSettings",
        backref="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    password_reset_tokens = db.relationship(
        "PasswordResetToken",
        backref="user",
        cascade="all, delete-orphan"
    )

    saved_places = db.relationship(
        "SavedPlace",
        backref="user",
        cascade="all, delete-orphan"
    )