from sqlalchemy.orm import selectinload

from extensions import db
from models import Place, SavedPlace
from services.place_service import serialize_place_summary


def get_saved_places(user_id):
    query = (
        db.select(SavedPlace)
        .where(SavedPlace.user_id == user_id)
        .options(
            selectinload(SavedPlace.place)
            .selectinload(Place.categories)
        )
        .order_by(SavedPlace.saved_at.desc())
    )

    saved_places = db.session.execute(
        query
    ).scalars().all()

    return [
        {
            "saved_at": saved.saved_at.isoformat()
            if saved.saved_at is not None
            else None,
            "place": serialize_place_summary(saved.place),
        }
        for saved in saved_places
    ]


def save_place(user_id, place_id):
    place = db.session.get(Place, place_id)

    if place is None:
        return None, "not_found"

    existing = db.session.get(
        SavedPlace,
        (user_id, place_id),
    )

    if existing is not None:
        return existing, "already_saved"

    saved_place = SavedPlace(
        user_id=user_id,
        place_id=place_id,
    )

    db.session.add(saved_place)
    db.session.commit()

    return saved_place, None


def remove_saved_place(user_id, place_id):
    saved_place = db.session.get(
        SavedPlace,
        (user_id, place_id),
    )

    if saved_place is None:
        return False

    db.session.delete(saved_place)
    db.session.commit()

    return True