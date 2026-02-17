export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onPageChange(1)}>
        « First
      </button>
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹ Prev
      </button>

      {start > 1 && <span className="page-info">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          className={p === page ? "active" : ""}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="page-info">…</span>}

      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next ›
      </button>
      <button disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
        Last »
      </button>

      <span className="page-info">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
