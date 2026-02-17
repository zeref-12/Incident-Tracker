from marshmallow import Schema, fields, validate, EXCLUDE


_severity = validate.OneOf(["SEV1", "SEV2", "SEV3", "SEV4"])
_status = validate.OneOf(["OPEN", "MITIGATED", "RESOLVED"])


class CreateIncidentSchema(Schema):
    """Validates POST /api/incidents body."""

    class Meta:
        unknown = EXCLUDE

    title = fields.String(
        required=True,
        validate=validate.Length(min=3, max=255),
    )
    service = fields.String(
        required=True,
        validate=validate.Length(min=1, max=120),
    )
    severity = fields.String(required=True, validate=_severity)
    status = fields.String(load_default="OPEN", validate=_status)
    owner = fields.String(
        load_default=None,
        validate=validate.Length(max=120),
        allow_none=True,
    )
    summary = fields.String(load_default=None, allow_none=True)


class UpdateIncidentSchema(Schema):
    """Validates PATCH /api/incidents/:id body."""

    class Meta:
        unknown = EXCLUDE

    title = fields.String(validate=validate.Length(min=3, max=255))
    service = fields.String(validate=validate.Length(min=1, max=120))
    severity = fields.String(validate=_severity)
    status = fields.String(validate=_status)
    owner = fields.String(
        validate=validate.Length(max=120),
        allow_none=True,
    )
    summary = fields.String(allow_none=True)
