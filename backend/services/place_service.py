from sqlalchemy import case, or_
from sqlalchemy.orm import selectinload

from extensions import db
from models import Category, Place


DEFAULT_PER_PAGE = 12
MAX_PER_PAGE = 50

# Largest value a PostgreSQL integer column can hold
MAX_ID = 2147483647


def get_places(
    category=None,
    city=None,
    region=None,
    search=None,
    sort="name_asc",
    page=1,
    per_page=DEFAULT_PER_PAGE
):
    query = (
        db.select(Place)
        .options(selectinload(Place.categories))
    )

    # Filters are optional and case-insensitive
    category = (category or "").strip()
    city = (city or "").strip()
    region = (region or "").strip()
    search = (search or "").strip()

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

    if search:
        query = query.where(_matches_search(search))

    query = query.order_by(*_sort_order(sort, search))

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


def _matches_search(search):
    # A place matches if the text appears anywhere in one of these fields.
    # autoescape=True makes % and _ normal characters instead of SQL wildcards.
    return or_(
        Place.name.icontains(search, autoescape=True),
        Place.city.icontains(search, autoescape=True),
        Place.region.icontains(search, autoescape=True),
        Place.short_description.icontains(search, autoescape=True),
        Place.description.icontains(search, autoescape=True),
        Place.categories.any(Category.name.icontains(search, autoescape=True))
    )


def _sort_order(sort, search):
    # place_id is the tie-breaker so two places with the same name
    # always come back in the same order (no repeats across pages)
    if sort == "name_desc":
        return [Place.name.desc(), Place.place_id]

    if sort == "relevance" and search:
        # Places whose name matches come first, then the rest, each group A-Z
        name_match_first = case(
            (Place.name.icontains(search, autoescape=True), 0),
            else_=1
        )
        return [name_match_first, Place.name, Place.place_id]

    # "name_asc", unknown values, and relevance with no search text: A-Z
    return [Place.name, Place.place_id]


def get_place_by_id(place_id):
    # The ID comes straight from the URL, so text like "baalbek" or an
    # out-of-range number simply means "no such place"
    try:
        place_id = int(place_id)
    except ValueError:
        return None

    if place_id < 1 or place_id > MAX_ID:
        return None

    return db.session.get(
        Place,
        place_id,
        options=[selectinload(Place.categories), selectinload(Place.images)]
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


def serialize_place_details(place):
    # Shape used by the Place Details page:
    # summary + full information + research data + gallery

    images = sorted(
        place.images,
        key=lambda image: (
            image.display_order,
            image.image_id
        )
    )

    return {
        **serialize_place_summary(place),

        # Basic details
        "description": place.description,
        "address": place.address,
        "opening_hours": place.opening_hours,
        "entrance_fee": _to_float(place.entrance_fee),
        "website": place.website,
        "phone": place.phone,

        # Research fields
        "venue_type": place.venue_type,
        "category_group": place.category_group,
        "status": place.status,

        "rating": _to_float(place.rating),
        "review_count": place.review_count,

        "public_access": place.public_access,
        "confidence": place.confidence,
        "locality_match": place.locality_match,

        "evidence_source": place.evidence_source,
        "source_url": place.source_url,
        "map_url": place.map_url,

        "notes": place.notes,

        "last_checked": (
            place.last_checked.isoformat()
            if place.last_checked is not None
            else None
        ),

        # Gallery
        "images": [
            {
                "url": image.image_url,
                "alt_text": image.alt_text
            }
            for image in images
        ]
    }
  




def _to_float(value):
    # Numeric columns come back as Decimal, which Flask would send as a string
    return float(value) if value is not None else None
