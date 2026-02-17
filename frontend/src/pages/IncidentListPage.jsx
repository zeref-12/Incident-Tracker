import { useState, useEffect, useCallback } from "react";
import { fetchIncidents } from "../api";
import IncidentTable from "../components/IncidentTable";
import Pagination from "../components/Pagination";
import { useDebounce } from "../hooks/useDebounce";

const PER_PAGE = 15;

export default function IncidentListPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const applySearch = useCallback((val) => {
    setDebouncedSearch(val);
    setPage(1);
  }, []);
  const debouncedApply = useDebounce(applySearch, 350);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    debouncedApply(e.target.value);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = {
      page,
      per_page: PER_PAGE,
      sort_by: sortBy,
      order,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (severityFilter) params.severity = severityFilter;
    if (statusFilter) params.status = statusFilter;

    fetchIncidents(params)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || "Failed to load incidents");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, severityFilter, statusFilter, sortBy, order]);

  function handleSort(col, dir) {
    setSortBy(col);
    setOrder(dir);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setDebouncedSearch("");
    setSeverityFilter("");
    setStatusFilter("");
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  }

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>Incidents</h2>

      <div className="toolbar">
        <input
          className="form-control search-input"
          placeholder="Search title, service, owner…"
          value={search}
          onChange={handleSearchChange}
        />

        <select
          className="form-control"
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Severities</option>
          <option value="SEV1">SEV1</option>
          <option value="SEV2">SEV2</option>
          <option value="SEV3">SEV3</option>
          <option value="SEV4">SEV4</option>
        </select>

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="MITIGATED">Mitigated</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <button className="btn btn-secondary" onClick={resetFilters}>
          Clear Filter
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}  

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="loading-spinner">Loading incidents…</div>
        ) : (
          <IncidentTable
            incidents={data.items}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
          />
        )}
      </div>

      {!loading && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {!loading && (
        <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: 8 }}>
          Showing {data.items.length} of {data.total} incidents
        </p>
      )}
    </>
  );
}
