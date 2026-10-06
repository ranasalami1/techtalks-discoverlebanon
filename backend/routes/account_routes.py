from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required

from services.account_service import (
    get_account,
    update_account,
)
from utils.errors import ApiError
from utils.responses import success_response
from utils.validation import (
    get_json_body,
    validate_account_update,
)


account_bp = Blueprint(
    "account",
    __name__,
    url_prefix="/api/account",
)


@account_bp.get("")
@jwt_required()
def account_details():
    user_id = int(get_jwt_identity())

    account = get_account(user_id)

    if account is None:
        raise ApiError(
            "Account not found",
            404,
        )

    return success_response(
        data={
            "account": account
        },
        message="Account retrieved successfully",
        status_code=200,
    )


@account_bp.put("")
@jwt_required()
def update_account_details():
    user_id = int(get_jwt_identity())

    data = get_json_body()

    cleaned_data = validate_account_update(data)

    account = update_account(
        user_id,
        cleaned_data,
    )

    if account is None:
        raise ApiError(
            "Account not found",
            404,
        )

    return success_response(
        data={
            "account": account
        },
        message="Account updated successfully",
        status_code=200,
    )