from datetime import datetime, timezone

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy import or_

from extensions import db
from models.incident import Incident
from schemas import CreateIncidentSchema, UpdateIncidentSchema

incidents_bp = Blueprint("incidents", __name__)

create_schema = CreateIncidentSchema()
update_schema = UpdateIncidentSchema()

SORTABLE_COLUMNS = {
    "title": Incident.title,
    "service": Incident.service,
    "severity": Incident.severity,
    "status": Incident.status,
    "owner": Incident.owner,
    "createdAt": Incident.created_at,
    "updatedAt": Incident.updated_at,
}


@incidents_bp.route("", methods=["POST"])
def create_incident():
    """Create a new incident."""
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        data = create_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    incident = Incident(**data)
    db.session.add(incident)
    db.session.commit()

    return jsonify(incident.to_dict()), 201


@incidents_bp.route("", methods=["GET"])
def list_incidents():
    """
    List incidents with server-side pagination, filtering, sorting, and search.

    Query params:
      page      – page number (default 1)
      per_page  – items per page (default 20, max 100)
      search    – free-text search across title, service, owner
      severity  – filter by severity (comma-separated, e.g. SEV1,SEV2)
      status    – filter by status  (comma-separated, e.g. OPEN,MITIGATED)
      service   – filter by service name
      sort_by   – column to sort on (default createdAt)
      order     – asc | desc (default desc)
    """
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 20, type=int), 100)

    query = Incident.query

    search = request.args.get("search", "").strip()
    if search:
        like_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Incident.title.ilike(like_pattern),
                Incident.service.ilike(like_pattern),
                Incident.owner.ilike(like_pattern),
            )
        )

    severity_filter = request.args.get("severity", "").strip()
    if severity_filter:
        values = [s.strip().upper() for s in severity_filter.split(",") if s.strip()]
        valid = [v for v in values if v in Incident.SEVERITY_VALUES]
        if valid:
            query = query.filter(Incident.severity.in_(valid))

    status_filter = request.args.get("status", "").strip()
    if status_filter:
        values = [s.strip().upper() for s in status_filter.split(",") if s.strip()]
        valid = [v for v in values if v in Incident.STATUS_VALUES]
        if valid:
            query = query.filter(Incident.status.in_(valid))

    service_filter = request.args.get("service", "").strip()
    if service_filter:
        query = query.filter(Incident.service.ilike(f"%{service_filter}%"))

    sort_by = request.args.get("sort_by", "createdAt")
    order = request.args.get("order", "desc").lower()
    column = SORTABLE_COLUMNS.get(sort_by, Incident.created_at)
    if order == "asc":
        query = query.order_by(column.asc())
    else:
        query = query.order_by(column.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "items": [i.to_dict() for i in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "perPage": per_page,
            "totalPages": pagination.pages,
        }
    )


@incidents_bp.route("/<string:incident_id>", methods=["GET"])
def get_incident(incident_id: str):
    """Get a single incident by ID."""
    incident = db.session.get(Incident, incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    return jsonify(incident.to_dict())


@incidents_bp.route("/<string:incident_id>", methods=["PATCH"])
def update_incident(incident_id: str):
    """Update fields of an existing incident."""
    incident = db.session.get(Incident, incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body must be JSON"}), 400

    try:
        data = update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "details": err.messages}), 400

    for key, value in data.items():
        setattr(incident, key, value)

    incident.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify(incident.to_dict())
