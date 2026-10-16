from decimal import Decimal

import pytest

from extensions import db
from models import Category, Place, PlaceImage


@pytest.fixture
def place_ids(app):
    heritage = Category(name="Heritage")
    nature = Category(name="Nature")

    places = [
        Place(
            name="Byblos",
            short_description="One of the oldest continuously inhabited cities.",
            city="Byblos",
            region="Mount Lebanon",
            latitude=Decimal("34.123400"),
            longitude=Decimal("35.651900"),
            featured_image="/images/byblos.jpg",
            categories=[heritage]
        ),
        Place(name="Baalbek", city="Baalbek", region="Beqaa", categories=[heritage]),
        Place(name="Cedars of God", city="Bsharri", region="North Lebanon", categories=[nature])
    ]

    db.session.add_all(places)
    db.session.commit()

    return {place.name: place.place_id for place in places}


def get_places(client, query=""):
    response = client.get(f"/api/places{query}")
    assert response.status_code == 200
    return response.get_json()


def names(body):
    return [place["name"] for place in body["data"]["places"]]


def test_lists_places_sorted_by_name_in_standard_envelope(client, place_ids):
    body = get_places(client)

    assert body["status"] == "success"
    assert body["message"] == "Places retrieved successfully"
    assert names(body) == ["Baalbek", "Byblos", "Cedars of God"]
    assert body["data"]["pagination"] == {"page": 1, "per_page": 12, "total": 3, "pages": 1}


def test_place_summary_shape(client, place_ids):
    byblos = get_places(client, "?city=Byblos")["data"]["places"][0]

    assert byblos == {
        "id": place_ids["Byblos"],
        "name": "Byblos",
        "short_description": "One of the oldest continuously inhabited cities.",
        "city": "Byblos",
        "region": "Mount Lebanon",
        "featured_image": "/images/byblos.jpg",
        "latitude": 34.1234,
        "longitude": 35.6519,
        "categories": ["Heritage"]
    }


def test_missing_coordinates_are_null(client, place_ids):
    baalbek = get_places(client, "?city=Baalbek")["data"]["places"][0]

    assert baalbek["latitude"] is None
    assert baalbek["longitude"] is None


@pytest.mark.parametrize("query, expected", [
    ("?category=heritage", ["Baalbek", "Byblos"]),
    ("?category=NATURE", ["Cedars of God"]),
    ("?city=bsharri", ["Cedars of God"]),
    ("?region=Beqaa", ["Baalbek"]),
    ("?category=Heritage&region=Mount%20Lebanon", ["Byblos"]),
    ("?category=%20Heritage%20", ["Baalbek", "Byblos"]),
    ("?category=Food", []),
])
def test_filters_are_case_insensitive_and_combinable(client, place_ids, query, expected):
    assert names(get_places(client, query)) == expected


def test_pagination(client, place_ids):
    body = get_places(client, "?per_page=2&page=2")

    assert names(body) == ["Cedars of God"]
    assert body["data"]["pagination"] == {"page": 2, "per_page": 2, "total": 3, "pages": 2}


@pytest.mark.parametrize("query, page, per_page", [
    ("?page=abc&per_page=xyz", 1, 12),
    ("?page=0&per_page=0", 1, 12),
    ("?page=-3&per_page=-1", 1, 12),
    ("?per_page=500", 1, 50),
])
def test_bad_pagination_values_fall_back_to_defaults(client, place_ids, query, page, per_page):
    pagination = get_places(client, query)["data"]["pagination"]

    assert (pagination["page"], pagination["per_page"]) == (page, per_page)


def test_page_past_the_end_is_empty(client, place_ids):
    body = get_places(client, "?page=5")

    assert names(body) == []
    assert body["data"]["pagination"]["total"] == 3


def test_empty_database_returns_empty_list(client):
    body = get_places(client)

    assert names(body) == []
    assert body["data"]["pagination"] == {"page": 1, "per_page": 12, "total": 0, "pages": 0}


@pytest.fixture
def jeita_id(app):
    jeita = Place(
        name="Jeita Grotto",
        short_description="Limestone caves with an underground river.",
        description="Two connected karstic caves, the upper one visited on foot and the lower one by boat.",
        city="Jeita",
        region="Mount Lebanon",
        address="Jeita, Keserwan",
        latitude=Decimal("33.943600"),
        longitude=Decimal("35.641100"),
        opening_hours="9:00 AM - 6:00 PM",
        entrance_fee=Decimal("18.50"),
        website="https://www.jeitagrotto.com",
        phone="+961 9 220 840",
        featured_image="/images/jeita.jpg",
        categories=[Category(name="Nature")],
        images=[
            PlaceImage(image_url="/images/jeita-boat.jpg", alt_text="Boat ride", display_order=2),
            PlaceImage(image_url="/images/jeita-upper.jpg", alt_text="Upper cave", display_order=1)
        ]
    )

    db.session.add(jeita)
    db.session.commit()

    return jeita.place_id


def get_place(client, place_id, expected_status=200):
    response = client.get(f"/api/places/{place_id}")
    assert response.status_code == expected_status
    return response.get_json()


def test_place_details_shape(client, jeita_id):
    body = get_place(client, jeita_id)

    assert body["status"] == "success"
    assert body["message"] == "Place retrieved successfully"
    assert body["data"]["place"] == {
        "id": jeita_id,
        "name": "Jeita Grotto",
        "short_description": "Limestone caves with an underground river.",
        "description": "Two connected karstic caves, the upper one visited on foot and the lower one by boat.",
        "city": "Jeita",
        "region": "Mount Lebanon",
        "address": "Jeita, Keserwan",
        "featured_image": "/images/jeita.jpg",
        "latitude": 33.9436,
        "longitude": 35.6411,
        "opening_hours": "9:00 AM - 6:00 PM",
        "entrance_fee": 18.5,
        "website": "https://www.jeitagrotto.com",
        "phone": "+961 9 220 840",
        "categories": ["Nature"],
        "images": [
            {"url": "/images/jeita-upper.jpg", "alt_text": "Upper cave"},
            {"url": "/images/jeita-boat.jpg", "alt_text": "Boat ride"}
        ]
    }


def test_place_details_missing_fields_are_null(client, place_ids):
    baalbek = get_place(client, place_ids["Baalbek"])["data"]["place"]

    for field in ["description", "address", "opening_hours", "entrance_fee", "website", "phone"]:
        assert baalbek[field] is None

    assert baalbek["images"] == []
    assert baalbek["categories"] == ["Heritage"]


@pytest.mark.parametrize("place_id", ["999", "0", "-1", "baalbek", "99999999999"])
def test_unknown_place_returns_json_404(client, place_ids, place_id):
    body = get_place(client, place_id, expected_status=404)

    assert body == {"status": "error", "message": "Place not found"}
