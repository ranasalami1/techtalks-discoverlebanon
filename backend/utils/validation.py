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