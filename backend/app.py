from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, migrate
import models

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Allow Next.js frontend to communicate with Flask
CORS(app)

# Initialize database
db.init_app(app)

# Initialize database migrations
migrate.init_app(app, db)


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