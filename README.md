# Discover Lebanon

**Discover Lebanon** is a full-stack web application designed to help users explore Lebanon through its destinations, cultural heritage, local businesses, activities, and curated itineraries.

The platform combines an interactive map, searchable places, heritage stories, saved destinations, personalized accounts, and curated journeys in one application.

The project was developed as part of the **TechTalks Internship Program**.

---

## Project Overview

Discover Lebanon aims to make exploring Lebanon easier by bringing useful travel and cultural information into one platform.

Users can:

* Explore destinations across Lebanon
* Browse places on an interactive map
* Search by destination, city, region, or category
* Discover restaurants, coffee shops, landmarks, and activities
* Browse curated itineraries
* Read heritage stories
* Create an account and sign in securely
* Save favorite places
* Manage account information
* Customize application settings
* Access help and support information

---

# Main Features

## Authentication

The application provides a complete authentication flow:

* Sign Up
* Login
* Logout
* Forgot Password
* Reset Password
* Password hashing
* JWT-based authentication
* Input validation
* Authentication error handling

---

## Explore Lebanon

The Explore page allows users to discover locations using an interactive map.

Features include:

* Interactive Lebanon map
* Place markers
* Category filters
* Destination search
* Featured destinations
* Place cards
* Place information
* Responsive interface

---

## Search

Users can search for places using different types of information.

Search supports:

* Place name
* City
* Region
* Description
* Category

This makes it easier to quickly find destinations and activities.

---

## Places

The application contains real place information stored in PostgreSQL.

Places may include:

* Restaurants
* Coffee shops
* Historical landmarks
* Natural attractions
* Activities
* Cultural locations

Each place can contain information such as:

* Name
* Description
* City
* Region
* Coordinates
* Categories
* Images

---

## Curated Itineraries

Users can browse curated travel journeys around Lebanon.

Each itinerary contains:

* Title
* Description
* Ordered stops
* Connected places
* Route information

Examples include cultural, nature, coastal, and historical journeys.

---

## Heritage Stories

The Heritage Stories section allows users to explore Lebanon's cultural and historical background.

Features include:

* Heritage story cards
* Story categories
* Search and filtering
* Story details
* Images
* Multilingual interface support

---

## Saved Places

Authenticated users can create their own collection of favorite places.

Users can:

* Save places
* View saved places
* Remove saved places
* Restore recently removed places
* Open place details

Saved places are connected to the authenticated user's account.

---

## My Account

Users can manage their account information.

Supported account information includes:

* Full name
* Email
* Profile image
* Account information

Account updates are protected using JWT authentication.

---

## Settings

The Settings section allows users to customize their experience.

Available sections include:

* General
* Notifications
* Privacy & Security
* Display
* Language
* Data & Storage
* Help & Support

Backend-supported settings include:

* Language
* Email notifications
* Push notifications

Other interface preferences can be stored locally on the user's device.

---

## Help & Support

The Help Center provides guidance for users.

It includes:

* Getting Started
* Explore the Map
* Itineraries
* Saved Places
* Account & Settings
* Technical Support
* Frequently Asked Questions
* Searchable help topics

---

# Technologies Used

## Frontend

* **Next.js**
* **React**
* **JavaScript**
* **Tailwind CSS**
* **Leaflet**
* **React Leaflet**
* **Lucide React**
* **Next.js App Router**

---

## Backend

* **Python**
* **Flask**
* **Flask-SQLAlchemy**
* **Flask-Migrate**
* **Flask-JWT-Extended**
* **Flask-CORS**
* **SQLAlchemy**
* **Alembic**

---

## Database

* **PostgreSQL**

The project uses a relational database containing tables such as:

* users
* user_settings
* password_reset_tokens
* places
* categories
* place_categories
* place_images
* itineraries
* itinerary_places
* saved_places
* heritage_stories
* heritage_story_images
* faqs

---

## Development & Collaboration Tools

* **Git**
* **GitHub**
* **Jira**
* **VS Code**
* **Postman / API testing tools**
* **pgAdmin / PostgreSQL tools**

Jira was used to organize:

* Backlog
* Sprint tasks
* Development tasks
* Bug fixes
* Task priorities
* Progress tracking
* Team responsibilities

---

# System Architecture

The application follows a full-stack architecture:

```text
Next.js Frontend
        ↓
Flask REST API
        ↓
SQLAlchemy ORM
        ↓
PostgreSQL Database
```

The frontend communicates with the Flask backend using HTTP requests.

The backend processes the request, performs validation and business logic, communicates with PostgreSQL using SQLAlchemy, and returns JSON responses to the frontend.

---

# Project Structure

```text
techtalks-discoverlebanon/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── data/
│   │
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── migrations/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/ranasalami1/techtalks-discoverlebanon.git
```

Move into the project:

```bash
cd techtalks-discoverlebanon
```

If the final project version is currently on the `dev` branch:

```bash
git fetch origin
git switch dev
git pull origin dev
```

---

# Backend Setup

## 2. Create a Python Virtual Environment

Move to the backend:

```bash
cd backend
```

Create the virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# PostgreSQL Setup

## 4. Install PostgreSQL

Make sure PostgreSQL is installed and running.

Create a database named:

```text
discover_lebanon
```

