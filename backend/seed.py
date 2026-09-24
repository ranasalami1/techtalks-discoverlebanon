from app import app
from extensions import db

from models import (
    User,
    Category,
    Place,
    Itinerary,
    HeritageStory,
    FAQ
)


with app.app_context():

    # Categories
    heritage = Category(
        name="Heritage",
        description="Historical and cultural places in Lebanon"
    )

    nature = Category(
        name="Nature",
        description="Natural attractions and outdoor destinations"
    )

    food = Category(
        name="Food",
        description="Lebanese food and culinary experiences"
    )

    db.session.add_all([
        heritage,
        nature,
        food
    ])

    # Example Place
    byblos = Place(
        name="Byblos Archaeological Site",
        short_description="Explore one of Lebanon's oldest historical cities.",
        description="A major archaeological and heritage destination in Byblos.",
        city="Byblos",
        region="Mount Lebanon"
    )

    byblos.categories.append(heritage)

    db.session.add(byblos)

    # Example Itinerary
    itinerary = Itinerary(
        title="Echoes of Empires",
        description="Discover important historical sites across Lebanon.",
        duration_days=2,
        difficulty="Easy"
    )

    db.session.add(itinerary)

    # Example Heritage Story
    story = HeritageStory(
        title="Traditional Lebanese Crafts",
        summary="Discover Lebanon's traditional craftsmanship.",
        content="Lebanese crafts represent generations of cultural knowledge.",
        author_name="Discover Lebanon"
    )

    db.session.add(story)

    # Example FAQ
    faq = FAQ(
        question="How do I save a place?",
        answer="Open a place and click the save button.",
        category="Saved Places"
    )

    db.session.add(faq)

    db.session.commit()

    print("Sample Discover Lebanon data added successfully.")