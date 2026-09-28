from flask import Blueprint, request

from services.place_service import (
    DEFAULT_PER_PAGE,
    get_places,
    serialize_place_summary
)
from utils.responses import pagination_meta, success_response


places_bp = Blueprint("places", __name__, url_prefix="/api/places")


# GET /api/places?category=Heritage&city=Byblos&region=Mount Lebanon&page=1&per_page=12
@places_bp.get("")
def list_places():
    places_page = get_places(
        category=request.args.get("category"),
        city=request.args.get("city"),
        region=request.args.get("region"),
        page=request.args.get("page", 1, type=int),
        per_page=request.args.get("per_page", DEFAULT_PER_PAGE, type=int)
    )

    return success_response(
        data={
            "places": [serialize_place_summary(place) for place in places_page.items],
            "pagination": pagination_meta(places_page)
        },
        message="Places retrieved successfully"
    )
