from flask import Blueprint
from werkzeug.security import check_password_hash

from models import User
from utils.errors import ApiError
from utils.validation import (
    get_json_body,
    validate_email_format,
    validate_required_fields,
)


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.post("/login")
def login():
    data = get_json_body()
    validate_required_fields(data, ["email", "password"], field_type=str)

    email = validate_email_format(data["email"])
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        raise ApiError("Invalid email or password", 401)

    if not user.is_active:
        raise ApiError("This account has been deactivated", 403)

    return {
        "status": "success",
        "message": "Logged in successfully",
        "user": {
            "id": user.user_id,
            "fullName": user.full_name,
            "email": user.email,
        },
    }, 200