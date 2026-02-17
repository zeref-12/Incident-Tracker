import uuid
from datetime import datetime, timezone

from extensions import db


class Incident(db.Model):
    """Production incident record."""

    __tablename__ = "incidents"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    title = db.Column(db.String(255), nullable=False)
    service = db.Column(db.String(120), nullable=False)
    severity = db.Column(
        db.String(4),
        nullable=False,
        comment="SEV1 | SEV2 | SEV3 | SEV4",
    )
    status = db.Column(
        db.String(10),
        nullable=False,
        default="OPEN",
        comment="OPEN | MITIGATED | RESOLVED",
    )
    owner = db.Column(db.String(120), nullable=True)
    summary = db.Column(db.Text, nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        db.Index("ix_incidents_severity", "severity"),
        db.Index("ix_incidents_status", "status"),
        db.Index("ix_incidents_service", "service"),
        db.Index("ix_incidents_created_at", "created_at"),
    )

    SEVERITY_VALUES = {"SEV1", "SEV2", "SEV3", "SEV4"}
    STATUS_VALUES = {"OPEN", "MITIGATED", "RESOLVED"}

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "service": self.service,
            "severity": self.severity,
            "status": self.status,
            "owner": self.owner,
            "summary": self.summary,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<Incident {self.id} – {self.title}>"
