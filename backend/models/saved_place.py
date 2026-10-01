from extensions import db


class SavedPlace(db.Model):
    __tablename__ = "saved_places"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )

    place_id = db.Column(
        db.Integer,
        db.ForeignKey("places.place_id", ondelete="CASCADE"),
        primary_key=True
    )

    saved_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )