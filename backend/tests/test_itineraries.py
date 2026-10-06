import pytest

from extensions import db
from models import Category, Itinerary, ItineraryPlace, Place


@pytest.fixture
def itinerary_ids(app):
    heritage = Category(name="Heritage")
    baalbek = Place(name="Baalbek", city="Baalbek", region="Beqaa", categories=[heritage])
    anjar = Place(name="Anjar", city="Anjar", region="Beqaa", categories=[heritage])
    ksara = Place(name="Ksara", city="Zahle", region="Beqaa")

    # Added in this order on purpose: it is not alphabetical
    echoes = Itinerary(
        title="Echoes of Empires",
        description="Explore Lebanon's Roman legacy.",
        duration_days=1,
        difficulty="Moderate",
        cover_image="/images/echoes.jpg",
        place_links=[
            # Stops added out of order on purpose: the API must sort them
            ItineraryPlace(place=ksara, visit_order=3, day_number=1),
            ItineraryPlace(place=baalbek, visit_order=1, day_number=1, notes="Arrive early."),
            ItineraryPlace(place=anjar, visit_order=2, day_number=1)
        ]
    )
    cedars = Itinerary(title="Into the Cedars", duration_days=2, difficulty="Moderate")
    coastal = Itinerary(title="Coastal Heritage", duration_days=1, difficulty="Easy")

    db.session.add_all([echoes, cedars, coastal])
    db.session.commit()

    return {
        "echoes": echoes.itinerary_id,
        "baalbek": baalbek.place_id,
        "anjar": anjar.place_id,
        "ksara": ksara.place_id
    }


def get_json(client, url, expected_status=200):
    response = client.get(url)
    assert response.status_code == expected_status
    return response.get_json()


def titles(body):
    return [itinerary["title"] for itinerary in body["data"]["itineraries"]]


def test_lists_itineraries_in_the_order_they_were_added(client, itinerary_ids):
    body = get_json(client, "/api/itineraries")

    assert body["status"] == "success"
    assert body["message"] == "Itineraries retrieved successfully"
    assert titles(body) == ["Echoes of Empires", "Into the Cedars", "Coastal Heritage"]
    assert body["data"]["pagination"] == {"page": 1, "per_page": 12, "total": 3, "pages": 1}


def test_itinerary_card_shape(client, itinerary_ids):
    echoes = get_json(client, "/api/itineraries")["data"]["itineraries"][0]

    assert echoes == {
        "id": itinerary_ids["echoes"],
        "title": "Echoes of Empires",
        "description": "Explore Lebanon's Roman legacy.",
        "duration_days": 1,
        "difficulty": "Moderate",
        "cover_image": "/images/echoes.jpg",
        "route": ["Baalbek", "Anjar", "Ksara"]
    }


def test_itinerary_without_stops_has_empty_route(client, itinerary_ids):
    cedars = get_json(client, "/api/itineraries")["data"]["itineraries"][1]

    assert cedars["route"] == []
    assert cedars["description"] is None


def test_itinerary_pagination(client, itinerary_ids):
    body = get_json(client, "/api/itineraries?per_page=2&page=2")

    assert titles(body) == ["Coastal Heritage"]
    assert body["data"]["pagination"] == {"page": 2, "per_page": 2, "total": 3, "pages": 2}


@pytest.mark.parametrize("query", ["?page=abc&per_page=xyz", "?page=0&per_page=0"])
def test_bad_pagination_values_fall_back_to_defaults(client, itinerary_ids, query):
    pagination = get_json(client, f"/api/itineraries{query}")["data"]["pagination"]

    assert (pagination["page"], pagination["per_page"]) == (1, 12)


def test_empty_database_returns_empty_list(client):
    body = get_json(client, "/api/itineraries")

    assert titles(body) == []
    assert body["data"]["pagination"]["total"] == 0


def test_itinerary_details_lists_stops_in_visiting_order(client, itinerary_ids):
    body = get_json(client, f"/api/itineraries/{itinerary_ids['echoes']}")

    assert body["status"] == "success"
    assert body["message"] == "Itinerary retrieved successfully"

    itinerary = body["data"]["itinerary"]
    assert itinerary["title"] == "Echoes of Empires"
    assert itinerary["route"] == ["Baalbek", "Anjar", "Ksara"]
    assert [
        (stop["visit_order"], stop["day_number"], stop["notes"], stop["place"]["id"])
        for stop in itinerary["stops"]
    ] == [
        (1, 1, "Arrive early.", itinerary_ids["baalbek"]),
        (2, 1, None, itinerary_ids["anjar"]),
        (3, 1, None, itinerary_ids["ksara"])
    ]


def test_each_stop_uses_the_place_card_shape(client, itinerary_ids):
    stop = get_json(client, f"/api/itineraries/{itinerary_ids['echoes']}")["data"]["itinerary"]["stops"][0]

    assert stop["place"] == {
        "id": itinerary_ids["baalbek"],
        "name": "Baalbek",
        "short_description": None,
        "city": "Baalbek",
        "region": "Beqaa",
        "featured_image": None,
        "latitude": None,
        "longitude": None,
        "categories": ["Heritage"]
    }


@pytest.mark.parametrize("itinerary_id", ["999", "0", "-1", "echoes", "99999999999"])
def test_unknown_itinerary_returns_json_404(client, itinerary_ids, itinerary_id):
    body = get_json(client, f"/api/itineraries/{itinerary_id}", expected_status=404)

    assert body == {"status": "error", "message": "Itinerary not found"}
