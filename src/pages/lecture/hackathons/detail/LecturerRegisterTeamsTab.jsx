import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, Ban, CircleCheck, Layers, Users, FileText, Calendar, Eye, ChevronDown, FolderKanban } from 'lucide-react'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import RoundSelectModal from '../../../../components/RoundSelectModal'
import TrackSelectModal from '../../../../components/TrackSelectModal'
import TopicSelectModal from '../../../../components/TopicSelectModal'
import { getLecturerRegisterTeams, getLecturerRounds, getLecturerMyTracks, getLecturerTopics } from '../../../../api/lecturer'
import { formatDateTime } from '../../../../utils/format'

const PAGE_SIZE = 10

const statusBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
}

const INITIAL_FILTERS = { keyword: '', status: '', isBanned: '', roundId: '', trackId: '', topicId: '' }

function hasActiveFilters(f) {
  return Object.values(f).some((v) => v !== '')
}

export default function LecturerRegisterTeamsTab({ eventId }) {
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [roundName, setRoundName] = useState('')
  const [trackName, setTrackName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [filterRoundModalOpen, setFilterRoundModalOpen] = useState(false)
  const [filterTrackModalOpen, setFilterTrackModalOpen] = useState(false)
  const [filterTopicModalOpen, setFilterTopicModalOpen] = useState(false)
  const active = hasActiveFilters(filters)

  const prevFiltersRef = useRef(filters)
  useEffect(() => {
    const prev = prevFiltersRef.current
    if (
      prev.keyword !== filters.keyword ||
      prev.status !== filters.status ||
      prev.isBanned !== filters.isBanned ||
      prev.roundId !== filters.roundId ||
      prev.trackId !== filters.trackId ||
      prev.topicId !== filters.topicId
    ) {
      setPageIndex(1)
    }
    prevFiltersRef.current = filters
  }, [filters])

  const fetchTeams = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.status) params.Status = filters.status
      if (filters.isBanned !== '') params.IsBanned = filters.isBanned === 'true'
      if (filters.roundId) params.RoundId = filters.roundId
      if (filters.trackId) params.TrackId = filters.trackId
      if (filters.topicId) params.TopicId = filters.topicId
      const result = await getLecturerRegisterTeams(eventId, params)
      setTeams(result.registerTeams || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load register teams.')
      setTeams([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  function setFilter(key, value) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'trackId') next.topicId = ''
      return next
    })
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
    setRoundName('')
    setTrackName('')
    setTopicName('')
  }

  function handleFilterSelect(key, nameSetter) {
    return (id, name) => {
      setFilter(key, id)
      nameSetter(name)
    }
  }

  const filterConfigs = [
    { type: 'search', key: 'keyword', label: 'Team Name', icon: Search, placeholder: 'Search team name...' },
    { type: 'select', key: 'status', label: 'Status', icon: CircleCheck, options: [
      { value: '', label: 'All' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ]},
    { type: 'select', key: 'isBanned', label: 'Banned', icon: Ban, options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ]},
    {
      type: 'custom',
      key: 'roundPicker',
      render: () => (
        <div key="round" className="relative w-full sm:w-[170px]">
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <Layers className="h-3 w-3" /> Round
          </label>
          <button
            type="button"
            onClick={() => setFilterRoundModalOpen(true)}
            className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
          >
            <span className={filters.roundId ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
              {filters.roundId ? roundName : 'All Rounds'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
          </button>
        </div>
      ),
    },
    {
      type: 'custom',
      key: 'trackPicker',
      render: () => (
        <div key="track" className="relative w-full sm:w-[170px]">
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <FolderKanban className="h-3 w-3" /> Track
          </label>
          <button
            type="button"
            onClick={() => setFilterTrackModalOpen(true)}
            className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
          >
            <span className={filters.trackId ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
              {filters.trackId ? trackName : 'All Tracks'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
          </button>
        </div>
      ),
    },
    {
      type: 'custom',
      key: 'topicPicker',
      render: () => (
        <div key="topic" className="relative w-full sm:w-[170px]">
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <FileText className="h-3 w-3" /> Topic
          </label>
          <button
            type="button"
            onClick={!filters.trackId ? undefined : () => setFilterTopicModalOpen(true)}
            className={`group flex w-full items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none ${!filters.trackId ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <span className={filters.topicId ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
              {filters.topicId ? topicName : (!filters.trackId ? 'Select Track First' : 'All Topics')}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
          </button>
        </div>
      ),
    },
  ]

  const viewBtnClass =
    'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

  const columns = [
    { key: 'teamName', header: 'Team', headerIcon: Users, render: (row) => (
      row.teamId
        ? <Link to={`/lecture/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName || '—'}</Link>
        : <Link to={`/lecture/register-teams/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName || '—'}</Link>
    )},
    { key: 'trackName', header: 'Track', headerIcon: FileText, render: (row) => row.trackId
      ? <Link to={`/lecture/tracks/${row.trackId}`} className="text-[13px] font-semibold text-[#064f5d] hover:underline">{row.trackName || '—'}</Link>
      : <span className="text-[13px] text-gray-400">—</span>
    },
    { key: 'topicTitle', header: 'Topic', headerIcon: FileText, render: (row) => row.topicId && row.trackId
      ? <Link to={`/lecture/tracks/${row.trackId}/topics`} className="text-[13px] font-semibold text-[#064f5d] hover:underline">{row.topicTitle || '—'}</Link>
      : <span className="text-[13px] text-gray-400">—</span>
    },
    { key: 'roundName', header: 'Round', headerIcon: Layers, render: (row) => row.roundId
      ? <Link to={`/lecture/rounds/${row.roundId}`} className="text-[13px] font-semibold text-[#064f5d] hover:underline">{row.roundName || '—'}</Link>
      : <span className="text-[13px] text-gray-400">—</span>
    },
    { key: 'isBanned', header: 'Banned', headerIcon: Ban, render: (row) => row.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label={row.status} className={statusBadge[row.status] || 'bg-gray-50 text-gray-600'} /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] font-semibold text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions', header: '', headerClassName: 'text-right', className: 'text-right',
      render: (row) => (
        <Link to={`/lecture/register-teams/${row.id}`} className={viewBtnClass}>
          <Eye className="h-3.5 w-3.5" /> View
        </Link>
      ),
    },
  ]

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar
            filters={filterConfigs}
            values={filters}
            onChange={setFilter}
            onReset={resetFilters}
            hasActive={active}
          />
        </div>
        <BaseTable
          borderless
          columns={columns}
          data={teams}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText={active ? 'No results match.' : 'No registered teams for this event.'}
          keyExtractor={(row) => row.id}
          minWidth="900px"
        />
      </div>

      <RoundSelectModal
        open={filterRoundModalOpen}
        onClose={() => setFilterRoundModalOpen(false)}
        eventId={eventId}
        selectedRoundId={filters.roundId}
        onSelect={handleFilterSelect('roundId', setRoundName)}
        fetchRounds={getLecturerRounds}
      />

      <TrackSelectModal
        open={filterTrackModalOpen}
        onClose={() => { setFilterTrackModalOpen(false) }}
        eventId={eventId}
        selectedTrackId={filters.trackId}
        fetchTracks={getLecturerMyTracks}
        onSelect={(id, name) => {
          handleFilterSelect('trackId', setTrackName)(id, name)
          if (id !== filters.trackId) {
            setFilter('topicId', '')
            setTopicName('')
          }
        }}
      />

      <TopicSelectModal
        open={filterTopicModalOpen}
        onClose={() => setFilterTopicModalOpen(false)}
        trackId={filters.trackId}
        selectedTopicId={filters.topicId}
        onSelect={handleFilterSelect('topicId', setTopicName)}
        fetchTopics={getLecturerTopics}
      />
    </>
  )
}
