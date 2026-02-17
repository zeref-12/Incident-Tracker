import os

from flask import Flask
from flask_cors import CORS

from config import config_by_name
from extensions import db, migrate
from routes.incidents import incidents_bp


def create_app(config_name: str | None = None) -> Flask:
    """Application factory."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    app.register_blueprint(incidents_bp, url_prefix="/api/incidents")

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
