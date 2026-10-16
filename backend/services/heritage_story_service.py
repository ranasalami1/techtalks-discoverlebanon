from sqlalchemy.orm import selectinload

from extensions import db
from models import HeritageStory
from services.place_service import (
    DEFAULT_PER_PAGE,
    MAX_ID,
    MAX_PER_PAGE,
)


# =========================================================
# HERITAGE STORIES LIST
# =========================================================

def get_heritage_stories(
    page=1,
    per_page=DEFAULT_PER_PAGE
):
    """
    Return paginated heritage stories.

    Newest published stories appear first.
    Stories without a publication date appear last.
    story_id keeps ordering stable.
    """

    query = (
        db.select(HeritageStory)
        .order_by(
            HeritageStory
            .published_at
            .desc()
            .nulls_last(),

            HeritageStory
            .story_id
            .desc()
        )
    )

    # Same pagination rules as Places
    if page is None or page < 1:
        page = 1

    if (
        per_page is None
        or per_page < 1
    ):
        per_page = DEFAULT_PER_PAGE

    return db.paginate(
        query,
        page=page,
        per_page=min(
            per_page,
            MAX_PER_PAGE
        ),
        error_out=False
    )


# =========================================================
# HERITAGE STORY DETAILS
# =========================================================

def get_heritage_story_by_id(
    story_id
):
    """
    Return one HeritageStory including
    its ordered gallery images.
    """

    try:
        story_id = int(
            story_id
        )

    except (
        ValueError,
        TypeError
    ):
        return None


    if (
        story_id < 1
        or story_id > MAX_ID
    ):
        return None


    return db.session.get(
        HeritageStory,
        story_id,
        options=[
            selectinload(
                HeritageStory.images
            )
        ]
    )


# =========================================================
# SUMMARY SERIALIZER
#
# Used by:
# GET /api/heritage-stories
# =========================================================

def serialize_heritage_story_summary(
    story
):
    return {
        "id":
            story.story_id,

        "title":
            story.title,

        "summary":
            story.summary,

        # NEW:
        # category now comes directly
        # from PostgreSQL.
        "category":
            story.category,

        "author_name":
            story.author_name,

        "cover_image":
            story.cover_image,

        "published_at":
            _to_iso(
                story.published_at
            )
    }


# =========================================================
# DETAIL SERIALIZER
#
# Used by:
# GET /api/heritage-stories/<story_id>
# =========================================================

def serialize_heritage_story_details(
    story
):
    images = sorted(
        story.images,
        key=lambda image: (
            image.display_order,
            image.image_id
        )
    )

    return {
        # Includes:
        # id
        # title
        # summary
        # category
        # author_name
        # cover_image
        # published_at
        **serialize_heritage_story_summary(
            story
        ),

        "content":
            story.content,

        "images": [
            {
                "url":
                    image.image_url,

                "caption":
                    image.caption
            }

            for image in images
        ]
    }


# =========================================================
# DATE HELPER
# =========================================================

def _to_iso(value):
    """
    Convert a Python datetime into
    ISO-8601 text.

    Example:
    2026-09-10T00:00:00

    None stays None.
    """

    return (
        value.isoformat()
        if value is not None
        else None
    )