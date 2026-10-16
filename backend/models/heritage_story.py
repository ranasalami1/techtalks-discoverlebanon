from extensions import db


class HeritageStory(db.Model):
    __tablename__ = "heritage_stories"

    story_id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    summary = db.Column(
        db.String(300),
        nullable=True
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    # =====================================================
    # STORY CATEGORY
    # =====================================================

    category = db.Column(
        db.String(50),
        nullable=True
    )

    author_name = db.Column(
        db.String(100),
        nullable=True
    )

    cover_image = db.Column(
        db.String(255),
        nullable=True
    )

    published_at = db.Column(
        db.DateTime(timezone=True),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        onupdate=db.func.now(),
        nullable=False
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    images = db.relationship(
        "HeritageStoryImage",
        backref="story",
        cascade="all, delete-orphan",
        order_by="HeritageStoryImage.display_order"
    )