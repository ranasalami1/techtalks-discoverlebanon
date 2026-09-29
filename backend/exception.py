"""
Custom exception classes.

Each one maps to a specific HTTP status code. Routes raise these instead
of building error responses by hand; error_handlers.py catches them and
turns them into consistent JSON.
"""


class AppError(Exception):
    """Base class for all app-level errors we raise on purpose."""

    status_code = 500
    error_code = "internal_error"

    def __init__(self, message: str, errors: list | None = None):
        self.message = message
        # Optional list of field-level problems, e.g.:
        # [{"field": "email", "issue": "must be a valid email address"}]
        self.errors = errors or []
        super().__init__(message)


class BadRequestError(AppError):
    """400 - the request is malformed or fails validation."""
    status_code = 400
    error_code = "bad_request"


class UnauthorizedError(AppError):
    """401 - missing or invalid credentials."""
    status_code = 401
    error_code = "unauthorized"


class ForbiddenError(AppError):
    """403 - authenticated, but not allowed to do this."""
    status_code = 403
    error_code = "forbidden"


class NotFoundError(AppError):
    """404 - the requested resource doesn't exist."""
    
    status_code = 404
    error_code = "not_found"


class ConflictError(AppError):
    """409 - the request conflicts with existing data (e.g. duplicate email)."""
    status_code = 409
    error_code = "conflict"
