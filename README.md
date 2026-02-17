# Incident Tracker Mini App

A full-stack incident management application built with **Flask** (Python), **PostgreSQL**, and **React**.

---

## Prerequisites

| Tool       | Version   |
|------------|-----------|
| Python     | 3.10+     |
| Node.js    | 18+       |
| PostgreSQL | 14+       |

Make sure PostgreSQL is running and you can connect to it.

---

## Quick Start

### 1. Create the PostgreSQL database

```bash
# Using psql or pgAdmin, create the database:
psql -U postgres -c "CREATE DATABASE incident_tracker;"
```

> If you use different credentials, update `backend/.env` accordingly.

### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create tables & seed 200 incidents
python seed.py

# Start the Flask server (runs on http://localhost:5000)
python app.py
```

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (runs on http://localhost:3000)
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
project_ass/
├── backend/
│   ├── app.py              # Flask application factory
│   ├── config.py           # Database & app configuration
│   ├── extensions.py       # SQLAlchemy & Migrate instances
│   ├── schemas.py          # Marshmallow validation schemas
│   ├── seed.py             # Database seeder (200 records)
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables
│   ├── models/
│   │   └── incident.py     # Incident ORM model
│   └── routes/
│       └── incidents.py    # REST API endpoints
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js       # Vite config with API proxy
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Routes
        ├── api.js           # Axios API client
        ├── index.css        # Global styles
        ├── hooks/
        │   └── useDebounce.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── Badges.jsx
        │   ├── Pagination.jsx
        │   ├── IncidentTable.jsx
        │   └── IncidentForm.jsx
        └── pages/
            ├── IncidentListPage.jsx
            ├── IncidentDetailPage.jsx
            └── CreateIncidentPage.jsx
```

---

## API Endpoints

| Method  | Endpoint              | Description                         |
|---------|-----------------------|-------------------------------------|
| GET     | `/api/health`         | Health check                        |
| POST    | `/api/incidents`      | Create a new incident               |
| GET     | `/api/incidents`      | List incidents (paginated/filtered) |
| GET     | `/api/incidents/:id`  | Get a single incident               |
| PATCH   | `/api/incidents/:id`  | Update an incident                  |

### Query Parameters for `GET /api/incidents`

| Param      | Default    | Description                              |
|------------|------------|------------------------------------------|
| `page`     | 1          | Page number                              |
| `per_page` | 20         | Items per page (max 100)                 |
| `search`   | —          | Free-text search (title, service, owner) |
| `severity` | —          | Comma-separated: SEV1,SEV2,SEV3,SEV4    |
| `status`   | —          | Comma-separated: OPEN,MITIGATED,RESOLVED |
| `service`  | —          | Filter by service name                   |
| `sort_by`  | createdAt  | Column to sort on                        |
| `order`    | desc       | Sort direction: asc or desc              |

---

## Incident Data Model

| Field      | Type           | Notes                              |
|------------|----------------|------------------------------------|
| id         | UUID (string)  | Auto-generated                     |
| title      | string(255)    | Required, min 3 chars              |
| service    | string(120)    | Required                           |
| severity   | enum           | SEV1, SEV2, SEV3, SEV4             |
| status     | enum           | OPEN, MITIGATED, RESOLVED          |
| owner      | string(120)    | Optional                           |
| summary    | text           | Optional                           |
| createdAt  | datetime (UTC) | Auto-set on creation               |
| updatedAt  | datetime (UTC) | Auto-updated on modification       |
