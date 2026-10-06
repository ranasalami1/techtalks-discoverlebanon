from flask import Flask
from flask_cors import CORS

from routes.itinerary_routes import itineraries_bp
from routes.search_routes import search_bp
from config import Config
from extensions import db, migrate
import models
from routes.heritage_story_routes import heritage_stories_bp
from routes.place_routes import places_bp

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Allow Next.js frontend to communicate with Flask
CORS(app)

# Initialize database
db.init_app(app)

# Initialize database migrations
migrate.init_app(app, db)

# Register API routes
app.register_blueprint(heritage_stories_bp)
app.register_blueprint(places_bp)
app.register_blueprint(itineraries_bp)
app.register_blueprint(search_bp)


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


if __name__ == "__main__":
    app.run(debug=True)