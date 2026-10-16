import argparse

from sqlalchemy import (
    MetaData,
    Table,
    insert,
    select,
    func,
)

from app import app
from extensions import db


# =========================================================
# HERITAGE STORIES
#
# These are based on the stories that were previously
# hardcoded in frontend/src/app/heritage/page.js.
# =========================================================

HERITAGE_STORIES = [

    {
        "title": "Byblos: A Journey Through Time",

        "summary": (
            "One of the world's oldest continuously inhabited cities, "
            "where civilizations left their mark."
        ),

        "content": (
            "One of the world's oldest continuously inhabited cities, "
            "where civilizations left their mark."
        ),

        "author_name": None,

        "cover_image": "/images/byblos.jpg",

        "published_at": None,
    },


    {
        "title": "The Keepers of Tradition",

        "summary": (
            "Meet the artisans, farmers and locals who keep Lebanon's "
            "heritage alive, generation after generation."
        ),

        "content": (
            "Meet the artisans, farmers and locals who keep Lebanon's "
            "heritage alive, generation after generation."
        ),

        "author_name": None,

        "cover_image": "/images/keepers.jpg",

        "published_at": None
    },


    {
        "title": "The Villages on the Mountain",

        "summary": (
            "Stone houses, narrow streets and timeless landscapes that "
            "tell stories of resilience and belonging."
        ),

        "content": (
            "Stone houses, narrow streets and timeless landscapes that "
            "tell stories of resilience and belonging."
        ),

        "author_name": None,

        "cover_image": "/images/villages.jpg",

        "published_at": None
    },


    {
        "title": "A Taste of Heritage",

        "summary": (
            "From traditional recipes to local ingredients, Lebanese "
            "cuisine is a story of land, people and culture."
        ),

        "content": (
            "From traditional recipes to local ingredients, Lebanese "
            "cuisine is a story of land, people and culture."
        ),

        "author_name": None,

        "cover_image": "/images/cuisine.jpg",

        "published_at": None
    },


    {
        "title": "Festivals That Unite",

        "summary": (
            "Celebrations, music and rituals that reflect the spirit "
            "and diversity of Lebanon."
        ),

        "content": (
            "Celebrations, music and rituals that reflect the spirit "
            "and diversity of Lebanon."
        ),

        "author_name": None,

        "cover_image": "/images/festivals.jpg",

        "published_at": None
    },


    {
        "title": "Sacred Landscapes",

        "summary": (
            "Forests, valleys and natural wonders that have inspired "
            "generations and shaped our history."
        ),

        "content": (
            "Forests, valleys and natural wonders that have inspired "
            "generations and shaped our history."
        ),

        "author_name": None,

        "cover_image": "/images/landscapes.jpg",

        "published_at": None
    },


    {
        "title": "Hands That Create",

        "summary": (
            "The story behind Lebanon's traditional crafts — from pottery "
            "to weaving, a legacy of skill and soul."
        ),

        "content": (
            "The story behind Lebanon's traditional crafts — from pottery "
            "to weaving, a legacy of skill and soul."
        ),

        "author_name": None,

        "cover_image": "/images/crafts.jpg",

        "published_at": None
    },


    {
        "title": "Stories from the Land",

        "summary": (
            "Personal stories of courage, belonging and love for a homeland "
            "that never stops inspiring."
        ),

        "content": (
            "Personal stories of courage, belonging and love for a homeland "
            "that never stops inspiring."
        ),

        "author_name": None,

        "cover_image": "/images/stories-land.jpg",

        "published_at": None
    },

]


# =========================================================
# HELPERS
# =========================================================

def normalize_text(value):
    return " ".join(
        str(value or "")
        .strip()
        .casefold()
        .split()
    )


# =========================================================
# MAIN
# =========================================================

def main(apply_changes=False):

    with app.app_context():

        metadata = MetaData()


        heritage_table = Table(
            "heritage_stories",
            metadata,
            autoload_with=db.engine,
        )


        print("=" * 70)
        print("DISCOVER LEBANON - HERITAGE STORIES SEED")
        print("=" * 70)

        print()

        print(
            "MODE:",
            "APPLY"
            if apply_changes
            else "DRY RUN - NO DATABASE CHANGES"
        )

        print()


        # =================================================
        # CURRENT DATABASE
        # =================================================

        existing_rows = db.session.execute(
            select(
                heritage_table.c.story_id,
                heritage_table.c.title,
            )
        ).all()


        existing_titles = {
            normalize_text(row.title):
            row.story_id

            for row in existing_rows
        }


        print("CHECKING STORIES")
        print("-" * 70)


        new_stories = []


        for story in HERITAGE_STORIES:

            title_key = normalize_text(
                story["title"]
            )


            if title_key in existing_titles:

                print(
                    "ALREADY EXISTS:",
                    story["title"],
                    "| ID:",
                    existing_titles[
                        title_key
                    ],
                )

            else:

                print(
                    "READY TO ADD:",
                    story["title"]
                )

                new_stories.append(
                    story
                )


        # =================================================
        # DRY RUN
        # =================================================

        if not apply_changes:

            print()

            print("=" * 70)
            print("DRY RUN COMPLETE")
            print("=" * 70)

            print(
                "Stories ready:",
                len(new_stories)
            )

            print(
                "Existing stories skipped:",
                len(HERITAGE_STORIES)
                -
                len(new_stories)
            )

            print()

            print(
                "NO DATABASE CHANGES"
            )

            return


        # =================================================
        # APPLY
        # =================================================

        print()

        print("=" * 70)
        print("ADDING HERITAGE STORIES")
        print("=" * 70)


        try:

            added = 0


            for story in new_stories:

                result = db.session.execute(

                    insert(
                        heritage_table
                    )

                    .values(

                        title=
                            story[
                                "title"
                            ],

                        summary=
                            story[
                                "summary"
                            ],

                        content=
                            story[
                                "content"
                            ],

                        author_name=
                            story[
                                "author_name"
                            ],

                        cover_image=
                            story[
                                "cover_image"
                            ],

                        published_at=
                            story[
                                "published_at"
                            ],
                    )

                    .returning(
                        heritage_table
                        .c
                        .story_id
                    )

                )


                story_id = (
                    result.scalar_one()
                )


                print(
                    "ADDED:",
                    story["title"],
                    "| ID:",
                    story_id
                )


                added += 1


            db.session.commit()


            # =============================================
            # FINAL VERIFICATION
            # =============================================

            total = db.session.execute(

                select(
                    func.count()
                )

                .select_from(
                    heritage_table
                )

            ).scalar_one()


            print()

            print("=" * 70)
            print("HERITAGE STORIES SEED SUCCESSFUL")
            print("=" * 70)

            print(
                "Stories added:",
                added
            )

            print(
                "Total heritage stories:",
                total
            )


        except Exception:

            db.session.rollback()

            print()

            print(
                "SEED FAILED - "
                "TRANSACTION ROLLED BACK"
            )

            raise


# =========================================================
# COMMAND LINE
# =========================================================

if __name__ == "__main__":

    parser = argparse.ArgumentParser()


    parser.add_argument(

        "--apply",

        action="store_true",

        help=(
            "Actually insert "
            "heritage stories"
        ),
    )


    args = parser.parse_args()


    main(
        apply_changes=
        args.apply
    )