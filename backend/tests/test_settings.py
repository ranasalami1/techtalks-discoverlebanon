import pytest

from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from extensions import db
from models import User, UserSettings


@pytest.fixture
def settings_data(app):
    user = User(
        full_name="Rana Salami",
        email="rana@example.com",
        password_hash=generate_password_hash("password123"),
    )

    other_user = User(
        full_name="Other User",
        email="other@example.com",
        password_hash=generate_password_hash("password123"),
    )

    user.settings = UserSettings(
        language="en",
        email_notifications=True,
        push_notifications=True,
    )

    other_user.settings = UserSettings(
        language="fr",
        email_notifications=False,
        push_notifications=False,
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
        "token": token,
        "user_id": user.user_id,
    }


def auth_headers(token):
    return {
        "Authorization": f"Bearer {token}"
    }


def test_settings_requires_authentication(client):
    response = client.get(
        "/api/settings"
    )

    assert response.status_code == 401


def test_logged_in_user_can_get_settings(
    client,
    settings_data,
):
    response = client.get(
        "/api/settings",
        headers=auth_headers(
            settings_data["token"]
        ),
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Settings retrieved successfully"
    )

    settings = body["data"]["settings"]

    assert settings["language"] == "en"
    assert settings["email_notifications"] is True
    assert settings["push_notifications"] is True


def test_logged_in_user_can_update_language(
    client,
    settings_data,
):
    response = client.put(
        "/api/settings",
        headers=auth_headers(
            settings_data["token"]
        ),
        json={
            "language": "fr"
        },
    )

    assert response.status_code == 200

    settings = response.get_json()["data"]["settings"]

    assert settings["language"] == "fr"


def test_logged_in_user_can_update_notifications(
    client,
    settings_data,
):
    response = client.put(
        "/api/settings",
        headers=auth_headers(
            settings_data["token"]
        ),
        json={
            "email_notifications": False,
            "push_notifications": False,
        },
    )

    assert response.status_code == 200

    settings = response.get_json()["data"]["settings"]

    assert settings["email_notifications"] is False
    assert settings["push_notifications"] is False


def test_settings_reject_invalid_boolean(
    client,
    settings_data,
):
    response = client.put(
        "/api/settings",
        headers=auth_headers(
            settings_data["token"]
        ),
        json={
            "email_notifications": "yes"
        },
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["status"] == "error"
    assert "email_notifications" in body["errors"]


def test_settings_reject_forbidden_field(
    client,
    settings_data,
):
    response = client.put(
        "/api/settings",
        headers=auth_headers(
            settings_data["token"]
        ),
        json={
            "user_id": 999
        },
    )

    assert response.status_code == 400

    body = response.get_json()

    assert body["status"] == "error"
    assert "user_id" in body["errors"]