import { useCallback } from 'react'
import { getMyStaffEvents } from '../../../api/staff'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { hackathonFilters } from './HackathonFilters'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { hackathonColumns } from './HackathonColumns'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  fromDate: '',
  toDate: '',
}

export default function HackathonManagement() {
  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, status, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (status) params.Status = status
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [])

  const {
    data: events,
    totalCount,
    loading,
    error,
    filters,
    pageIndex,
    hasActive,
    setPageIndex,
    handleFilterChange,
    handleReset,
  } = useServerPagination({
    fetchFn: getMyStaffEvents,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Hackathons</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">Manage all {totalCount} hackathon events.</p>
        </div>
      </div>

      <FilterBar
        filters={hackathonFilters}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        hasActive={hasActive}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <BaseTable
        columns={hackathonColumns()}
        data={events}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No hackathons match the current filters.' : 'No hackathons in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="800px"
      />
    </div>
  )
}
