import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getEvents, deleteEvent, restoreEvent } from '../../../api/staff'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { hackathonFilters } from './HackathonFilters'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast, confirm } from '../../../utils/toast'
import { hackathonColumns } from './HackathonColumns'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

export default function HackathonManagement() {
  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, status, isDisable, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (status) params.Status = status
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
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
    refetch,
  } = useServerPagination({
    fetchFn: getEvents,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  async function handleDelete(event) {
    const ok = await confirm('Delete Hackathon', `Are you sure you want to delete "${event.name}"?`)
    if (!ok) return
    try {
      await deleteEvent(event.id)
      toast.success('Hackathon deleted')
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete hackathon.')
    }
  }

  async function handleRestore(event) {
    const ok = await confirm('Restore Hackathon', `Are you sure you want to restore "${event.name}"?`)
    if (!ok) return
    try {
      await restoreEvent(event.id)
      toast.success('Hackathon restored')
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore hackathon.')
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Hackathons</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">Manage all {totalCount} hackathon events.</p>
        </div>
        <Link
          to="/staff/hackathons/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />Create Hackathon
        </Link>
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
        columns={hackathonColumns(handleDelete, handleRestore)}
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
