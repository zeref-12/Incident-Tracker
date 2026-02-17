"""
Putting ~200 dummy data
"""

import random
import uuid
from datetime import datetime, timedelta, timezone

from app import create_app
from extensions import db
from models.incident import Incident


SERVICES = [
    "auth-service",
    "payment-gateway",
    "user-api",
    "notification-service",
    "order-service",
    "inventory-service",
    "search-service",
    "analytics-pipeline",
    "cdn-edge",
    "billing-service",
    "email-service",
    "cache-layer",
    "api-gateway",
    "logging-service",
    "config-service",
]

OWNERS = [
    "Alice Chen",
    "Bob Martinez",
    "Carol Park",
    "David Kim",
    "Eva Johansson",
    "Frank Liu",
    "Grace Okafor",
    "Henry Singh",
    "Irene Rossi",
    "James Brown",
    None,  # some incidents have no owner
]

TITLE_TEMPLATES = [
    "{service} returning 5xx errors",
    "High latency on {service}",
    "{service} memory leak detected",
    "Connection pool exhaustion in {service}",
    "{service} deployment rollback",
    "Certificate expiry warning for {service}",
    "Database replication lag in {service}",
    "{service} disk usage above 90%",
    "Rate limiting triggered on {service}",
    "DNS resolution failures for {service}",
    "{service} pod crash loop",
    "Upstream timeout from {service}",
    "{service} data inconsistency detected",
    "Scheduled maintenance for {service}",
    "Security patch required for {service}",
]

SUMMARY_TEMPLATES = [
    "Monitoring detected anomalous behaviour. Investigation is underway.",
    "Users reported degraded experience. On-call engineer paged.",
    "Automated alerts fired at {time}. Root cause under analysis.",
    "Deployment triggered unexpected side-effects. Rolling back.",
    "Third-party dependency outage impacting {service}.",
    "Capacity limits reached during peak traffic window.",
    "Configuration drift identified after recent release.",
    None,
]

SEVERITIES = ["SEV1", "SEV2", "SEV3", "SEV4"]
STATUSES = ["OPEN", "MITIGATED", "RESOLVED"]

SEVERITY_WEIGHTS = [5, 15, 40, 40]  # SEV1 is rare
STATUS_WEIGHTS = [30, 30, 40]


def random_datetime_last_90_days() -> datetime:
    now = datetime.now(timezone.utc)
    delta = timedelta(seconds=random.randint(0, 90 * 24 * 3600))
    return now - delta


def generate_incident() -> Incident:
    service = random.choice(SERVICES)
    created = random_datetime_last_90_days()
    updated = created + timedelta(minutes=random.randint(0, 4320))  # up to 3 days later

    title_tpl = random.choice(TITLE_TEMPLATES)
    title = title_tpl.format(service=service)

    summary_tpl = random.choice(SUMMARY_TEMPLATES)
    summary = (
        summary_tpl.format(service=service, time=created.strftime("%H:%M UTC"))
        if summary_tpl
        else None
    )

    return Incident(
        id=str(uuid.uuid4()),
        title=title,
        service=service,
        severity=random.choices(SEVERITIES, weights=SEVERITY_WEIGHTS, k=1)[0],
        status=random.choices(STATUSES, weights=STATUS_WEIGHTS, k=1)[0],
        owner=random.choice(OWNERS),
        summary=summary,
        created_at=created,
        updated_at=updated,
    )


def seed(count: int = 200) -> None:
    app = create_app()
    with app.app_context():
        db.create_all()

        existing = db.session.query(Incident).count()
        if existing >= count:
            print(f"Database already has {existing} incidents. Skipping seed.")
            return

        incidents = [generate_incident() for _ in range(count)]
        db.session.bulk_save_objects(incidents)
        db.session.commit()
        print(f"Seeded {count} incidents successfully.")


if __name__ == "__main__":
    seed()
