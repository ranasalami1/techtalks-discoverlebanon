import re

from flask import request

from utils.errors import ApiError

EMAIL_PATTERN = re.compile(
    r"[a-z0-9]+(?:[._%+-][a-z0-9]+)*"
    r"@"
    r"[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*"
    r"\.[a-z]{2,}"
)

MAX_EMAIL_LENGTH = 120

MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128


def get_json_body():
    data = request.get_json(silent=True)

    if data is None:
        raise ApiError(
            "Request body must be valid JSON (Content-Type: application/json)", 400
        )
    if not isinstance(data, dict):
        raise ApiError("Request body must be a JSON object", 400)

    return data


def validate_required_fields(data, required_fields, field_type=None):
    errors = {}

    for field in required_fields:
        value = data.get(field)

        if value is None:
            errors[field] = f"{field} is required"
        elif field_type and not isinstance(value, field_type):
            errors[field] = f"{field} must be of type {field_type.__name__}"
        elif isinstance(value, str) and not value.strip():
            errors[field] = f"{field} cannot be empty"

    if errors:
        raise ApiError("Missing or invalid required fields", 400, errors)

    return data


def validate_email_format(email, field="email"):
    cleaned = email.strip().lower()

    if len(cleaned) > MAX_EMAIL_LENGTH:
        raise ApiError(
            "Invalid email address",
            400,
            {field: f"Email must be at most {MAX_EMAIL_LENGTH} characters"},
        )

    if not EMAIL_PATTERN.fullmatch(cleaned):
        raise ApiError(
            "Invalid email address",
            400,
            {field: "Enter a valid email address, for example name@example.com"},
        )

    return cleaned


def validate_password_requirements(password, field="password"):
    problems = []

    if len(password) < MIN_PASSWORD_LENGTH:
        problems.append(f"be at least {MIN_PASSWORD_LENGTH} characters long")
    if len(password) > MAX_PASSWORD_LENGTH:
        problems.append(f"be at most {MAX_PASSWORD_LENGTH} characters long")
    if not any(char.isalpha() for char in password):
        problems.append("contain at least one letter")
    if not any(char.isdigit() for char in password):
        problems.append("contain at least one number")
    if password != password.strip():
        problems.append("not start or end with a space")

    if problems:
        raise ApiError(
            "Password does not meet the requirements",
            400,
            {field: "Password must " + ", ".join(problems)},
        )

    return password

def validate_account_update(data):
    allowed_fields = {
        "full_name",
        "email",
        "profile_image",
    }

    errors = {}
    cleaned = {}

    # Reject fields the user is not allowed to modify
    unknown_fields = set(data) - allowed_fields

    if unknown_fields:
        raise ApiError(
            "Invalid account fields",
            400,
            {
                field: "This field cannot be updated"
                for field in unknown_fields
            },
        )

    if not data:
        raise ApiError(
            "No account fields provided",
            400,
        )

    # Full name
    if "full_name" in data:
        full_name = data["full_name"]

        if not isinstance(full_name, str):
            errors["full_name"] = "Full name must be a string"
        else:
            full_name = full_name.strip()

            if not 2 <= len(full_name) <= 100:
                errors["full_name"] = (
                    "Full name must be between 2 and 100 characters"
                )
            else:
                cleaned["full_name"] = full_name

    # Email
    if "email" in data:
        email = data["email"]

        if not isinstance(email, str):
            errors["email"] = "Email must be a string"
        else:
            cleaned["email"] = validate_email_format(email)

    # Profile image
    if "profile_image" in data:
        profile_image = data["profile_image"]

        if profile_image is not None:
            if not isinstance(profile_image, str):
                errors["profile_image"] = (
                    "Profile image must be a string or null"
                )
            elif len(profile_image.strip()) > 255:
                errors["profile_image"] = (
                    "Profile image must be at most 255 characters"
                )
            else:
                cleaned["profile_image"] = profile_image.strip()
        else:
            cleaned["profile_image"] = None

    if errors:
        raise ApiError(
            "Invalid account data",
            400,
            errors,
        )

    return cleaned