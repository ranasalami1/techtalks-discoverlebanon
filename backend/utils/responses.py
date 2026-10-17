from flask import jsonify


# Every API response uses the same envelope as /api/health:
#   success -> {"status": "success", "message": "...", "data": ...}
#   error   -> {"status": "error", "message": "...", "errors": {...}}


def success_response(data=None, message="Request successful", status_code=200):
    return jsonify({
        "status": "success",
        "message": message,
        "data": data
    }), status_code


def error_response(message, status_code=400, errors=None):
    body = {
        "status": "error",
        "message": message
    }

    if errors:
        body["errors"] = errors

    return jsonify(body), status_code


def pagination_meta(pagination):
    # Page info for list endpoints, from a Flask-SQLAlchemy Pagination object
    return {
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "pages": pagination.pages
    }
