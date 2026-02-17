import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createIncident } from "../api";
import IncidentForm from "../components/IncidentForm";

const EMPTY_FORM = {
  title: "",
  service: "",
  severity: "",
  status: "OPEN",
  owner: "",
  summary: "",
};

export default function CreateIncidentPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        owner: values.owner || null,
        summary: values.summary || null,
      };
      const created = await createIncident(payload);
      navigate(`/incidents/${created.id}`);
    } catch (err) {
      const details = err.response?.data?.details;
      if (details) {
        setError(Object.values(details).flat().join(", "));
      } else {
        setError(err.response?.data?.error || "Failed to create incident");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link to="/incidents" style={{ fontSize: "0.85rem", marginBottom: 12, display: "inline-block" }}>
        ← Back to incidents
      </Link>

      <div className="card">
        <h2 style={{ marginBottom: 20 }}>Create New Incident</h2>
        <IncidentForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitLabel="Create Incident"
          loading={loading}
          error={error}
        />
      </div>
    </>
  );
}
