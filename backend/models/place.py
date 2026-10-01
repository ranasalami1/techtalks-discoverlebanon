from extensions import db
from .place_category import place_categories


class Place(db.Model):
    __tablename__ = "places"

    place_id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False,
        index=True
    )

    short_description = db.Column(
        db.String(300),
        nullable=True
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    city = db.Column(
        db.String(100),
        nullable=True,
        index=True
    )

    region = db.Column(
        db.String(100),
        nullable=True
    )

    address = db.Column(
        db.String(255),
        nullable=True
    )

    latitude = db.Column(
        db.Numeric(9, 6),
        nullable=True
    )

    longitude = db.Column(
        db.Numeric(9, 6),
        nullable=True
    )

    opening_hours = db.Column(
        db.String(150),
        nullable=True
    )

    entrance_fee = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    website = db.Column(
        db.String(255),
        nullable=True
    )

    phone = db.Column(
        db.String(50),
        nullable=True
    )

    featured_image = db.Column(
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

    images = db.relationship(
        "PlaceImage",
        backref="place",
        cascade="all, delete-orphan"
    )

    categories = db.relationship(
        "Category",
        secondary=place_categories,
        backref="places"
    )

    saved_by_users = db.relationship(
        "SavedPlace",
        backref="place",
        cascade="all, delete-orphan"
    )

    itinerary_links = db.relationship(
        "ItineraryPlace",
        backref="place",
        cascade="all, delete-orphan"
    )