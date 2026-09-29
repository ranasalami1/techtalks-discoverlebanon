from flask import Blueprint, request

from services.place_service import (
    DEFAULT_PER_PAGE,
    get_places,
    serialize_place_summary
)
from utils.responses import pagination_meta, success_response


search_bp = Blueprint("search", __name__, url_prefix="/api/search")


# GET /api/search?q=byblos&category=Heritage&sort=relevance&page=1&per_page=12
@search_bp.get("")
def search_places():
    search_text = (request.args.get("q") or "").strip()

    places_page = get_places(
        search=search_text,
        category=request.args.get("category"),
        sort=request.args.get("sort", "relevance"),
        page=request.args.get("page", 1, type=int),
        per_page=request.args.get("per_page", DEFAULT_PER_PAGE, type=int)
    )

    return success_response(
        data={
            "query": search_text,
            "places": [serialize_place_summary(place) for place in places_page.items],
            "pagination": pagination_meta(places_page)
        },
        message="Search results retrieved successfully"
    )
