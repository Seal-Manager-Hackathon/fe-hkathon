import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Search, CircleDot, Calendar } from 'lucide-react'
import Badge from '../../../components/Badge'
import FilterBar from '../../../components/FilterBar'
import BaseTable from '../../../components/BaseTable'
import { getLecturerEvents } from '../../../api/lecturer'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const DEFAULT_VALUES = { keyword: '', status: '', fromDate: '', toDate: '' }

const eventFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by event name...', className: 'w-full sm:w-[280px]' },
  { type: 'select', key: 'status', label: 'Status', icon: CircleDot, options: [{ value: '', label: 'All Statuses' }, { value: 'Published', label: 'Published' }, { value: 'Closed', label: 'Closed' }], className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'fromDate', label: 'From', icon: Calendar, className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'toDate', label: 'To', icon: Calendar, className: 'w-full sm:w-[180px]' },
]

const roleBadge = {
  Mentor: 'bg-[#e3f2fd] text-[#1565c0]',
  Judge: 'bg-[#f3e5f5] text-[#7b1fa2]',
}

export default function LecturerHackathonsPage() {
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.values(filters).some(v => v !== '')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.status) params.Status = filters.status
      if (filters.fromDate) params.FromDate = new Date(filters.fromDate).toISOString()
      if (filters.toDate) params.ToDate = new Date(filters.toDate).toISOString()
      const result = await getLecturerEvents(params)
      setEvents(result.events || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load events.')
      setEvents([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [pageIndex, filters])

  useEffect(() => { fetchData() }, [fetchData])

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  const columns = [
    {
      key: 'name',
      header: 'Event',
      headerIcon: Trophy,
      render: (row) => (
        <Link to={`/lecture/hackathons/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'season',
      header: 'Season',
      render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.season || '—'}</span>,
    },
    {
      key: 'startTime',
      header: 'Start',
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime',
      header: 'End',
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge label={row.status} className={statusBadge[row.status] || ''} />,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <Link to={`/lecture/hackathons/${row.id}`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]">
          <Trophy className="h-3.5 w-3.5" /> View
        </Link>
      ),
    },
  ]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">My Hackathons</h1>
        <p className="mt-1 text-[14px] text-gray-500">Events where you are assigned as Mentor or Judge.</p>
      </div>

      <FilterBar filters={eventFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />

      {error && (
        <div className="mb-4 mt-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <div className="mt-5">
        <BaseTable
          columns={columns}
          data={events}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText={hasActive ? 'No events match the current filters.' : 'No events assigned to you yet.'}
          keyExtractor={(row) => row.id}
          minWidth="700px"
        />
      </div>
    </div>
  )
}
