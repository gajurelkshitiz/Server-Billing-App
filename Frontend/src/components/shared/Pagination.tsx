import React from "react";

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalPages: number;
  pageSizeOptions?: number[];
};

function getPageNumbers(page: number, totalPages: number) {
  const pages = [];
  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 2) {
    pages.push(1, 2, 3, 4, '...');
  } else if (page >= totalPages - 1) {
    pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push('...', page - 1, page, page + 1, '...');
  }
  return pages;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  pageSizeOptions = [5, 10, 15, 20, 50],
}) => (
  <div className="flex items-center justify-between mt-4 px-2">
    <div className="flex items-center gap-2">
      <span>Rows per page:</span>
      <select
        value={limit}
        onChange={e => {
          setLimit(Number(e.target.value));
          setPage(1); // Reset to first page when page size changes
        }}
        className="border rounded px-2 py-1"
      >
        {pageSizeOptions.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-2 py-1 border rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        &lt;
      </button>
      {getPageNumbers(page, totalPages).map((num, idx) =>
        num === '...' ? (
          <span key={idx} className="px-2">...</span>
        ) : (
          <button
            key={num}
            onClick={() => setPage(num as number)}
            className={`px-2 py-1 border rounded ${page === num ? 'bg-blue-600 text-white' : ''}`}
          >
            {num}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-2 py-1 border rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        &gt;
      </button>
    </div>
    <span>
      Page {page} of {totalPages}
    </span>
  </div>
);

export default Pagination;