import argparse
from sqlalchemy import (
    MetaData,
    Table,
    select,
    insert,
    func,
)

from app import app
from extensions import db


# =========================================================
# CURATED ITINERARIES
# =========================================================

CURATED_ITINERARIES = [

    # =====================================================
    # 1. CULTURAL HERITAGE
    # =====================================================

    {
        "title": "Echoes of Empires",

        "description": (
            "A cultural heritage journey through the Bekaa Valley, "
            "linking the monumental Roman temples of Baalbek, "
            "the Umayyad city of Anjar and the wine heritage of Ksara."
        ),

        "duration_days": 1,

        "difficulty": "Moderate",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1539650116574-75c0c6d73f6e"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1235,
                "expected_name": (
                    "Baalbek Roman Ruins "
                    "(Temples of Jupiter, Bacchus, Venus)"
                ),
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Begin the cultural heritage journey "
                    "at the monumental Roman archaeological complex."
                ),
            },

            {
                "place_id": 1231,
                "expected_name": (
                    "Anjar Umayyad Ruins (UNESCO)"
                ),
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Continue to the UNESCO-listed "
                    "Umayyad archaeological site of Anjar."
                ),
            },

            {
                "place_id": 1222,
                "expected_name": "Chateau Ksara",
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Finish in Zahle with a visit to "
                    "one of Lebanon's historic wine estates."
                ),
            },

        ],
    },


    # =====================================================
    # 2. NATURE & OUTDOORS
    # =====================================================

    {
        "title": "Into the Cedars",

        "description": (
            "A nature and outdoor journey through Bsharri, "
            "the Cedars of God and the landscapes of the Qadisha Valley."
        ),

        "duration_days": 2,

        "difficulty": "Moderate",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1464822759023-fed622ff2c3b"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1115,
                "expected_name": "Cedars of God",
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Walk among Lebanon's famous ancient cedar trees."
                ),
            },

            {
                "place_id": 1119,
                "expected_name": "Qadisha Grotto",
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Explore the natural setting near the "
                    "Qadisha Valley."
                ),
            },

            {
                "place_id": 1122,
                "expected_name": "Monastery of Mar Lishaa",
                "visit_order": 3,
                "day_number": 2,
                "notes": (
                    "Continue through the dramatic Qadisha landscape "
                    "toward the historic monastery."
                ),
            },

            {
                "place_id": 1116,
                "expected_name": "Gibran Khalil Gibran Museum",
                "visit_order": 4,
                "day_number": 2,
                "notes": (
                    "End the journey in Bsharri with "
                    "a cultural stop dedicated to Gibran."
                ),
            },

        ],
    },


    # =====================================================
    # 3. COASTAL ESCAPE
    # =====================================================

    {
        "title": "Batroun by the Sea",

        "description": (
            "A relaxed coastal escape through Batroun's "
            "historic center, old souk, fishing harbor and "
            "Mediterranean waterfront."
        ),

        "duration_days": 1,

        "difficulty": "Easy",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1507525428034-b723cf961d3e"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1064,
                "expected_name": "Batroun Historic Center Walk",
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Start with a walking route through "
                    "Batroun's historic center."
                ),
            },

            {
                "place_id": 1053,
                "expected_name": "Batroun Old Souk",
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Explore the traditional old souk "
                    "and its surrounding streets."
                ),
            },

            {
                "place_id": 1065,
                "expected_name": "Batroun Harbor / Fishing Port",
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Continue to the fishing harbor "
                    "for coastal scenery."
                ),
            },

            {
                "place_id": 1058,
                "expected_name": "Batroun Water Sports",
                "visit_order": 4,
                "day_number": 1,
                "notes": (
                    "Finish the coastal experience "
                    "with an optional sea activity."
                ),
            },

        ],
    },


    # =====================================================
    # 4. FOOD & GASTRONOMY
    # =====================================================

    {
        "title": "A Taste of Chouf",

        "description": (
            "A food and gastronomy itinerary across the Chouf, "
            "combining a winery, Lebanese dining and a local coffee stop."
        ),

        "duration_days": 1,

        "difficulty": "Easy",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1547592180-85f173990554"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1269,
                "expected_name": (
                    "St. Michael Winery & Restaurant"
                ),
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Begin with a winery and restaurant experience "
                    "in Maasser el Chouf."
                ),
            },

            {
                "place_id": 1255,
                "expected_name": "AlMidyaf Restaurant",
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Continue with Lebanese dining in Barouk."
                ),
            },

            {
                "place_id": 1278,
                "expected_name": "Azaleas coffee & more",
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Finish with coffee in Deir El Qamar."
                ),
            },

        ],
    },


    # =====================================================
    # 5. FAMILY FRIENDLY
    # =====================================================

    {
        "title": "Family Day in Chouf",

        "description": (
            "A family friendly itinerary through Deir El Qamar "
            "and the Chouf, combining an old town, museums, "
            "a castle and the cedar forest."
        ),

        "duration_days": 1,

        "difficulty": "Easy",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1524231757912-21f4fe3a7200"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1301,
                "expected_name": (
                    "Deir El Qamar Old Town & Al Midan Square"
                ),
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Begin with an easy family walk "
                    "through Deir El Qamar's historic center."
                ),
            },

            {
                "place_id": 1303,
                "expected_name": (
                    "Marie Baz Wax Museum / "
                    "Fakhreddine II Palace"
                ),
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Visit the museum and discover "
                    "local history."
                ),
            },

            {
                "place_id": 1289,
                "expected_name": "Moussa Castle",
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Continue to one of the area's "
                    "distinctive family attractions."
                ),
            },

            {
                "place_id": 1287,
                "expected_name": (
                    "Shouf Biosphere Reserve - "
                    "Barouk Cedar Forest"
                ),
                "visit_order": 4,
                "day_number": 1,
                "notes": (
                    "End the day surrounded by "
                    "the Barouk cedar forest."
                ),
            },

        ],
    },


    # =====================================================
    # 6. SIDON CULTURAL HERITAGE
    # =====================================================

    {
        "title": "Stories of Old Sidon",

        "description": (
            "A cultural heritage itinerary through Old Sidon, "
            "its palaces, khans, traditional architecture "
            "and historic souks."
        ),

        "duration_days": 1,

        "difficulty": "Easy",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1524231757912-21f4fe3a7200"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1353,
                "expected_name": "Old Sidon Heritage Walk",
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Begin with a heritage walk "
                    "through Old Sidon."
                ),
            },

            {
                "place_id": 1343,
                "expected_name": "Debbane Palace",
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Visit one of Sidon's important "
                    "historic residences."
                ),
            },

            {
                "place_id": 1344,
                "expected_name": "Khan El Franj - Saida",
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Continue to the historic khan "
                    "inside the old city."
                ),
            },

            {
                "place_id": 1342,
                "expected_name": "Soap Museum - Saida",
                "visit_order": 4,
                "day_number": 1,
                "notes": (
                    "Finish with Sidon's traditional "
                    "soap-making heritage."
                ),
            },

        ],
    },


    # =====================================================
    # 7. TYRE HERITAGE + COAST
    # =====================================================

    {
        "title": "Tyre Through Time",

        "description": (
            "A cultural and coastal journey through Tyre's "
            "UNESCO archaeological landscape, from Al-Bass "
            "to the ancient Al-Mina quarter beside the sea."
        ),

        "duration_days": 1,

        "difficulty": "Moderate",

        "cover_image": (
            "https://images.unsplash.com/"
            "photo-1500534623283-312aade485b7"
            "?auto=format&fit=crop&w=1200&q=85"
        ),

        "stops": [

            {
                "place_id": 1448,
                "expected_name": "Al-Bass Archaeological Site",
                "visit_order": 1,
                "day_number": 1,
                "notes": (
                    "Begin at the Al-Bass archaeological area."
                ),
            },

            {
                "place_id": 1450,
                "expected_name": "Necropolis of Tyre",
                "visit_order": 2,
                "day_number": 1,
                "notes": (
                    "Continue through Tyre's "
                    "ancient necropolis."
                ),
            },

            {
                "place_id": 1451,
                "expected_name": (
                    "Roman Triumphal Arch (Al-Bass)"
                ),
                "visit_order": 3,
                "day_number": 1,
                "notes": (
                    "Visit the monumental Roman "
                    "triumphal arch."
                ),
            },

            {
                "place_id": 1453,
                "expected_name": "Al-Mina Archaeological Site",
                "visit_order": 4,
                "day_number": 1,
                "notes": (
                    "Finish beside the Mediterranean "
                    "at Tyre's Al-Mina archaeological site."
                ),
            },

        ],
    },

]


