from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from services.settings_service import (
    get_settings,
    update_settings,
)
from utils.errors import ApiError
from utils.responses import success_response
from utils.validation import (
    get_json_body,
    validate_settings_update,
)


settings_bp = Blueprint(
    "settings",
    __name__,
    url_prefix="/api/settings",
)


@settings_bp.get("")
@jwt_required()
def settings_details():
    user_id = int(get_jwt_identity())

    settings = get_settings(user_id)

    if settings is None:
        raise ApiError(
            "Settings not found",
            404,
        )

    return success_response(
        data={
            "settings": settings
        },
        message="Settings retrieved successfully",
        status_code=200,
    )


@settings_bp.put("")
@jwt_required()
def update_settings_details():
    user_id = int(get_jwt_identity())

    data = get_json_body()

    cleaned_data = validate_settings_update(data)

    settings = update_settings(
        user_id,
        cleaned_data,
    )

    if settings is None:
        raise ApiError(
            "Settings not found",
            404,
        )

    return success_response(
        data={
            "settings": settings
        },
        message="Settings updated successfully",
        status_code=200,
    )