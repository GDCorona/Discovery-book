export default function Pagination({ page, totalPages, onPageChange }) {
  const maxVisible = 5; // show up to 5 page buttons
  const pages = [];

  // determine page numbers to show
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + maxVisible - 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-1 mt-3 select-none">
      {/* Prev arrow */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`p-3 mb-3 text-[#4b2e2a] text-5xl ${
          page === 1 ? "opacity-0" : "hover:scale-110 transition"
        }`}
      >
        ‹
      </button>

      {/* First page */}
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#d5c5c2]"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-[#6b4f45]">...</span>}
        </>
      )}

      {/* Page buttons */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded ${
            p === page
              ? "bg-[#4b2e2a] text-white"
              : "hover:bg-[#d5c5c2] text-[#4b2e2a]"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Last page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-[#6b4f45]">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#d5c5c2]"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next arrow */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`p-3 mb-3 text-[#4b2e2a] text-5xl ${
          page === totalPages ? "opacity-0" : "hover:scale-110 transition"
        }`}
      >
        ›
      </button>
    </div>
  );
}
