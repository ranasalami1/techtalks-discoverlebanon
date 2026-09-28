from sqlalchemy.orm import selectinload

from extensions import db
from models import Category, Place


DEFAULT_PER_PAGE = 12
MAX_PER_PAGE = 50


def get_places(category=None, city=None, region=None, page=1, per_page=DEFAULT_PER_PAGE):
    query = (
        db.select(Place)
        .options(selectinload(Place.categories))
        .order_by(Place.name, Place.place_id)
    )

    # Filters are optional and case-insensitive
    category = (category or "").strip()
    city = (city or "").strip()
    region = (region or "").strip()

    if category:
        query = query.where(
            Place.categories.any(
                db.func.lower(Category.name) == category.lower()
            )
        )

    if city:
        query = query.where(
            db.func.lower(Place.city) == city.lower()
        )

    if region:
        query = query.where(
            db.func.lower(Place.region) == region.lower()
        )

    # Invalid page values fall back to defaults instead of failing the request
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


def serialize_place_summary(place):
    # Shape used by place lists (Explore, Search results, Saved Places cards)
    return {
        "id": place.place_id,
        "name": place.name,
        "short_description": place.short_description,
        "city": place.city,
        "region": place.region,
        "featured_image": place.featured_image,
        "latitude": _to_float(place.latitude),
        "longitude": _to_float(place.longitude),
        "categories": [category.name for category in place.categories]
    }


def _to_float(value):
    # Numeric columns come back as Decimal, which Flask would send as a string
    return float(value) if value is not None else None
