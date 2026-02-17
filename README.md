Incident Tracker — README.md
A minimal full‑stack incident management app: Flask + SQLAlchemy backend and React (Vite) frontend.

Quick Start

Prereqs: Python 3.10+, Node.js 18+, PostgreSQL 14+.
Clone & env: Clone repo and create a .env in backend if needed (DB URL / credentials).
Backend:
    Create DB:psql -U postgres -c "CREATE DATABASE incident_tracker;"
    From repo root:
    cd backend
    python -m venv venv
    # macOS/Linux
    source venv/bin/activate
    pip install -r requirements.txt
    python seed.py          # creates tables & seeds sample data
    python app.py           # starts server on http://localhost:5000

Frontend:
    cd frontend
    npm install
    npm run dev  
 
Create the PostgreSQL database

```bash
# Using psql or pgAdmin, create the database:
psql -U postgres -c "CREATE DATABASE incident_tracker;"
```    

Project Structure

backend/: Flask app, models, routes, schemas, seed script.
frontend/: Vite + React app, components, pages, API client.
Important UI files: IncidentTable.jsx, IncidentDetailPage.jsx

API overview
    | Method  | Endpoint              | Description                         |
|---------|-----------------------|-------------------------------------|
| GET     | `/api/health`         | Health check                        |
| POST    | `/api/incidents`      | Create a new incident               |
| GET     | `/api/incidents`      | List incidents (paginated/filtered) |
| GET     | `/api/incidents/:id`  | Get a single incident               |
| PATCH   | `/api/incidents/:id`  | Update an incident                  |

Design decisions & tradeoffs

    Flask + SQLAlchemy + Marshmallow: Lightweight and fast to iterate with good control over DB and validation. Tradeoff: more manual wiring vs batteries‑included frameworks.
    Server-side pagination, filters, and search: Keeps memory usage low for large datasets and keeps sorting/filtering consistent. Tradeoff: requires careful SQL tuning on large tables (indexes).
    Marshmallow schemas for input validation: Centralized validation and clear error responses; slight runtime overhead but safer inputs.
    React + Vite frontend: Fast dev feedback and small bundle size; simple component structure (pages + components) for clarity. Tradeoff: minimal global state management (no Redux) — fine for this scale.
    Native tooltips (title) for long owner names: Simple and cross‑browser. Tradeoff: limited styling and UX (consider custom popover for richer interactions).
    No authentication: Simplifies demo + grading; would be required for production to secure actions.
    Simple table row navigation (click → detail): Quick UX, but may need affordances to avoid accidental navigation (e.g., edit buttons).

Improvements With More Time

    Authentication & Authorization: JWT or session login; restrict create/update endpoints.
    Docker & Deployment: Dockerfiles, docker‑compose for local setup, CI pipeline and a deployment manifest.
    Tests: Unit tests for backend routes and schemas; frontend unit tests + E2E tests (Cypress).
    Robust tooltips/popovers: Replace native title with accessible, styled popovers for owner names and other truncated fields.
    Accessibility & Responsiveness: Add ARIA attributes, keyboard navigation, improved responsive layouts.
    Performance & scaling:
    Add DB indexes on searchable/sortable columns.
    Caching responses for expensive queries.
    Input & UX polish: Inline validation hints, better form UX, confirmation modals for important actions.
    Observability: Logging, metrics, structured error reporting.
    Pagination controls & infinite scroll: More UX options depending on usage patterns.
    Schema & migrations: Add Alembic migration scripts and CI checks to run DB migrations automatically.


