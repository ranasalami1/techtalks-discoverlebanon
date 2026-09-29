from flask import Blueprint, request

from services.place_service import (
    DEFAULT_PER_PAGE,
    get_place_by_id,
    get_places,
    serialize_place_details,
    serialize_place_summary
)
from utils.responses import error_response, pagination_meta, success_response


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


# GET /api/places/12
# Any ID is accepted here (not <int:...>) so unknown ones still get a JSON 404
@places_bp.get("/<place_id>")
def place_details(place_id):
    place = get_place_by_id(place_id)

    if place is None:
        return error_response("Place not found", 404)

    return success_response(
        data={"place": serialize_place_details(place)},
        message="Place retrieved successfully"
    )
