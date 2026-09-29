from sqlalchemy.orm import selectinload

from extensions import db
from models import HeritageStory
from services.place_service import DEFAULT_PER_PAGE, MAX_ID, MAX_PER_PAGE


def get_heritage_stories(page=1, per_page=DEFAULT_PER_PAGE):
    # Newest publish date first. Stories without a date go last, and
    # story_id keeps the order stable (most recently added first).
    query = (
        db.select(HeritageStory)
        .order_by(
            HeritageStory.published_at.desc().nulls_last(),
            HeritageStory.story_id.desc()
        )
    )

    # Same page rules as the Places list
    if page is None or page < 1:
        page = 1

    if per_page is None or per_page < 1:
        per_page = DEFAULT_PER_PAGE

    return db.paginate(
        query,
        page=page,
        per_page=min(per_page, MAX_PER_PAGE),
        error_out=False
    )


def get_heritage_story_by_id(story_id):
    # Same ID rules as Place Details: text or out-of-range numbers mean "not found"
    try:
        story_id = int(story_id)
    except ValueError:
        return None

    if story_id < 1 or story_id > MAX_ID:
        return None

    return db.session.get(
        HeritageStory,
        story_id,
        options=[selectinload(HeritageStory.images)]
    )


def serialize_heritage_story_summary(story):
    # Shape used by story cards
    return {
        "id": story.story_id,
        "title": story.title,
        "summary": story.summary,
        "author_name": story.author_name,
        "cover_image": story.cover_image,
        "published_at": _to_iso(story.published_at)
    }


def serialize_heritage_story_details(story):
    # Shape used by one story: the card plus the full text and its photo gallery
    images = sorted(story.images, key=lambda image: (image.display_order, image.image_id))

    return {
        **serialize_heritage_story_summary(story),
        "content": story.content,
        "images": [
            {"url": image.image_url, "caption": image.caption}
            for image in images
        ]
    }


def _to_iso(value):
    # Dates become standard text like "2026-09-10T00:00:00", or null if missing
    return value.isoformat() if value is not None else None
