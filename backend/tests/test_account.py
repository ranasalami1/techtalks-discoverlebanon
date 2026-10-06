import pytest

from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from extensions import db
from models import User


@pytest.fixture
def account_data(app):
    user = User(
        full_name="Rana Salami",
        email="rana@example.com",
        password_hash=generate_password_hash("password123"),
        profile_image="/images/rana.jpg",
    )

    other_user = User(
        full_name="Other User",
        email="other@example.com",
        password_hash=generate_password_hash("password123"),
    )

    db.session.add_all([
        user,
        other_user,
    ])
    db.session.commit()

    token = create_access_token(
        identity=str(user.user_id)
    )

    return {
        "user_id": user.user_id,
        "token": token,
    }


def auth_headers(token):
    return {
        "Authorization": f"Bearer {token}"
    }


def test_account_requires_authentication(client):
    response = client.get(
        "/api/account"
    )

    assert response.status_code == 401


def test_logged_in_user_can_get_account(
    client,
    account_data,
):
    response = client.get(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Account retrieved successfully"
    )

    account = body["data"]["account"]

    assert account["id"] == account_data["user_id"]
    assert account["full_name"] == "Rana Salami"
    assert account["email"] == "rana@example.com"
    assert account["profile_image"] == "/images/rana.jpg"
    assert account["created_at"] is not None


def test_account_does_not_return_password_hash(
    client,
    account_data,
):
    response = client.get(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
    )

    account = response.get_json()["data"]["account"]

    assert "password_hash" not in account


def test_account_returns_only_logged_in_user(
    client,
    account_data,
):
    response = client.get(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
    )

    account = response.get_json()["data"]["account"]

    assert account["email"] == "rana@example.com"
    assert account["email"] != "other@example.com"


def test_logged_in_user_can_update_full_name(
    client,
    account_data,
):
    response = client.put(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
        json={
            "full_name": "Rana Hussein Salami"
        },
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Account updated successfully"
    )

    account = body["data"]["account"]

    assert account["full_name"] == "Rana Hussein Salami"


def test_logged_in_user_can_update_email(
    client,
    account_data,
):
    response = client.put(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
        json={
            "email": "NEW@example.com"
        },
    )

    assert response.status_code == 200

    account = response.get_json()["data"]["account"]

    assert account["email"] == "new@example.com"


def test_account_update_rejects_invalid_email(
    client,
    account_data,
):
    response = client.put(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
        json={
            "email": "not-an-email"
        },
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["status"] == "error"
    assert "email" in body["errors"]


def test_account_update_rejects_forbidden_field(
    client,
    account_data,
):
    response = client.put(
        "/api/account",
        headers=auth_headers(
            account_data["token"]
        ),
        json={
            "is_active": False
        },
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["status"] == "error"
    assert "is_active" in body["errors"]


def test_account_update_requires_authentication(
    client,
):
    response = client.put(
        "/api/account",
        json={
            "full_name": "New Name"
        },
    )

    assert response.status_code == 401    