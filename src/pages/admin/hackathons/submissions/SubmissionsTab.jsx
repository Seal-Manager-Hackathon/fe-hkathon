import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import RoundSelectModal from '../../../../components/RoundSelectModal'
import { getEventSubmissions, getRounds, getTracks, getTopics } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import { Search, Users, Layers, FolderKanban, FileText, Eye, Send, MoreHorizontal, User, ChevronDown, RotateCcw } from 'lucide-react'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', roundId: '', trackId: '', topicId: '' }
const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

const selectClasses = 'w-full cursor-pointer appearance-none rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-10 text-[14px] text-[#1f2f3a] outline-none transition-colors focus:border-[#064f5d]'
const labelClasses = 'mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400'

export default function SubmissionsTab({ eventId }) {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const [rounds, setRounds] = useState([])
  const [tracks, setTracks] = useState([])
  const [topics, setTopics] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const [roundModalOpen, setRoundModalOpen] = useState(false)
  const [selectedRoundName, setSelectedRoundName] = useState('')

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true)
    try {
      const [roundsRes, tracksRes] = await Promise.all([
        getRounds(eventId, { PageSize: 5 }),
        getTracks(eventId, { PageSize: 999 }),
      ])
      setRounds(roundsRes.rounds || [])
      setTracks(tracksRes.tracks || [])
      // Set initial name if there's a selected round
      const found = roundsRes.rounds?.find(r => r.id === filters.roundId)
      if (found) setSelectedRoundName(found.name)
    } catch { setRounds([]); setTracks([]) }
    finally { setLoadingOptions(false) }
  }, [eventId])

  useEffect(() => { loadOptions() }, [loadOptions])

  useEffect(() => {
    if (!filters.trackId) { setTopics([]); return }
    let cancelled = false
    async function load() {
      try {
        const res = await getTopics(filters.trackId, { PageSize: 999 })
        if (!cancelled) setTopics(res.topics || [])
      } catch { if (!cancelled) setTopics([]) }
    }
    load()
    return () => { cancelled = true }
  }, [filters.trackId])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.keyword = filters.keyword
      if (filters.roundId) params.roundId = filters.roundId
      if (filters.trackId) params.trackId = filters.trackId
      if (filters.topicId) params.topicId = filters.topicId
      const result = await getEventSubmissions(eventId, params)
      setItems(result.items || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load submissions.')
      setItems([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  function handleFilterChange(key, value) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'trackId') next.topicId = ''
      return next
    })
    setPageIndex(1)
  }
  function handleReset() { setFilters(DEFAULT_VALUES); setSelectedRoundName(''); setPageIndex(1) }

  const columns = [
    { key: 'teamName', header: 'Team', headerIcon: Users, render: (row) => (
      <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName || '—'}</Link>
    )},
    { key: 'roundName', header: 'Round', headerIcon: Layers, render: (row) => (
      row.roundId
        ? <Link to={`/admin/hackathons/${eventId}?tab=Rounds`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.roundName || '—'}</Link>
        : <span className="text-[13px] text-gray-400">—</span>
    )},
    { key: 'trackTitle', header: 'Track', headerIcon: FolderKanban, render: (row) => (
      row.trackId
        ? <Link to={`/admin/hackathons/${eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackTitle || '—'}</Link>
        : <span className="text-[13px] text-gray-400">—</span>
    )},
    { key: 'topicTitle', header: 'Topic', headerIcon: FileText, render: (row) => (
      row.topicId
        ? <span className="text-[13px] text-gray-500">{row.topicTitle || '—'}</span>
        : <span className="text-[13px] text-gray-400">—</span>
    )},
    { key: 'submittedBy', header: 'Submitted By', headerIcon: User, render: (row) => (
      row.submittedBy
        ? <Link to={`/admin/users/${row.submittedBy.userId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.submittedBy.firstName} {row.submittedBy.lastName}</Link>
        : <span className="text-[13px] text-gray-400">—</span>
    )},
    { key: 'lastSubmission', header: 'Last Submission', headerIcon: Send, render: (row) => {
      const sub = row.lastSubmission
      if (!sub) return <span className="text-[13px] text-gray-400">—</span>
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-[#1f2f3a]">{formatDateTime(sub.submittedAt)}</span>
          <span className="text-[12px] text-gray-400">{sub.status}</span>
        </div>
      )
    }},
    { key: 'submissions', header: 'Submissions', headerIcon: FileText, render: (row) => (
      <span className="text-[13px] font-semibold text-[#064f5d]">{row.records?.length || 0}</span>
    )},
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <Link to={`/admin/hackathons/${eventId}/register-teams/${row.registerTeamId}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />Detail</Link>
      </div>
    )},
  ]

  return (
    <>
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-[260px]">
              <label className={labelClasses}>
                <Search className="h-3 w-3" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full rounded-lg border border-[#d8e0e6] py-2.5 pl-10 pr-4 text-[14px] text-[#1f2f3a] placeholder-gray-400 outline-none transition-colors focus:border-[#064f5d]"
                  placeholder="Search team name..."
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>
            </div>

            {/* Round button */}
            <div className="relative w-full sm:w-[200px]">
              <label className={labelClasses}>
                <Layers className="h-3 w-3" />
                Round
              </label>
              <button
                onClick={() => setRoundModalOpen(true)}
                className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
              >
                <span className={filters.roundId ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
                  {filters.roundId ? (selectedRoundName || '—') : 'All Rounds'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
              </button>
            </div>

            {/* Track */}
            <div className="relative w-full sm:w-[160px]">
              <label className={labelClasses}>
                <FolderKanban className="h-3 w-3" />
                Track
              </label>
              <div className="relative">
                <select
                  value={filters.trackId || ''}
                  onChange={(e) => handleFilterChange('trackId', e.target.value)}
                  className={selectClasses}
                >
                  <option value="">All</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Topic */}
            <div className="relative w-full sm:w-[160px]">
              <label className={labelClasses}>
                <FileText className="h-3 w-3" />
                Topic
              </label>
              <div className="relative">
                <select
                  value={filters.topicId || ''}
                  onChange={(e) => handleFilterChange('topicId', e.target.value)}
                  className={selectClasses}
                >
                  <option value="">All</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={!hasActive}
              className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
        <BaseTable
          borderless
          columns={columns}
          data={items}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading || loadingOptions}
          serverSide
          emptyText={hasActive ? 'No submissions match the current filters.' : 'No submissions found for this event.'}
          keyExtractor={(row) => row.registerTeamId + '-' + row.roundId}
          minWidth="900px"
        />
      </div>

      <RoundSelectModal
        open={roundModalOpen}
        onClose={() => setRoundModalOpen(false)}
        eventId={eventId}
        selectedRoundId={filters.roundId}
        onSelect={(roundId, roundName) => {
          handleFilterChange('roundId', roundId)
          setSelectedRoundName(roundName)
        }}
      />
    </>
  )
}
