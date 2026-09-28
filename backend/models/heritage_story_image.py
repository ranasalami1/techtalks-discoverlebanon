from extensions import db


class HeritageStoryImage(db.Model):
    __tablename__ = "heritage_story_images"

    image_id = db.Column(
        db.Integer,
        primary_key=True
    )

    story_id = db.Column(
        db.Integer,
        db.ForeignKey("heritage_stories.story_id", ondelete="CASCADE"),
        nullable=False
    )

    image_url = db.Column(
        db.String(255),
        nullable=False
    )

    caption = db.Column(
        db.String(255),
        nullable=True
    )

    display_order = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )