from extensions import db


class FAQ(db.Model):
    __tablename__ = "faqs"

    faq_id = db.Column(
        db.Integer,
        primary_key=True
    )

    question = db.Column(
        db.String(255),
        nullable=False
    )

    answer = db.Column(
        db.Text,
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=True
    )

    display_order = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        server_default=db.func.now(),
        nullable=False
    )