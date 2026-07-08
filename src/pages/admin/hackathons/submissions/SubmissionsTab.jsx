import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import RoundSelectModal from '../../../../components/RoundSelectModal'
import { getEventSubmissions, getRounds, getTracks, getTopics } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import { Search, Users, Layers, FolderKanban, FileText, Eye, Send, MoreHorizontal, User, ChevronDown } from 'lucide-react'

// ── Constants ──
const PAGE_SIZE = 10
const INITIAL_FILTERS = { keyword: '', roundId: '', trackId: '', topicId: '' }

// ── Helpers ──
const hasActiveFilters = (f) => Object.values(f).some((v) => v !== '')
const buildQuery = (filters, page) => {
  const p = { PageIndex: page, PageSize: PAGE_SIZE }
  if (filters.keyword) p.keyword = filters.keyword
  if (filters.roundId)  p.roundId = filters.roundId
  if (filters.trackId)  p.trackId = filters.trackId
  if (filters.topicId)  p.topicId = filters.topicId
  return p
}

// ── Styles ──
const S = {
  viewBtn: 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]',
  roundBtn: 'group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none',
}

// ── Sub-components ──
function RoundPickerButton({ name, onClick }) {
  return (
    <div className="relative w-full sm:w-[200px]">
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <Layers className="h-3 w-3" /> Round
      </label>
      <button type="button" onClick={onClick} className={S.roundBtn}>
        <span className={name ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
          {name || 'All Rounds'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
      </button>
    </div>
  )
}

// ── Table columns ──
function useSubmissionColumns(eventId) {
  return useMemo(() => [
    {
      key: 'teamName', header: 'Team', headerIcon: Users,
      render: (row) => <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName || '—'}</Link>,
    },
    {
      key: 'roundName', header: 'Round', headerIcon: Layers,
      render: (row) => row.roundId
        ? <Link to={`/admin/hackathons/${eventId}?tab=Rounds`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.roundName || '—'}</Link>
        : <span className="text-[13px] text-gray-400">—</span>,
    },
    {
      key: 'trackTitle', header: 'Track', headerIcon: FolderKanban,
      render: (row) => row.trackId
        ? <Link to={`/admin/hackathons/${eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackTitle || '—'}</Link>
        : <span className="text-[13px] text-gray-400">—</span>,
    },
    {
      key: 'topicTitle', header: 'Topic', headerIcon: FileText,
      render: (row) => row.topicId
        ? <span className="text-[13px] text-gray-500">{row.topicTitle || '—'}</span>
        : <span className="text-[13px] text-gray-400">—</span>,
    },
    {
      key: 'submittedBy', header: 'Submitted By', headerIcon: User,
      render: (row) => row.submittedBy
        ? <Link to={`/admin/users/${row.submittedBy.userId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.submittedBy.firstName} {row.submittedBy.lastName}</Link>
        : <span className="text-[13px] text-gray-400">—</span>,
    },
    {
      key: 'lastSubmission', header: 'Last Submission', headerIcon: Send,
      render: (row) => {
        const s = row.lastSubmission
        if (!s) return <span className="text-[13px] text-gray-400">—</span>
        return <div className="flex flex-col gap-0.5"><span className="text-[13px] font-medium text-[#1f2f3a]">{formatDateTime(s.submittedAt)}</span><span className="text-[12px] text-gray-400">{s.status}</span></div>
      },
    },
    {
      key: 'submissions', header: 'Submissions', headerIcon: FileText,
      render: (row) => <span className="text-[13px] font-semibold text-[#064f5d]">{row.records?.length || 0}</span>,
    },
    {
      key: 'actions', header: 'Actions', headerIcon: MoreHorizontal,
      headerClassName: 'text-right', className: 'text-right',
      render: (row) => <div className="flex items-center justify-end gap-2"><Link to={`/admin/hackathons/${eventId}/register-teams/${row.registerTeamId}`} className={S.viewBtn}><Eye className="h-3.5 w-3.5" />Detail</Link></div>,
    },
  ], [eventId])
}

// ── MAIN ──
export default function SubmissionsTab({ eventId }) {
  // ── Filter state ──
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS })
  const [roundName, setRoundName] = useState('')
  const active = hasActiveFilters(filters)

  // ── Dropdown options ──
  const [tracks, setTracks] = useState([])
  const [topics, setTopics] = useState([])
  const [loadingOpts, setLoadingOpts] = useState(false)

  // ── Round modal ──
  const [roundModalOpen, setRoundModalOpen] = useState(false)

  // ── Submissions data ──
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load tracks & topics
  useEffect(() => {
    let c = false
    setLoadingOpts(true)
    Promise.all([
      getRounds(eventId, { PageSize: 5 }),
      getTracks(eventId, { PageSize: 999 }),
    ])
      .then(([, tr]) => { if (!c) setTracks(tr.tracks || []) })
      .catch(() => { if (!c) setTracks([]) })
      .finally(() => { if (!c) setLoadingOpts(false) })
    return () => { c = true }
  }, [eventId])

  // Load topics when track changes
  useEffect(() => {
    if (!filters.trackId) { setTopics([]); return }
    let c = false
    getTopics(filters.trackId, { PageSize: 999 })
      .then((r) => { if (!c) setTopics(r.topics || []) })
      .catch(() => { if (!c) setTopics([]) })
    return () => { c = true }
  }, [filters.trackId])

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const result = await getEventSubmissions(eventId, buildQuery(filters, page))
      setItems(result.items || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load submissions.')
      setItems([]); setTotal(0)
    } finally { setLoading(false) }
  }, [eventId, page, filters])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  // ── Handlers ──
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'trackId') next.topicId = ''
      return next
    })
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS })
    setRoundName('')
    setPage(1)
  }, [])

  const handleRoundSelect = useCallback((roundId, name) => {
    setFilters((prev) => ({ ...prev, roundId }))
    setRoundName(name)
    setPage(1)
  }, [])

  // ── Derived configs ──
  const filterConfigs = useMemo(() => [
    { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search team name...' },
    { type: 'select', key: 'trackId', label: 'Track', icon: FolderKanban,
      options: [{ value: '', label: 'All' }, ...tracks.map((t) => ({ value: t.id, label: t.title }))] },
    { type: 'select', key: 'topicId', label: 'Topic', icon: FileText,
      options: [{ value: '', label: 'All' }, ...topics.map((t) => ({ value: t.id, label: t.title }))] },
  ], [tracks, topics])

  const columns = useSubmissionColumns(eventId)

  // ── Render ──
  return (
    <>
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar
            filters={filterConfigs}
            values={filters}
            onChange={setFilter}
            onReset={resetFilters}
            hasActive={active}
          >
            <RoundPickerButton
              name={filters.roundId ? roundName : ''}
              onClick={() => setRoundModalOpen(true)}
            />
          </FilterBar>
        </div>

        <BaseTable
          borderless
          columns={columns}
          data={items}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          loading={loading || loadingOpts}
          serverSide
          emptyText={active ? 'No submissions match the current filters.' : 'No submissions found for this event.'}
          keyExtractor={(row) => row.registerTeamId + '-' + row.roundId}
          minWidth="900px"
        />
      </div>

      <RoundSelectModal
        open={roundModalOpen}
        onClose={() => setRoundModalOpen(false)}
        eventId={eventId}
        selectedRoundId={filters.roundId}
        onSelect={handleRoundSelect}
      />
    </>
  )
}
