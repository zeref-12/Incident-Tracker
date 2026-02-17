import { useNavigate } from "react-router-dom";
import { SeverityBadge, StatusBadge } from "./Badges";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "service", label: "Service" },
  { key: "severity", label: "Severity" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Owner" },
  { key: "createdAt", label: "Created" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str, n = 20) {
  if (!str) return str;
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

export default function IncidentTable({ incidents, sortBy, order, onSort }) {
  const navigate = useNavigate();

  function handleSort(key) {
    if (sortBy === key) {
      onSort(key, order === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "asc");
    }
  }

  function sortIndicator(key) {
    if (sortBy !== key) return null;
    return <span className="sort-indicator">{order === "asc" ? "▲" : "▼"}</span>;
  }

  if (!incidents.length) {
    return <div className="empty-state">No incidents found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                {sortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => {
            const owner = inc.owner || "—";
            const displayOwner = owner === "—" ? "—" : truncate(owner, 20);
            const ownerTooltip = owner && owner !== "—" && owner.length > 20 ? owner : undefined;

            return (
              <tr key={inc.id} onClick={() => navigate(`/incidents/${inc.id}`)}>
                <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inc.title}
                </td>
                <td>{inc.service}</td>
                <td>
                  <SeverityBadge severity={inc.severity} />
                </td>
                <td>
                  <StatusBadge status={inc.status} />
                </td>
                <td
                  title={ownerTooltip}
                  style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {displayOwner}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(inc.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}