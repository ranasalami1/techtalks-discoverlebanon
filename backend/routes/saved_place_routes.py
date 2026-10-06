from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from services.saved_place_service import (
    get_saved_places,
    remove_saved_place,
    save_place,
)
from utils.errors import ApiError
from utils.responses import success_response


saved_places_bp = Blueprint(
    "saved_places",
    __name__,
    url_prefix="/api/saved-places",
)


def get_current_user_id():
    identity = get_jwt_identity()

    try:
        return int(identity)
    except (TypeError, ValueError):
        raise ApiError(
            "Invalid authentication token",
            401,
        )


# =========================================================
# GET SAVED PLACES
# =========================================================

@saved_places_bp.get("")
@jwt_required()
def list_saved_places():
    user_id = get_current_user_id()

    saved_places = get_saved_places(user_id)

    return success_response(
        data=saved_places,
        message="Saved places retrieved successfully",
        status_code=200,
    )


# =========================================================
# SAVE A PLACE
# =========================================================

@saved_places_bp.post("/<int:place_id>")
@jwt_required()
def create_saved_place(place_id):
    user_id = get_current_user_id()

    saved_place, error = save_place(
        user_id,
        place_id,
    )

    if error == "not_found":
        raise ApiError(
            "Place not found",
            404,
            {
                "place_id": "The requested place does not exist"
            },
        )

    if error == "already_saved":
        raise ApiError(
            "Place is already saved",
            409,
            {
                "place_id": "This place is already in your saved places"
            },
        )

    return success_response(
        data={
            "place_id": saved_place.place_id,
            "saved_at": (
                saved_place.saved_at.isoformat()
                if saved_place.saved_at is not None
                else None
            ),
        },
        message="Place saved successfully",
        status_code=201,
    )


# =========================================================
# REMOVE SAVED PLACE
# =========================================================

@saved_places_bp.delete("/<int:place_id>")
@jwt_required()
def delete_saved_place(place_id):
    user_id = get_current_user_id()

    removed = remove_saved_place(
        user_id,
        place_id,
    )

    if not removed:
        raise ApiError(
            "Saved place not found",
            404,
            {
                "place_id": "This place is not in your saved places"
            },
        )

    return success_response(
        data={
            "place_id": place_id,
        },
        message="Saved place removed successfully",
        status_code=200,
    )