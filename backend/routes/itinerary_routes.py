from flask import Blueprint, request

from services.itinerary_service import (
    DEFAULT_PER_PAGE,
    get_itineraries,
    get_itinerary_by_id,
    serialize_itinerary_details,
    serialize_itinerary_summary
)
from utils.responses import error_response, pagination_meta, success_response


itineraries_bp = Blueprint("itineraries", __name__, url_prefix="/api/itineraries")


# GET /api/itineraries?page=1&per_page=12
@itineraries_bp.get("")
def list_itineraries():
    itineraries_page = get_itineraries(
        page=request.args.get("page", 1, type=int),
        per_page=request.args.get("per_page", DEFAULT_PER_PAGE, type=int)
    )

    return success_response(
        data={
            "itineraries": [
                serialize_itinerary_summary(itinerary)
                for itinerary in itineraries_page.items
            ],
            "pagination": pagination_meta(itineraries_page)
        },
        message="Itineraries retrieved successfully"
    )


# GET /api/itineraries/3
# Any ID is accepted here (not <int:...>) so unknown ones still get a JSON 404
@itineraries_bp.get("/<itinerary_id>")
def itinerary_details(itinerary_id):
    itinerary = get_itinerary_by_id(itinerary_id)

    if itinerary is None:
        return error_response("Itinerary not found", 404)

    return success_response(
        data={"itinerary": serialize_itinerary_details(itinerary)},
        message="Itinerary retrieved successfully"
    )
