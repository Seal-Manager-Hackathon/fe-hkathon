import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eye, UserRound, Lock, CircleCheck, Calendar } from 'lucide-react'
import { getTeams } from '../../../api/staff'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import { teamsFilters } from './TeamsFilters'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  canEdit: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

export default function TeamsManagement() {
  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, canEdit, isDisable, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (canEdit !== '') params.CanEdit = canEdit === 'true'
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [])

  const {
    data: teams,
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
    fetchFn: getTeams,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  const columns = useMemo(() => [
    { key: 'name', header: 'Team Name', headerIcon: UserRound, render: (row) => <Link to={`/staff/teams/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.name}</Link> },
    { key: 'canEdit', header: 'Lock', headerIcon: Lock, render: (row) => <Badge label={row.canEdit ? 'No' : 'Yes'} className={row.canEdit ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffcdd2] text-[#e65100]'} /> },
    { key: 'isDisable', header: 'Status', headerIcon: CircleCheck, render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions', header: '', headerClassName: 'text-right', className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/staff/teams/${row.id}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]">
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ], [])

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6"><h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Teams</h1></div>
      <FilterBar filters={teamsFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <BaseTable columns={columns} data={teams} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No teams match the current filters.' : 'No teams in the system yet.'} keyExtractor={(row) => row.id} minWidth="700px" />
    </div>
  )
}
