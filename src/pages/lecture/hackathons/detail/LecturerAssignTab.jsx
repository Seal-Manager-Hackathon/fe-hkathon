import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Shield, User, GraduationCap, CircleCheck, UserCheck } from 'lucide-react'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import Avatar from '../../../../components/Avatar'
import { getLecturerEventAssign } from '../../../../api/lecturer'
import { Link } from 'react-router-dom'

const PAGE_SIZE = 10

const roleBadge = {
  Mentor: 'bg-[#e3f2fd] text-[#1565c0] border border-blue-200',
  Judge: 'bg-[#f3e5f5] text-[#6a1b9a] border border-purple-200',
  Staff: 'bg-[#fff3e0] text-[#e65100] border border-orange-200',
}

const SUB_TABS = [
  { key: 'assigned', label: 'Assigned', icon: <UserCheck className="h-4 w-4" /> },
]

const INITIAL_FILTERS = { keyword: '', eventRole: '' }

const assignFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by name or email...' },
  { type: 'select', key: 'eventRole', label: 'Role', icon: Shield, options: [
    { value: '', label: 'All' },
    { value: 'Mentor', label: 'Mentor' },
    { value: 'Judge', label: 'Judge' },
  ]},
]

function AssignedPanel({ eventId }) {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const active = Object.values(filters).some((v) => v !== '')

  const prevFiltersRef = useRef(filters)
  useEffect(() => {
    const prev = prevFiltersRef.current
    if (prev.keyword !== filters.keyword || prev.eventRole !== filters.eventRole) {
      setPageIndex(1)
    }
    prevFiltersRef.current = filters
  }, [filters])

  const fetchAssign = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.eventRole) params.EventRole = filters.eventRole
      const result = await getLecturerEventAssign(eventId, params)
      setItems(result.items || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load assignments.')
      setItems([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchAssign() }, [fetchAssign])

  const columns = [
    { key: 'user', header: 'User', headerIcon: User, render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p>
          <p className="text-[12px] text-[#1f2f3a]">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'tracks', header: 'Tracks', headerIcon: GraduationCap, render: (row) => {
      const tracks = row.assignTracks || []
      if (tracks.length === 0) return <span className="text-[13px] text-gray-400">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {tracks.map((t) => (
            <span key={t.trackId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${t.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#f5f5f5] text-[#064f5d]'}`}>
              <Link to={`/lecture/tracks/${t.trackId}`} className="hover:underline">{t.title}</Link>
            </span>
          ))}
        </div>
      )
    }},
    { key: 'eventRole', header: 'Role', headerIcon: Shield, render: (row) => (
      <Badge label={row.eventRole || '—'} className={roleBadge[row.eventRole] || 'bg-[#f5f5f5] text-[#757575]'} />
    )},
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => (
      row.isDisable
        ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
    )},
  ]

  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
      <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
        <FilterBar
          filters={assignFilters}
          values={filters}
          onChange={(key, val) => setFilters((p) => ({ ...p, [key]: val }))}
          onReset={() => setFilters(INITIAL_FILTERS)}
          hasActive={active}
        />
      </div>

      {error && (
        <div className="mx-5 mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <BaseTable
        borderless
        columns={columns}
        data={items}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={active ? 'No results match.' : 'No users assigned to this event yet.'}
        keyExtractor={(row) => row.assignEventId}
        minWidth="800px"
      />
    </div>
  )
}

export default function LecturerAssignTab({ eventId }) {
  const [subTab, setSubTab] = useState('assigned')

  return (
    <div>
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              subTab === t.key ? 'border-b-2 border-[#064f5d] text-[#064f5d]' : 'text-gray-400 hover:text-[#1f2f3a]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {subTab === 'assigned' && <AssignedPanel eventId={eventId} />}
    </div>
  )
}
