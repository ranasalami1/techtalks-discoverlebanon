from sqlalchemy.orm import selectinload

from extensions import db
from models import Itinerary, ItineraryPlace, Place
from services.place_service import (
    DEFAULT_PER_PAGE,
    MAX_ID,
    MAX_PER_PAGE,
    serialize_place_summary
)


def _with_stops():
    # Load each itinerary's stops, their places and the places' categories
    # in a few queries up front, instead of one query per stop
    return (
        selectinload(Itinerary.place_links)
        .selectinload(ItineraryPlace.place)
        .selectinload(Place.categories)
    )


def get_itineraries(page=1, per_page=DEFAULT_PER_PAGE):
    # Curated order: the order the team added them in
    query = (
        db.select(Itinerary)
        .options(_with_stops())
        .order_by(Itinerary.itinerary_id)
    )

    # Same page rules as the Places list
    if page is None or page < 1:
        page = 1

    if per_page is None or per_page < 1:
        per_page = DEFAULT_PER_PAGE

    return db.paginate(
        query,
        page=page,
        per_page=min(per_page, MAX_PER_PAGE),
        error_out=False
    )


def get_itinerary_by_id(itinerary_id):
    # Same ID rules as Place Details: text or out-of-range numbers mean "not found"
    try:
        itinerary_id = int(itinerary_id)
    except ValueError:
        return None

    if itinerary_id < 1 or itinerary_id > MAX_ID:
        return None

    return db.session.get(Itinerary, itinerary_id, options=[_with_stops()])


def serialize_itinerary_summary(itinerary):
    # Shape used by itinerary cards. place_links is already sorted by visit_order.
    return {
        "id": itinerary.itinerary_id,
        "title": itinerary.title,
        "description": itinerary.description,
        "duration_days": itinerary.duration_days,
        "difficulty": itinerary.difficulty,
        "cover_image": itinerary.cover_image,
        "route": [link.place.name for link in itinerary.place_links]
    }


def serialize_itinerary_details(itinerary):
    # Shape used by one itinerary: the card plus every stop in visiting order
    return {
        **serialize_itinerary_summary(itinerary),
        "stops": [
            {
                "visit_order": link.visit_order,
                "day_number": link.day_number,
                "notes": link.notes,
                "place": serialize_place_summary(link.place)
            }
            for link in itinerary.place_links
        ]
    }
