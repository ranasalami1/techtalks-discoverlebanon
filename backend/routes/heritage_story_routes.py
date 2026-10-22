from flask import Blueprint, request

from services.heritage_story_service import (
    DEFAULT_PER_PAGE,
    get_heritage_stories,
    get_heritage_story_by_id,
    serialize_heritage_story_details,
    serialize_heritage_story_summary
)
from utils.responses import error_response, pagination_meta, success_response


heritage_stories_bp = Blueprint("heritage_stories", __name__, url_prefix="/api/heritage-stories")


# GET /api/heritage-stories?page=1&per_page=12
@heritage_stories_bp.get("")
def list_heritage_stories():
    stories_page = get_heritage_stories(
        page=request.args.get("page", 1, type=int),
        per_page=request.args.get("per_page", DEFAULT_PER_PAGE, type=int)
    )

    return success_response(
        data={
            "stories": [serialize_heritage_story_summary(story) for story in stories_page.items],
            "pagination": pagination_meta(stories_page)
        },
        message="Heritage stories retrieved successfully"
    )


# GET /api/heritage-stories/4
# Any ID is accepted here (not <int:...>) so unknown ones still get a JSON 404
@heritage_stories_bp.get("/<story_id>")
def heritage_story_details(story_id):
    story = get_heritage_story_by_id(story_id)

    if story is None:
        return error_response("Heritage story not found", 404)

    return success_response(
        data={"story": serialize_heritage_story_details(story)},
        message="Heritage story retrieved successfully"
    )
