from app import app
from extensions import db
from models.place import Place


places = [
    {
        "name": "Tripoli",
        "short_description": "A historic northern city known for its old souks, citadel, mosques and traditional architecture.",
        "description": (
            "Tripoli is one of Lebanon's largest and oldest cities. "
            "Its historic center includes traditional souks, Mamluk-era "
            "buildings, hammams, mosques and the Citadel of Raymond de Saint-Gilles."
        ),
        "city": "Tripoli",
        "region": "North Lebanon",
        "address": "Tripoli, North Lebanon, Lebanon",
        "latitude": 34.4335,
        "longitude": 35.8442,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": None,
    },

    {
        "name": "Batroun",
        "short_description": "A coastal town famous for its old streets, Phoenician sea wall and Mediterranean atmosphere.",
        "description": (
            "Batroun is a historic coastal town in northern Lebanon. "
            "Visitors can explore its traditional streets, churches, old harbor "
            "and the remains of the ancient Phoenician sea wall."
        ),
        "city": "Batroun",
        "region": "North Lebanon",
        "address": "Batroun, North Lebanon, Lebanon",
        "latitude": 34.2553,
        "longitude": 35.6581,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": None,
    },

    {
        "name": "Byblos",
        "short_description": "One of Lebanon's most famous ancient coastal cities, rich in archaeology and history.",
        "description": (
            "Byblos, also known as Jbeil, is one of the world's oldest continuously "
            "inhabited cities. It is known for its archaeological site, ancient harbor, "
            "historic souk and medieval castle."
        ),
        "city": "Byblos",
        "region": "Mount Lebanon",
        "address": "Byblos, Jbeil, Mount Lebanon, Lebanon",
        "latitude": 34.1230,
        "longitude": 35.6519,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": "/images/byblos-account.jpg",
    },

    {
        "name": "Beirut",
        "short_description": "Lebanon's capital and a vibrant center of history, culture, food and Mediterranean life.",
        "description": (
            "Beirut is the capital of Lebanon and one of the country's main cultural "
            "and economic centers. The city combines archaeological remains, museums, "
            "historic neighborhoods, restaurants, nightlife and a Mediterranean coastline."
        ),
        "city": "Beirut",
        "region": "Beirut",
        "address": "Beirut, Lebanon",
        "latitude": 33.8938,
        "longitude": 35.5018,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": None,
    },

    {
        "name": "Zahle",
        "short_description": "A city in the Beqaa Valley known for its river, restaurants and surrounding vineyards.",
        "description": (
            "Zahle is an important city in Lebanon's Beqaa Valley. "
            "It is known for the Berdawni River, traditional Lebanese restaurants, "
            "mountain scenery and nearby vineyards."
        ),
        "city": "Zahle",
        "region": "Beqaa",
        "address": "Zahle, Beqaa, Lebanon",
        "latitude": 33.8463,
        "longitude": 35.9020,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": None,
    },

    {
        "name": "Baalbek",
        "short_description": "A historic city in the Beqaa Valley famous for its monumental Roman temple complex.",
        "description": (
            "Baalbek is one of Lebanon's most important archaeological destinations. "
            "It is especially known for the monumental Roman temple complex, "
            "including the temples associated with Jupiter and Bacchus."
        ),
        "city": "Baalbek",
        "region": "Baalbek-Hermel",
        "address": "Baalbek, Baalbek-Hermel, Lebanon",
        "latitude": 34.0069,
        "longitude": 36.2039,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": "/images/heritage-hero.jpg",
    },

    {
        "name": "Chouf",
        "short_description": "A mountainous region known for cedar forests, traditional villages and cultural heritage.",
        "description": (
            "The Chouf region is one of Lebanon's most important natural and cultural areas. "
            "It includes traditional mountain villages, historic sites and the "
            "Chouf Cedar Nature Reserve."
        ),
        "city": "Chouf",
        "region": "Mount Lebanon",
        "address": "Chouf, Mount Lebanon, Lebanon",
        "latitude": 33.6970,
        "longitude": 35.5670,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": "/images/chouf.jpg",
    },

    {
        "name": "Sidon",
        "short_description": "An ancient coastal city known for its Sea Castle, old souks and Phoenician heritage.",
        "description": (
            "Sidon, also called Saida, is one of Lebanon's major historic coastal cities. "
            "Its landmarks include the Sea Castle, traditional souks, historic buildings "
            "and sites connected with its long Phoenician past."
        ),
        "city": "Sidon",
        "region": "South Lebanon",
        "address": "Sidon, South Lebanon, Lebanon",
        "latitude": 33.5575,
        "longitude": 35.3715,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": None,
    },

    {
        "name": "Tyre",
        "short_description": "An ancient Mediterranean city famous for its Phoenician history and archaeological remains.",
        "description": (
            "Tyre, also known as Sour, is an ancient coastal city in southern Lebanon. "
            "It is known for its Phoenician history, Roman archaeological remains, "
            "historic harbor areas and Mediterranean coastline."
        ),
        "city": "Tyre",
        "region": "South Lebanon",
        "address": "Tyre, South Lebanon, Lebanon",
        "latitude": 33.2705,
        "longitude": 35.2038,
        "opening_hours": None,
        "entrance_fee": None,
        "website": None,
        "phone": None,
        "featured_image": "/images/raouche.jpg",
    },
]


def seed_places():
    with app.app_context():

        print("Seeding Lebanese places...")

        for place_data in places:

            existing_place = Place.query.filter(
                db.func.lower(Place.name)
                == place_data["name"].lower()
            ).first()

            if existing_place:
                print(
                    f"Updating: {place_data['name']}"
                )

                for key, value in place_data.items():
                    setattr(
                        existing_place,
                        key,
                        value
                    )

            else:
                print(
                    f"Adding: {place_data['name']}"
                )

                place = Place(
                    **place_data
                )

                db.session.add(place)

        db.session.commit()

        print()
        print("✅ Places seeded successfully!")
        print(
            f"Total places: {Place.query.count()}"
        )


if __name__ == "__main__":
    seed_places()