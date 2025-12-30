import React from 'react';

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="pagination">
      <button type="button" className="btn" onClick={handlePrev} disabled={page === 1}>
        Prev
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button type="button" className="btn" onClick={handleNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;


