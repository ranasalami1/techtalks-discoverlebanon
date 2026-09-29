"""
Tests for validation and error handling.

Run with:  pytest -v

Each test checks two things: the HTTP status code, and that the response
body follows the shared error shape ({"success": false, "error_code": ...}).
"""

import pytest

from app.main import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)
    return app.test_client()


def assert_error_shape(body):
    assert body["success"] is False
    assert "error_code" in body
    assert "message" in body
    assert "errors" in body


# --- 400 Bad Request ---

def test_missing_required_field_returns_400(client):
    resp = client.post("/register", json={"email": "new@example.com"})  # no password
    assert resp.status_code == 400
    body = resp.get_json()
    assert_error_shape(body)
    assert any(e["field"] == "password" for e in body["errors"])


def test_invalid_email_format_returns_400(client):
    resp = client.post("/register", json={"email": "not-an-email", "password": "abc12345"})
    assert resp.status_code == 400
    assert_error_shape(resp.get_json())


def test_malformed_json_returns_400(client):
    resp = client.post(
        "/register",
        data="{not valid json",
        content_type="application/json",
    )
    assert resp.status_code == 400
    body = resp.get_json()
    assert_error_shape(body)
    assert body["error_code"] == "invalid_json"


def test_invalid_id_format_returns_400(client):
    resp = client.get("/users/not-a-number")
    assert resp.status_code == 400
    body = resp.get_json()
    assert_error_shape(body)
    assert body["errors"][0]["field"] == "id"


def test_negative_id_returns_400(client):
    resp = client.get("/users/-5")
    assert resp.status_code == 400
    assert_error_shape(resp.get_json())


# --- 401 Unauthorized ---

def test_wrong_password_returns_401(client):
    resp = client.post("/login", json={"email": "alice@example.com", "password": "wrong"})
    assert resp.status_code == 401
    body = resp.get_json()
    assert_error_shape(body)
    assert body["message"] == "Invalid email or password."


def test_unknown_email_returns_401_with_same_message(client):
    # Must match the wrong-password message exactly, so attackers can't
    # tell registered emails from unregistered ones.
    resp = client.post("/login", json={"email": "ghost@example.com", "password": "whatever"})
    assert resp.status_code == 401
    assert resp.get_json()["message"] == "Invalid email or password."


# --- 404 Not Found ---

def test_missing_record_returns_404(client):
    resp = client.get("/users/9999")
    assert resp.status_code == 404
    assert_error_shape(resp.get_json())


def test_unknown_route_returns_404_in_same_shape(client):
    resp = client.get("/this-route-does-not-exist")
    assert resp.status_code == 404
    assert_error_shape(resp.get_json())


# --- 409 Conflict ---

def test_duplicate_email_returns_409(client):
    resp = client.post("/register", json={"email": "alice@example.com", "password": "whatever123"})
    assert resp.status_code == 409
    body = resp.get_json()
    assert_error_shape(body)
    assert "already exists" in body["message"]


# --- 500 Internal Server Error ---

def test_unexpected_error_returns_500_without_leaking_details(client, monkeypatch):
    def boom(*args, **kwargs):
        raise RuntimeError("db connection lost")

    monkeypatch.setattr("app.main.validate_id", boom)

    resp = client.get("/users/1")
    assert resp.status_code == 500
    body = resp.get_json()
    assert_error_shape(body)
    # the real exception message must never reach the client
    assert "db connection lost" not in resp.get_data(as_text=True)


# --- Happy paths, so the above failures are meaningful ---

def test_register_success(client):
    resp = client.post("/register", json={"email": "brandnew@example.com", "password": "abc12345"})
    assert resp.status_code == 201
    assert resp.get_json()["email"] == "brandnew@example.com"


def test_login_success(client):
    resp = client.post("/login", json={"email": "alice@example.com", "password": "hunter2pass"})
    assert resp.status_code == 200
    assert resp.get_json()["success"] is True


def test_get_user_success(client):
    resp = client.get("/users/1")
    assert resp.status_code == 200
    assert resp.get_json()["id"] == 1
