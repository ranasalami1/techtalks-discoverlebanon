import pytest

from extensions import db
from models import Category, Place


@pytest.fixture
def places(app):
    heritage = Category(name="Heritage")
    nature = Category(name="Nature")

    db.session.add_all([
        Place(
            name="Byblos",
            short_description="One of the oldest continuously inhabited cities.",
            city="Byblos",
            region="Mount Lebanon",
            categories=[heritage]
        ),
        Place(
            name="Baalbek",
            description="Roman temples of Jupiter and Bacchus.",
            city="Baalbek",
            region="Beqaa",
            categories=[heritage]
        ),
        Place(
            name="Cedars of God",
            short_description="Ancient cedar forest.",
            city="Bsharri",
            region="North Lebanon",
            categories=[nature]
        ),
        Place(
            name="Bsharri Gibran Museum",
            description="Near the cedar forest of Bsharri.",
            city="Bsharri",
            region="North Lebanon",
            categories=[heritage]
        ),
        Place(
            name="Qadisha Valley",
            description="Monasteries below the cedar groves.",
            city="Qadisha",
            region="North Lebanon",
            categories=[nature]
        )
    ])
    db.session.commit()


def search(client, query=""):
    response = client.get(f"/api/search{query}")
    assert response.status_code == 200
    return response.get_json()


def names(body):
    return [place["name"] for place in body["data"]["places"]]


def test_search_response_shape(client, places):
    body = search(client, "?q=%20%20byblos%20")

    assert body["status"] == "success"
    assert body["message"] == "Search results retrieved successfully"
    assert body["data"]["query"] == "byblos"
    assert names(body) == ["Byblos"]
    assert body["data"]["pagination"] == {"page": 1, "per_page": 12, "total": 1, "pages": 1}


@pytest.mark.parametrize("text, expected", [
    ("byblos", ["Byblos"]),                                  # name
    ("BAALBEK", ["Baalbek"]),                                # capitals don't matter
    ("bybl", ["Byblos"]),                                    # part of a word
    ("bsharri", ["Bsharri Gibran Museum", "Cedars of God"]), # city
    ("beqaa", ["Baalbek"]),                                  # region
    ("inhabited", ["Byblos"]),                               # short description
    ("jupiter", ["Baalbek"]),                                # description
    ("nature", ["Cedars of God", "Qadisha Valley"]),         # category
    ("pizza", []),                                           # no match
])
def test_search_looks_in_every_field(client, places, text, expected):
    assert names(search(client, f"?q={text}")) == expected


@pytest.mark.parametrize("sort, expected", [
    ("", ["Cedars of God", "Bsharri Gibran Museum", "Qadisha Valley"]),
    ("&sort=relevance", ["Cedars of God", "Bsharri Gibran Museum", "Qadisha Valley"]),
    ("&sort=name_asc", ["Bsharri Gibran Museum", "Cedars of God", "Qadisha Valley"]),
    ("&sort=name_desc", ["Qadisha Valley", "Cedars of God", "Bsharri Gibran Museum"]),
    ("&sort=banana", ["Bsharri Gibran Museum", "Cedars of God", "Qadisha Valley"]),
])
def test_sort_options(client, places, sort, expected):
    assert names(search(client, f"?q=cedar{sort}")) == expected


@pytest.mark.parametrize("query", ["", "?q=", "?q=%20%20"])
def test_empty_search_returns_every_place(client, places, query):
    body = search(client, query)

    assert body["data"]["query"] == ""
    assert names(body) == [
        "Baalbek", "Bsharri Gibran Museum", "Byblos", "Cedars of God", "Qadisha Valley"
    ]


def test_search_combines_with_category(client, places):
    assert names(search(client, "?q=cedar&category=heritage")) == ["Bsharri Gibran Museum"]


@pytest.mark.parametrize("text", ["%25", "_"])
def test_wildcard_characters_are_plain_text(client, places, text):
    # Without autoescape, "%" or "_" would match every place
    assert names(search(client, f"?q={text}")) == []


def test_search_pagination(client, places):
    body = search(client, "?q=cedar&per_page=2&page=2")

    assert names(body) == ["Qadisha Valley"]
    assert body["data"]["pagination"] == {"page": 2, "per_page": 2, "total": 3, "pages": 2}
