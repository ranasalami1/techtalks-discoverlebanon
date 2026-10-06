import pytest

from flask_jwt_extended import create_access_token

from extensions import db
from models import Category, Place, SavedPlace, User


@pytest.fixture
def saved_places_data(app):
    user = User(
        full_name="Test User",
        email="test@example.com",
        password_hash="test-password-hash",
    )

    other_user = User(
        full_name="Other User",
        email="other@example.com",
        password_hash="test-password-hash",
    )

    heritage = Category(name="Heritage")
    nature = Category(name="Nature")

    byblos = Place(
        name="Byblos",
        short_description="Ancient coastal city.",
        city="Byblos",
        region="Mount Lebanon",
        featured_image="/images/byblos.jpg",
        categories=[heritage],
    )

    jeita = Place(
        name="Jeita Grotto",
        short_description="Famous limestone caves.",
        city="Jeita",
        region="Mount Lebanon",
        featured_image="/images/jeita.jpg",
        categories=[nature],
    )

    db.session.add_all(
        [
            user,
            other_user,
            byblos,
            jeita,
        ]
    )

    db.session.commit()

    user_token = create_access_token(
        identity=str(user.user_id)
    )

    other_token = create_access_token(
        identity=str(other_user.user_id)
    )

    return {
        "user_id": user.user_id,
        "other_user_id": other_user.user_id,
        "token": user_token,
        "other_token": other_token,
        "byblos_id": byblos.place_id,
        "jeita_id": jeita.place_id,
    }


def auth_headers(token):
    return {
        "Authorization": f"Bearer {token}"
    }


# =========================================================
# AUTHENTICATION
# =========================================================

def test_saved_places_requires_authentication(client):
    response = client.get(
        "/api/saved-places"
    )

    assert response.status_code == 401


# =========================================================
# GET SAVED PLACES
# =========================================================

def test_empty_saved_places_returns_empty_list(
    client,
    saved_places_data,
):
    response = client.get(
        "/api/saved-places",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Saved places retrieved successfully"
    )
    assert body["data"] == []


# =========================================================
# SAVE PLACE
# =========================================================

def test_user_can_save_place(
    client,
    saved_places_data,
):
    place_id = saved_places_data["byblos_id"]

    response = client.post(
        f"/api/saved-places/{place_id}",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 201

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Place saved successfully"
    )

    assert body["data"]["place_id"] == place_id

    saved_place = db.session.get(
        SavedPlace,
        (
            saved_places_data["user_id"],
            place_id,
        ),
    )

    assert saved_place is not None


def test_saved_place_appears_in_list(
    client,
    saved_places_data,
):
    place_id = saved_places_data["byblos_id"]

    client.post(
        f"/api/saved-places/{place_id}",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    response = client.get(
        "/api/saved-places",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 200

    body = response.get_json()

    assert len(body["data"]) == 1

    saved = body["data"][0]

    assert saved["saved_at"] is not None

    assert saved["place"]["id"] == place_id
    assert saved["place"]["name"] == "Byblos"
    assert saved["place"]["city"] == "Byblos"
    assert saved["place"]["region"] == "Mount Lebanon"
    assert saved["place"]["categories"] == [
        "Heritage"
    ]


def test_cannot_save_same_place_twice(
    client,
    saved_places_data,
):
    place_id = saved_places_data["byblos_id"]
    headers = auth_headers(
        saved_places_data["token"]
    )

    first_response = client.post(
        f"/api/saved-places/{place_id}",
        headers=headers,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        f"/api/saved-places/{place_id}",
        headers=headers,
    )

    assert second_response.status_code == 409

    body = second_response.get_json()

    assert body["status"] == "error"
    assert body["message"] == (
        "Place is already saved"
    )
    assert "place_id" in body["errors"]


def test_cannot_save_unknown_place(
    client,
    saved_places_data,
):
    response = client.post(
        "/api/saved-places/999999",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 404

    body = response.get_json()

    assert body["status"] == "error"
    assert body["message"] == "Place not found"
    assert "place_id" in body["errors"]


# =========================================================
# USER ISOLATION
# =========================================================

def test_users_only_see_their_own_saved_places(
    client,
    saved_places_data,
):
    place_id = saved_places_data["byblos_id"]

    client.post(
        f"/api/saved-places/{place_id}",
        headers=auth_headers(
            saved_places_data["other_token"]
        ),
    )

    response = client.get(
        "/api/saved-places",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["data"] == []


# =========================================================
# DELETE SAVED PLACE
# =========================================================

def test_user_can_remove_saved_place(
    client,
    saved_places_data,
):
    place_id = saved_places_data["jeita_id"]
    headers = auth_headers(
        saved_places_data["token"]
    )

    client.post(
        f"/api/saved-places/{place_id}",
        headers=headers,
    )

    response = client.delete(
        f"/api/saved-places/{place_id}",
        headers=headers,
    )

    assert response.status_code == 200

    body = response.get_json()

    assert body["status"] == "success"
    assert body["message"] == (
        "Saved place removed successfully"
    )
    assert body["data"]["place_id"] == place_id

    saved_place = db.session.get(
        SavedPlace,
        (
            saved_places_data["user_id"],
            place_id,
        ),
    )

    assert saved_place is None


def test_removing_unsaved_place_returns_404(
    client,
    saved_places_data,
):
    place_id = saved_places_data["byblos_id"]

    response = client.delete(
        f"/api/saved-places/{place_id}",
        headers=auth_headers(
            saved_places_data["token"]
        ),
    )

    assert response.status_code == 404

    body = response.get_json()

    assert body["status"] == "error"
    assert body["message"] == (
        "Saved place not found"
    )
    assert "place_id" in body["errors"]