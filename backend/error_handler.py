"""
Central error handling for Flask.

Every error - ones we raise on purpose (AppError), ones Flask/Werkzeug
raise for us (404 on unknown route, 405 on wrong method), and ones we
didn't see coming (any other Exception) - gets caught here and turned
into the SAME response shape:

{
  "success": false,
  "error_code": "bad_request",
  "message": "human readable summary",
  "errors": [ { "field": "email", "issue": "..." }, ... ]   # optional
}

This means the frontend (and any hardware device talking to this API)
only ever has to handle one error format, no matter what went wrong.
"""

import logging

from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from app.exceptions import AppError

logger = logging.getLogger("app.errors")


def _error_response(status_code: int, error_code: str, message: str, errors=None):
    response = jsonify({
        "success": False,
        "error_code": error_code,
        "message": message,
        "errors": errors or [],
    })
    response.status_code = status_code
    return response


def register_error_handlers(app: Flask) -> None:

    # 1. Our own custom errors (BadRequestError, ConflictError, etc.)
    @app.errorhandler(AppError)
    def handle_app_error(exc: AppError):
        return _error_response(exc.status_code, exc.error_code, exc.message, exc.errors)

    # 2. Anything Flask/Werkzeug raises itself - unknown route (404),
    #    wrong HTTP method (405), and (if a route calls
    #    request.get_json(silent=False)) malformed JSON (400).
    @app.errorhandler(HTTPException)
    def handle_http_exception(exc: HTTPException):
        error_code = "invalid_json" if "JSON" in (exc.description or "") else "http_error"
        return _error_response(
            exc.code or 500,
            error_code,
            exc.description or "Request failed.",
        )

    # 3. Anything else we didn't anticipate - never leak internals to the
    #    client, but log the full error on the server so it can be debugged.
    @app.errorhandler(Exception)
    def handle_unexpected_error(exc: Exception):
        logger.exception("Unhandled error")
        return _error_response(
            500,
            "internal_error",
            "Something went wrong on our end. Please try again later.",
        )
