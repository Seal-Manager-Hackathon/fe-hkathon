import { useState, useMemo, useEffect } from 'react';
import { Inbox } from 'lucide-react';
import { mockHackathonsList } from '../../../data/mockHackathonsData';
import FilterTabs from '../../../components/FilterTabs';
import SearchBox from '../../../components/SearchBox';
import HackathonListItem from '../../../components/HackathonListItem';
import Pagination from '../../../components/Pagination';
import HackathonSkeleton from '../../../components/HackathonSkeleton';

const ITEMS_PER_PAGE = 6;

export default function HackathonsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filter & search
  const filtered = useMemo(() => {
    let result = [...mockHackathonsList];

    // Filter by status tab
    if (activeFilter !== 'all') {
      result = result.filter((h) => h.status === activeFilter);
    }

    // Search across multiple fields
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(term) ||
          h.description.toLowerCase().includes(term) ||
          h.mode.toLowerCase().includes(term) ||
          h.location.toLowerCase().includes(term)
      );
    }

    return result;
  }, [activeFilter, searchTerm]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages || 1);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const isFiltered = activeFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- Header section ---- */}
        <div className="mb-6">
          <h1 className="text-[38px] font-semibold text-[#1f2f3a] tracking-[-0.5px] leading-tight max-sm:text-[30px]">
            Hackathons
          </h1>
          <p className="mt-1.5 text-[15px] text-[#5a6a73]">
            Discover upcoming and past innovation challenges
          </p>
        </div>

        {/* ---- Filter bar ---- */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <FilterTabs activeFilter={activeFilter} onChange={handleFilterChange} />
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
        </div>

        {/* ---- List / Loading / Empty ---- */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 5 }).map((_, i) => (
              <HackathonSkeleton key={i} />
            ))
          ) : filtered.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af] mb-5">
                <Inbox size={28} />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1f2f3a] mb-1">
                No hackathons found
              </h3>
              <p className="text-[14px] text-[#5a6a73] mb-5 text-center max-w-xs">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl border border-[#d8e0e6] bg-white px-5 py-2 text-[14px] font-medium text-[#1f2f3a] hover:bg-[#f4f6f8] transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            // Cards
            paginated.map((hackathon) => (
              <HackathonListItem key={hackathon.id} hackathon={hackathon} />
            ))
          )}
        </div>

        {/* ---- Pagination ---- */}
        {!isLoading && filtered.length > 0 && (
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
