import os
from pathlib import Path
from dotenv import load_dotenv

# load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

# Default to SQLite so the app runs out-of-the-box without PostgreSQL.
# Set DATABASE_URL env var to use PostgreSQL:
#   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/incident_tracker
_default_db = f"sqlite:///{BASE_DIR / 'incident_tracker.db'}"


class Config:
    """Base configuration."""
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", _default_db)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
