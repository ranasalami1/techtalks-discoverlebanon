from extensions import db


class ItineraryPlace(db.Model):
    __tablename__ = "itinerary_places"

    itinerary_id = db.Column(
        db.Integer,
        db.ForeignKey("itineraries.itinerary_id", ondelete="CASCADE"),
        primary_key=True
    )

    place_id = db.Column(
        db.Integer,
        db.ForeignKey("places.place_id", ondelete="CASCADE"),
        primary_key=True
    )

    visit_order = db.Column(
        db.Integer,
        nullable=False
    )

    day_number = db.Column(
        db.Integer,
        nullable=True
    )

    notes = db.Column(
        db.Text,
        nullable=True
    )