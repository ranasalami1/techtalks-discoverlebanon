from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, migrate
import models



def create_app(config_overrides=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    from routes.auth import auth_bp

    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {
            "message": "Discover Lebanon backend is running"
        }

    @app.route("/api/health")
    def health():
        return {
            "status": "success",
            "message": "Discover Lebanon API is healthy"
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)