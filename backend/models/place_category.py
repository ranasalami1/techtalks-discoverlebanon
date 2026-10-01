from extensions import db


place_categories = db.Table(
    "place_categories",

    db.Column(
        "place_id",
        db.Integer,
        db.ForeignKey("places.place_id", ondelete="CASCADE"),
        primary_key=True
    ),

    db.Column(
        "category_id",
        db.Integer,
        db.ForeignKey("categories.category_id", ondelete="CASCADE"),
        primary_key=True
    )
)