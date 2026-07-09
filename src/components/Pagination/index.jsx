import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
          currentPage === 1
            ? 'text-[#b0bec5] cursor-not-allowed'
            : 'text-[#5a6a73] hover:bg-[#e8edf1] hover:text-[#1f2f3a] cursor-pointer'
        )}
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {start > 1 && (
        <>
          <PageButton page={1} current={currentPage} onClick={onPageChange} />
          {start > 2 && <span className="px-1 text-sm text-[#9ca3af]">…</span>}
        </>
      )}

      {pages.map((page) => (
        <PageButton key={page} page={page} current={currentPage} onClick={onPageChange} />
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-sm text-[#9ca3af]">…</span>}
          <PageButton page={totalPages} current={currentPage} onClick={onPageChange} />
        </>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
          currentPage === totalPages
            ? 'text-[#b0bec5] cursor-not-allowed'
            : 'text-[#5a6a73] hover:bg-[#e8edf1] hover:text-[#1f2f3a] cursor-pointer'
        )}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function PageButton({ page, current, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      className={cn(
        'min-w-[36px] rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150',
        page === current
          ? 'bg-[#064f5d] text-white shadow-[0_2px_6px_rgba(6,79,93,0.25)] cursor-pointer'
          : 'text-[#5a6a73] hover:bg-[#e8edf1] hover:text-[#1f2f3a] cursor-pointer'
      )}
    >
      {page}
    </button>
  );
}
