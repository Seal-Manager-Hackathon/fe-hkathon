import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getEvents } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import TableActions from '../../../components/TableActions'
import { hackathonFilters } from './HackathonFilters'
import { formatDate } from '../../../utils/format'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const columns = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link
        to={`/admin/hackathons/${row.id}`}
        className="text-[14px] font-semibold text-[#064f5d] hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge label={row.status} className={statusBadge[row.status] || 'bg-[#f5f5f5] text-[#757575]'} />
    ),
  },
  {
    key: 'startTime',
    header: 'Start',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{formatDate(row.startTime)}</p>
    ),
  },
  {
    key: 'endTime',
    header: 'End',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{formatDate(row.endTime)}</p>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{formatDate(row.createdAt)}</p>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    headerClassName: 'text-right',
    className: 'text-right',
    render: (row) => (
      <TableActions viewTo={`/admin/hackathons/${row.id}`} editTo={`/admin/hackathons/${row.id}/edit`} />
    ),
  },
]

export default function HackathonManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasActive = Object.entries(filters).some(
    ([, v]) => v !== ''
  )

  const buildParams = useCallback(() => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, status, isDisable, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (status) params.Status = status
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getEvents(buildParams())
      setEvents(result.events || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load events.'
      setError(msg)
      setEvents([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Hackathons</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">
            Manage all {totalCount} hackathon events.
          </p>
        </div>
        <Link
          to="/admin/hackathons/create"
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
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <BaseTable
        columns={columns}
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

