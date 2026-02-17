export default function IncidentForm({ values, onChange, onSubmit, submitLabel, loading, error }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {error && <div className="error-banner">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={values.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={255}
          placeholder="Brief incident title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="service">Service *</label>
        <input
          id="service"
          name="service"
          className="form-control"
          value={values.service}
          onChange={handleChange}
          required
          maxLength={120}
          placeholder="e.g. auth-service"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label htmlFor="severity">Severity *</label>
          <select
            id="severity"
            name="severity"
            className="form-control"
            value={values.severity}
            onChange={handleChange}
            required
          >
            <option value="">Select severity</option>
            <option value="SEV1">SEV1 – Critical</option>
            <option value="SEV2">SEV2 – High</option>
            <option value="SEV3">SEV3 – Medium</option>
            <option value="SEV4">SEV4 – Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={values.status}
            onChange={handleChange}
          >
            <option value="OPEN">Open</option>
            <option value="MITIGATED">Mitigated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          name="owner"
          className="form-control"
          value={values.owner}
          onChange={handleChange}
          maxLength={120}
          placeholder="Assignee name (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          name="summary"
          className="form-control"
          value={values.summary}
          onChange={handleChange}
          placeholder="Detailed summary (optional)"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