You can create the database using pgAdmin or PostgreSQL command-line tools.

Example:

```sql
CREATE DATABASE discover_lebanon;
```

---

# Environment Variables

## 5. Configure the Backend Environment

The project includes an `.env.example` file.

Create your own `.env` file based on it.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Then update your local environment variables with your PostgreSQL connection and local secrets.

**Never commit your real `.env` file to GitHub.**

Sensitive information such as the following must remain private:

* Database passwords
* JWT secrets
* Email credentials
* API keys
* Other private credentials

---

# Database Migrations

## 6. Apply the Database Migrations

From the `backend` folder run:

```bash
flask db upgrade
```

This creates or updates the required database tables.

---

# Seed Data

If you want to load the available sample data, use the project's seed script when applicable.

For example:

```bash
python seed.py
```

Additional project data may also be imported using the data import scripts included in the backend.

---

# Start the Backend

## 7. Run Flask

From the backend directory:

```bash
flask run
```

The backend should run on:

```text
http://127.0.0.1:5000
```

You can verify the backend using the health endpoint:

```text
http://127.0.0.1:5000/api/health
```

Keep this terminal running.

---

# Frontend Setup

## 8. Install Frontend Dependencies

Open another terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## 9. Start Next.js

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:3000
```

Open this URL in your browser.

---

# Running the Full Application

You need both servers running at the same time.

### Terminal 1 — Backend

```bash
cd backend
venv\Scripts\activate
flask run
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Authentication Setup for New Developers

User accounts are stored inside PostgreSQL.

Cloning the GitHub repository does **not** automatically copy another developer's local PostgreSQL database.

After setting up the database and running the migrations, create a new account using the application's Sign Up page.

Existing accounts from another developer's local database will not automatically exist on your machine.

---

# Main Backend APIs

The application provides REST API endpoints for the main platform features.

Examples include:

```text
/api/auth/signup
/api/auth/login
/api/auth/forgot-password
/api/auth/reset-password

/api/places
/api/search

/api/itineraries
/api/heritage-stories

/api/saved-places

/api/account
/api/settings
```

Protected endpoints require a valid JWT access token.

---

# Security

The project includes several security considerations:

* Password hashing
* JWT authentication
* Protected private endpoints
* Input validation
* Email validation
* Password validation
* Error handling
* Database constraints
* Protected environment variables
* `.env` excluded from Git
* User-specific saved places
* Protected account and settings updates

Sensitive values must never be committed to GitHub.

---

# Validation & Error Handling

The backend validates incoming requests and returns appropriate HTTP responses.

Examples include:

* Missing required fields
* Invalid email format
* Weak passwords
* Duplicate email addresses
* Invalid login credentials
* Unknown records
* Invalid IDs
* Unauthorized access

---

# Development Workflow

The team followed an Agile-style development workflow.

```text
Backlog
   ↓
To Do
   ↓
In Progress
   ↓
Development
   ↓
Testing
   ↓
Code Review
   ↓
Done
```

Jira was used for task organization and sprint tracking.

Git and GitHub were used for:

* Feature branches
* Bug-fix branches
* Commits
* Pull requests
* Code integration
* Team collaboration

---

# Testing

The project includes backend testing for major functionality including:

* Authentication
* Validation
* Places
* Search
* Curated itineraries
* Heritage stories
* Saved places
* My Account
* Settings

Testing was also performed manually between the Next.js frontend and Flask backend.

---

# Challenges Solved During Development

During development, the team worked through several technical issues, including:

* Frontend/backend integration
* PostgreSQL setup and migrations
* Authentication and JWT integration
* Missing backend APIs
* API validation and error handling
* Preserving APIs during branch integration
* Duplicate database records
* Place data import and cleanup
* Image loading issues
* Route and 404 issues
* Responsive mobile layout issues
* Active sidebar/navigation state
* Shared navigation between pages
* Saved Places integration
* Account integration
* Settings integration
* Help Center functionality
* Team Git branch integration

---

# Future Improvements

Possible future improvements include:

* Full production deployment
* Advanced recommendation system
* AI-powered travel recommendations
* User-generated reviews
* Ratings
* Advanced itinerary builder
* Offline maps
* Push notification service
* Full multilingual translation coverage
* Two-factor authentication
* Account deletion workflow
* Admin dashboard
* Analytics
* More destinations and local businesses
* Additional user testing and feedback

---

# Team

**Project:** Discover Lebanon
**Internship:** TechTalks

Team members:

* Rana Salami
* Yasmine Hoteit
* Arwaa Abo Niaaj
* Kinda Yehya
* Malak Mansour
* Wissam Hijaz

---

# Project Goal

The goal of Discover Lebanon is to provide a useful and accessible platform that helps locals and visitors discover Lebanon's places, culture, heritage, activities, and travel experiences through a modern full-stack web application.

---

## Final MVP

The final MVP demonstrates the complete workflow between:

```text
User
 ↓
Next.js Interface
 ↓
Flask REST API
 ↓
SQLAlchemy
 ↓
PostgreSQL
```

It demonstrates the team's work in frontend development, backend development, database design, API integration, authentication, testing, debugging, project management, and team collaboration.

---

## License

This project was developed for educational and internship purposes as part of the TechTalks internship program.
