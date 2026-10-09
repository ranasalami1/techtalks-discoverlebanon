from werkzeug.exceptions import HTTPException

from extensions import db, jwt
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

    # Protected routes (@jwt_required): Flask-JWT-Extended would otherwise
    # answer with its own {"msg": ...} body, and 422 for a malformed token
    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return error_response("Authentication required", 401)

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return error_response("Invalid authentication token", 401)

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return error_response("Authentication token has expired", 401)

    # Anything unexpected: never leak internals to the client
    @app.errorhandler(Exception)
    def handle_unexpected_error(err):
        db.session.rollback()
        app.logger.exception("Unhandled error: %s", err)
        return error_response("Something went wrong on our side", 500)