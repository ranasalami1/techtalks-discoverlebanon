from extensions import db
from .place_category import place_categories


class Place(db.Model):
    __tablename__ = "places"

    place_id = db.Column(
        db.Integer,
        primary_key=True
    )

    # =====================================================
    # BASIC INFORMATION
    # =====================================================

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

    # Restaurant / Cafe / Activity subtype
    # Examples:
    # "Restaurant / grills"
    # "Cafe"
    # "Sports / Football"
    venue_type = db.Column(
        db.String(150),
        nullable=True
    )

    # Useful mainly for activities
    # Examples:
    # "Nature / Hiking"
    # "Heritage / Culture"
    # "Sports / Fitness"
    category_group = db.Column(
        db.String(100),
        nullable=True
    )

    # =====================================================
    # LOCATION
    # =====================================================

    city = db.Column(
        db.String(100),
        nullable=True,
        index=True
    )

    region = db.Column(
        db.String(100),
        nullable=True,
        index=True
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

    # =====================================================
    # BUSINESS / VISITOR INFORMATION
    # =====================================================

    opening_hours = db.Column(
        db.String(200),
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

    # Examples:
    # Active - verified
    # Listed current
    # Needs verification
    # Historical lead
    status = db.Column(
        db.String(100),
        nullable=True
    )

    rating = db.Column(
        db.Numeric(3, 2),
        nullable=True
    )

    review_count = db.Column(
        db.Integer,
        nullable=True
    )

    # Activities may have:
    # Community facility
    # Access unknown
    # Public
    public_access = db.Column(
        db.String(100),
        nullable=True
    )

    # =====================================================
    # RESEARCH / SOURCE INFORMATION
    # =====================================================

    confidence = db.Column(
        db.String(50),
        nullable=True
    )

    locality_match = db.Column(
        db.String(150),
        nullable=True
    )

    evidence_source = db.Column(
        db.String(255),
        nullable=True
    )

    source_url = db.Column(
        db.Text,
        nullable=True
    )

    map_url = db.Column(
        db.Text,
        nullable=True
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )

    last_checked = db.Column(
        db.Date,
        nullable=True
    )

    # =====================================================
    # TIMESTAMPS
    # =====================================================

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

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

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