export function SeverityBadge({ severity }) {
  const cls = `badge badge-${severity.toLowerCase()}`;
  return <span className={cls}>{severity}</span>;
}

export function StatusBadge({ status }) {
  const cls = `badge badge-${status.toLowerCase()}`;
  return <span className={cls}>{status}</span>;
}
