from extensions import db


class Itinerary(db.Model):
    __tablename__ = "itineraries"

    itinerary_id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    duration_days = db.Column(
        db.Integer,
        nullable=True
    )

    difficulty = db.Column(
        db.String(50),
        nullable=True
    )

    cover_image = db.Column(
        db.String(255),
        nullable=True
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

    place_links = db.relationship(
        "ItineraryPlace",
        backref="itinerary",
        cascade="all, delete-orphan",
        order_by="ItineraryPlace.visit_order"
    )