# =========================================================
# HELPERS
# =========================================================

def normalized_text(value):
    return " ".join(
        str(value or "")
        .strip()
        .casefold()
        .split()
    )


def main(apply_changes=False):

    with app.app_context():

        metadata = MetaData()

        itineraries_table = Table(
            "itineraries",
            metadata,
            autoload_with=db.engine,
        )

        itinerary_places_table = Table(
            "itinerary_places",
            metadata,
            autoload_with=db.engine,
        )

        places_table = Table(
            "places",
            metadata,
            autoload_with=db.engine,
        )


        print("=" * 70)
        print("DISCOVER LEBANON - ITINERARY SEED")
        print("=" * 70)

        print()
        print(
            "MODE:",
            "APPLY" if apply_changes
            else "DRY RUN - NO DATABASE CHANGES"
        )

        print()


        # =====================================================
        # VALIDATE EVERY PLACE FIRST
        # =====================================================

        print("VALIDATING PLACES")
        print("-" * 70)


        for itinerary in CURATED_ITINERARIES:

            print()
            print(
                "ITINERARY:",
                itinerary["title"]
            )

            for stop in itinerary["stops"]:

                place = db.session.execute(
                    select(
                        places_table.c.place_id,
                        places_table.c.name,
                        places_table.c.city,
                        places_table.c.region,
                    )
                    .where(
                        places_table.c.place_id ==
                        stop["place_id"]
                    )
                ).mappings().first()


                assert place is not None, (
                    f"Missing place ID "
                    f"{stop['place_id']}"
                )


                assert (
                    normalized_text(
                        place["name"]
                    )
                    ==
                    normalized_text(
                        stop["expected_name"]
                    )
                ), (
                    f"PLACE NAME MISMATCH\n"
                    f"ID: {stop['place_id']}\n"
                    f"Expected: {stop['expected_name']}\n"
                    f"Actual: {place['name']}"
                )


                print(
                    "OK:",
                    stop["place_id"],
                    "|",
                    place["name"],
                    "|",
                    place["city"],
                    "|",
                    place["region"],
                )


        print()
        print("=" * 70)
        print("ALL PLACE REFERENCES VERIFIED")
        print("=" * 70)


        # =====================================================
        # CHECK EXISTING ITINERARIES
        # =====================================================

        print()
        print("CHECKING EXISTING ITINERARIES")
        print("-" * 70)


        existing_titles = {
            normalized_text(row.title):
            row.itinerary_id

            for row in db.session.execute(
                select(
                    itineraries_table.c.itinerary_id,
                    itineraries_table.c.title,
                )
            )
        }


        new_itineraries = []


        for itinerary in CURATED_ITINERARIES:

            key = normalized_text(
                itinerary["title"]
            )

            if key in existing_titles:

                print(
                    "ALREADY EXISTS:",
                    itinerary["title"],
                    "| ID:",
                    existing_titles[key],
                )

            else:

                print(
                    "READY TO ADD:",
                    itinerary["title"]
                )

                new_itineraries.append(
                    itinerary
                )


        # =====================================================
        # DRY RUN STOPS HERE
        # =====================================================

        if not apply_changes:

            print()
            print("=" * 70)
            print("DRY RUN COMPLETE")
            print("=" * 70)

            print(
                "New itineraries ready:",
                len(new_itineraries)
            )

            print(
                "Existing itineraries skipped:",
                len(
                    CURATED_ITINERARIES
                )
                -
                len(new_itineraries)
            )

            print()
            print("NO DATABASE CHANGES")

            return


        # =====================================================
        # APPLY
        # =====================================================

        print()
        print("=" * 70)
        print("ADDING ITINERARIES")
        print("=" * 70)


        try:

            added_count = 0

            stop_count = 0


            for itinerary in new_itineraries:

                result = db.session.execute(
                    insert(
                        itineraries_table
                    )
                    .values(
                        title=
                            itinerary[
                                "title"
                            ],

                        description=
                            itinerary[
                                "description"
                            ],

                        duration_days=
                            itinerary[
                                "duration_days"
                            ],

                        difficulty=
                            itinerary[
                                "difficulty"
                            ],

                        cover_image=
                            itinerary[
                                "cover_image"
                            ],
                    )
                    .returning(
                        itineraries_table
                        .c
                        .itinerary_id
                    )
                )


                itinerary_id = (
                    result.scalar_one()
                )


                for stop in itinerary["stops"]:

                    db.session.execute(
                        insert(
                            itinerary_places_table
                        )
                        .values(
                            itinerary_id=
                                itinerary_id,

                            place_id=
                                stop[
                                    "place_id"
                                ],

                            visit_order=
                                stop[
                                    "visit_order"
                                ],

                            day_number=
                                stop[
                                    "day_number"
                                ],

                            notes=
                                stop[
                                    "notes"
                                ],
                        )
                    )

                    stop_count += 1


                added_count += 1


                print(
                    "ADDED:",
                    itinerary["title"],
                    "| ID:",
                    itinerary_id,
                    "| Stops:",
                    len(
                        itinerary[
                            "stops"
                        ]
                    ),
                )


            db.session.commit()


            # =================================================
            # VERIFY AFTER COMMIT
            # =================================================

            itinerary_total = (
                db.session.execute(
                    select(
                        func.count()
                    )
                    .select_from(
                        itineraries_table
                    )
                )
                .scalar_one()
            )


            relation_total = (
                db.session.execute(
                    select(
                        func.count()
                    )
                    .select_from(
                        itinerary_places_table
                    )
                )
                .scalar_one()
            )


            print()
            print("=" * 70)
            print("ITINERARY SEED SUCCESSFUL")
            print("=" * 70)

            print(
                "Itineraries added:",
                added_count
            )

            print(
                "Stops added:",
                stop_count
            )

            print(
                "Total itineraries:",
                itinerary_total
            )

            print(
                "Total itinerary-place relationships:",
                relation_total
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
        help="Actually insert the itineraries",
    )

    arguments = parser.parse_args()

    main(
        apply_changes=
        arguments.apply
    )