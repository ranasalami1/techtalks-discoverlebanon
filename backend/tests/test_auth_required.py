from datetime import timedelta

import jwt as pyjwt
import pytest
from flask_jwt_extended import create_access_token


# Every route that needs a logged-in user
PROTECTED_ROUTES = [
    ("get", "/api/saved-places"),
    ("post", "/api/saved-places/1"),
    ("delete", "/api/saved-places/1"),
    ("get", "/api/account"),
    ("put", "/api/account"),
    ("get", "/api/settings"),
    ("put", "/api/settings"),
]


def call(client, method, url, token=None):
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    return getattr(client, method)(url, headers=headers)


def assert_401(response, message):
    # Same {"status": "error", "message": ...} shape as every other error
    assert response.status_code == 401
    assert response.is_json
    assert response.get_json() == {"status": "error", "message": message}


@pytest.mark.parametrize("method, url", PROTECTED_ROUTES)
def test_missing_token_returns_json_401(client, method, url):
    response = call(client, method, url)

    assert_401(response, "Authentication required")


@pytest.mark.parametrize("method, url", PROTECTED_ROUTES)
def test_malformed_token_returns_json_401(client, method, url):
    response = call(client, method, url, token="not-a-real-token")

    assert_401(response, "Invalid authentication token")


@pytest.mark.parametrize("method, url", PROTECTED_ROUTES)
def test_token_signed_with_wrong_key_returns_json_401(client, method, url):
    forged = pyjwt.encode(
        {"sub": "1", "type": "access"},
        "some-other-key-that-is-not-our-secret",
        algorithm="HS256",
    )

    response = call(client, method, url, token=forged)

    assert_401(response, "Invalid authentication token")


@pytest.mark.parametrize("method, url", PROTECTED_ROUTES)
def test_expired_token_returns_json_401(client, method, url):
    expired = create_access_token(
        identity="1",
        expires_delta=timedelta(seconds=-1),
    )

    response = call(client, method, url, token=expired)

    assert_401(response, "Authentication token has expired")
