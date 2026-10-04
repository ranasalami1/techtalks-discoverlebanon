from werkzeug.exceptions import HTTPException

from extensions import db
from utils.responses import error_response


class ApiError(Exception):
    """Raise this anywhere in a route to return a clean JSON error."""

    def __init__(self, message, status_code=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def handle_api_error(err):
        return error_response(err.message, err.status_code, err.errors)

    # 404, 405, etc. (Flask's built-in errors)
    @app.errorhandler(HTTPException)
    def handle_http_error(err):
        return error_response(err.description or err.name, err.code)

    # Anything unexpected: never leak internals to the client
    @app.errorhandler(Exception)
    def handle_unexpected_error(err):
        db.session.rollback()
        app.logger.exception("Unhandled error: %s", err)
        return error_response("Something went wrong on our side", 500)