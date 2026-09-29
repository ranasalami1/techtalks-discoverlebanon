"""
Validation helpers.

Note: full request-body validation for register/login (required fields,
email format, password rules) is already handled elsewhere by a teammate.
This file only adds what's still needed: validating IDs from the URL,
safely parsing the JSON body, and the minimal checks the demo routes
below use to exercise 409/401/404.
"""

from email_validator import EmailNotValidError, validate_email as _validate_email_lib
from flask import request

from app.exceptions import BadRequestError


def get_json_body() -> dict:
    """
    Safely parse the request's JSON body.

    request.get_json(silent=True) returns None instead of raising when the
    body is missing or isn't valid JSON - we turn that into a clean 400
    with our own error_code, instead of Flask's default behaviour.
    """
    data = request.get_json(silent=True)
    if data is None:
        error = BadRequestError(
            "Request body is not valid JSON.",
            errors=[{"field": "body", "issue": "must be valid JSON"}],
        )
        error.error_code = "invalid_json"
        raise error
    return data


def validate_id(raw_id: str) -> int:
    """
    Validate a resource ID taken from a URL path, e.g. GET /users/<user_id>.

    Adjust this to match whatever ID format the database actually uses:
      - Integer primary key (current implementation): must be a positive integer.
      - UUID primary key: swap this for `uuid.UUID(raw_id)` in a try/except,
        and raise BadRequestError on ValueError the same way.
    """
    try:
        value = int(raw_id)
    except (TypeError, ValueError):
        raise BadRequestError(
            "Invalid ID format.",
            errors=[{"field": "id", "issue": "must be a positive integer"}],
        )

    if value <= 0:
        raise BadRequestError(
            "Invalid ID format.",
            errors=[{"field": "id", "issue": "must be a positive integer"}],
        )

    return value


def require_register_fields(data: dict) -> tuple[str, str]:
    """Minimal field checks for the demo /register route (email + password)."""
    errors = []

    email = data.get("email")
    password = data.get("password")

    if not email:
        errors.append({"field": "email", "issue": "is required"})
    else:
        try:
            email = _validate_email_lib(email, check_deliverability=False).normalized
        except EmailNotValidError:
            errors.append({"field": "email", "issue": "must be a valid email address"})

    if not password:
        errors.append({"field": "password", "issue": "is required"})
    elif len(password) < 8:
        errors.append({"field": "password", "issue": "must be at least 8 characters"})

    if errors:
        raise BadRequestError("Request failed validation.", errors=errors)

    return email, password


def require_login_fields(data: dict) -> tuple[str, str]:
    """Minimal field checks for the demo /login route (email + password present)."""
    errors = []
    email = data.get("email")
    password = data.get("password")

    if not email:
        errors.append({"field": "email", "issue": "is required"})
    if not password:
        errors.append({"field": "password", "issue": "is required"})

    if errors:
        raise BadRequestError("Request failed validation.", errors=errors)

    return email, password
