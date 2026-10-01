from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash

from config import Config
from extensions import db, migrate
import models
from models import User

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


@app.route("/api/auth/login", methods=["POST"])
def login():
    credentials = request.get_json(silent=True)
    if not isinstance(credentials, dict):
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    email = credentials.get("email")
    password = credentials.get("password")
    if not isinstance(email, str) or not email.strip() or not isinstance(password, str) or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    user = User.query.filter(db.func.lower(User.email) == email.strip().lower()).first()
    if (
        user is None
        or not user.is_active
        or not check_password_hash(user.password_hash, password)
    ):
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    return jsonify({
        "status": "success",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
        },
    }), 200


if __name__ == "__main__":
    app.run(debug=True)