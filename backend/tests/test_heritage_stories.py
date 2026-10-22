from datetime import datetime

import pytest

from extensions import db
from models import HeritageStory, HeritageStoryImage


@pytest.fixture
def story_ids(app):
    byblos = HeritageStory(
        title="Byblos: A Journey Through Time",
        summary="One of the world's oldest continuously inhabited cities.",
        content="For thousands of years, Byblos has stood along Lebanon's coast.",
        author_name="Discover Lebanon",
        cover_image="/images/byblos.jpg",
        published_at=datetime(2026, 9, 10),
        images=[
            # Added out of order on purpose: the API must sort them
            HeritageStoryImage(image_url="/images/byblos-harbor.jpg", caption="The old harbor", display_order=2),
            HeritageStoryImage(image_url="/images/byblos-citadel.jpg", caption="The citadel", display_order=1)
        ]
    )
    keepers = HeritageStory(
        title="The Keepers of Tradition",
        content="Artisans who keep old crafts alive.",
        published_at=datetime(2026, 9, 20)
    )
    # No publish date, like the story in seed.py
    crafts = HeritageStory(title="Traditional Lebanese Crafts", content="Generations of knowledge.")
    festivals = HeritageStory(title="Festivals That Unite", content="Celebrations across Lebanon.")

    db.session.add_all([byblos, keepers, crafts, festivals])
    db.session.commit()

    return {"byblos": byblos.story_id, "keepers": keepers.story_id}


def get_json(client, url, expected_status=200):
    response = client.get(url)
    assert response.status_code == expected_status
    return response.get_json()


def titles(body):
    return [story["title"] for story in body["data"]["stories"]]


def test_lists_newest_first_and_undated_last(client, story_ids):
    body = get_json(client, "/api/heritage-stories")

    assert body["status"] == "success"
    assert body["message"] == "Heritage stories retrieved successfully"
    assert titles(body) == [
        "The Keepers of Tradition",          # 20 Sept
        "Byblos: A Journey Through Time",    # 10 Sept
        "Festivals That Unite",              # no date, added last
        "Traditional Lebanese Crafts"        # no date, added before it
    ]
    assert body["data"]["pagination"] == {"page": 1, "per_page": 12, "total": 4, "pages": 1}


def test_story_card_shape(client, story_ids):
    byblos = get_json(client, "/api/heritage-stories")["data"]["stories"][1]

    assert byblos == {
        "id": story_ids["byblos"],
        "title": "Byblos: A Journey Through Time",
        "summary": "One of the world's oldest continuously inhabited cities.",
        "author_name": "Discover Lebanon",
        "cover_image": "/images/byblos.jpg",
        "published_at": "2026-09-10T00:00:00"
    }


def test_story_without_date_or_summary_uses_null(client, story_ids):
    crafts = get_json(client, "/api/heritage-stories")["data"]["stories"][3]

    assert crafts["published_at"] is None
    assert crafts["summary"] is None


def test_story_pagination(client, story_ids):
    body = get_json(client, "/api/heritage-stories?per_page=3&page=2")

    assert titles(body) == ["Traditional Lebanese Crafts"]
    assert body["data"]["pagination"] == {"page": 2, "per_page": 3, "total": 4, "pages": 2}


@pytest.mark.parametrize("query", ["?page=abc&per_page=xyz", "?page=0&per_page=0"])
def test_bad_pagination_values_fall_back_to_defaults(client, story_ids, query):
    pagination = get_json(client, f"/api/heritage-stories{query}")["data"]["pagination"]

    assert (pagination["page"], pagination["per_page"]) == (1, 12)


def test_empty_database_returns_empty_list(client):
    body = get_json(client, "/api/heritage-stories")

    assert titles(body) == []
    assert body["data"]["pagination"]["total"] == 0


def test_story_details_shape(client, story_ids):
    body = get_json(client, f"/api/heritage-stories/{story_ids['byblos']}")

    assert body["status"] == "success"
    assert body["message"] == "Heritage story retrieved successfully"
    assert body["data"]["story"] == {
        "id": story_ids["byblos"],
        "title": "Byblos: A Journey Through Time",
        "summary": "One of the world's oldest continuously inhabited cities.",
        "author_name": "Discover Lebanon",
        "cover_image": "/images/byblos.jpg",
        "published_at": "2026-09-10T00:00:00",
        "content": "For thousands of years, Byblos has stood along Lebanon's coast.",
        "images": [
            {"url": "/images/byblos-citadel.jpg", "caption": "The citadel"},
            {"url": "/images/byblos-harbor.jpg", "caption": "The old harbor"}
        ]
    }


def test_story_without_images_has_empty_gallery(client, story_ids):
    story = get_json(client, f"/api/heritage-stories/{story_ids['keepers']}")["data"]["story"]

    assert story["images"] == []


@pytest.mark.parametrize("story_id", ["999", "0", "-1", "byblos", "99999999999"])
def test_unknown_story_returns_json_404(client, story_ids, story_id):
    body = get_json(client, f"/api/heritage-stories/{story_id}", expected_status=404)

    assert body == {"status": "error", "message": "Heritage story not found"}
