import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchIncident, updateIncident } from "../api";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import IncidentForm from "../components/IncidentForm";

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncate(str, n = 20) {
  if (!str) return str;
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchIncident(id)
      .then((data) => {
        setIncident(data);
        setFormValues({
          title: data.title,
          service: data.service,
          severity: data.severity,
          status: data.status,
          owner: data.owner || "",
          summary: data.summary || "",
        });
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load incident");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateIncident(id, {
        ...formValues,
        owner: formValues.owner || null,
        summary: formValues.summary || null,
      });
      setIncident(updated);
      setEditing(false);
    } catch (err) {
      const details = err.response?.data?.details;
      if (details) {
        setSaveError(Object.values(details).flat().join(", "));
      } else {
        setSaveError(err.response?.data?.error || "Failed to save");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading-spinner">Loading incident…</div>;
  if (error)
    return (
      <div>
        <div className="error-banner">{error}</div>
        <Link to="/incidents">← Back to list</Link>
      </div>
    );

  return (
    <>
      <Link to="/incidents" style={{ fontSize: "0.85rem", marginBottom: 12, display: "inline-block" }}>
        ← Back to incidents
      </Link>

      <div className="card">
        <div className="detail-header">
          <h2>{incident.title}</h2>
          {!editing && (
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
          {editing && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditing(false);
                setFormValues({
                  title: incident.title,
                  service: incident.service,
                  severity: incident.severity,
                  status: incident.status,
                  owner: incident.owner || "",
                  summary: incident.summary || "",
                });
                setSaveError(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {editing ? (
          <IncidentForm
            values={formValues}
            onChange={setFormValues}
            onSubmit={handleSave}
            submitLabel="Save Changes"
            loading={saving}
            error={saveError}
          />
        ) : (
          <>
            <div className="detail-grid">
              <div className="detail-field">
                <div className="label">Service</div>
                <div className="value">{incident.service}</div>
              </div>
              <div className="detail-field">
                <div className="label">Severity</div>
                <div className="value">
                  <SeverityBadge severity={incident.severity} />
                </div>
              </div>
              <div className="detail-field">
                <div className="label">Status</div>
                <div className="value">
                  <StatusBadge status={incident.status} />
                </div>
              </div>
              <div className="detail-field">
                <div className="label">Owner</div>
                {(() => {
                  const owner = incident.owner || "Unassigned";
                  const displayOwner = owner === "Unassigned" ? "Unassigned" : truncate(owner, 20);
                  const ownerTooltip = owner !== "Unassigned" && owner.length > 20 ? owner : undefined;
                  return (
                    <div
                      className="value"
                      title={ownerTooltip}
                      style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {displayOwner}
                    </div>
                  );
                })()}
              </div>
              <div className="detail-field">
                <div className="label">Created</div>
                <div className="value">{formatDate(incident.createdAt)}</div>
              </div>
              <div className="detail-field">
                <div className="label">Updated</div>
                <div className="value">{formatDate(incident.updatedAt)}</div>
              </div>
            </div>

            {incident.summary && (
              <div style={{ marginTop: 20 }}>
                <div className="detail-field">
                  <div className="label">Summary</div>
                  <div className="value" style={{ whiteSpace: "pre-wrap" }}>
                    {incident.summary}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}