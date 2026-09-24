from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db


app = Flask(__name__)

# Load configuration from config.py
app.config.from_object(Config)

# Allow the Next.js frontend to communicate with Flask
CORS(app)

# Connect SQLAlchemy to the Flask application
db.init_app(app)


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