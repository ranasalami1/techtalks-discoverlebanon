import os

# Tests run against a throwaway in-memory SQLite database. This has to be set
# before the app is imported, and it deliberately overrides any real
# DATABASE_URL (from the shell or .env) so tests never touch PostgreSQL data.
os.environ["DATABASE_URL"] = "sqlite://"

import pytest

from app import app as flask_app
from extensions import db


@pytest.fixture
def app():
    flask_app.config.update(TESTING=True)

    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()
