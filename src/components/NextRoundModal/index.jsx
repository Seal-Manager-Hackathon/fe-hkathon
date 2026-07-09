import { useState, useEffect, useCallback, useRef } from 'react'
import { X, AlertCircle, TrendingUp, Users, Calendar, CircleCheck, ChevronLeft, ChevronDown, Search, Ban, FolderKanban, FileText, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import Badge from '../Badge'
import TrackSelectModal from '../TrackSelectModal'
import TopicSelectModal from '../TopicSelectModal'
import { formatDateTime } from '../../utils/format'
import { getEventRegisterTeams, assignRegisterTeamToNextRound, revertRegisterTeamToPreviousRound } from '../../api/admin'
import { toast, confirm } from '../../utils/toast'

const PAGE_SIZE = 5
const INITIAL_FILTERS = { keyword: '', status: '', isBanned: '', isDisable: '', trackId: '', topicId: '' }

const statusBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
}

// ── Picker button (same pattern as useSubmissionFilters) ──
function FilterPickButton({ icon: Icon, label, name, allLabel, onClick }) {
  return (
    <div className="relative w-full sm:w-[180px]">
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
      >
        <span className={name ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
          {name || allLabel}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
      </button>
    </div>
  )
}

export default function NextRoundModal({ open, onClose, eventId, roundId, roundName, roundNo }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [advancingIds, setAdvancingIds] = useState(new Set())
  const [revertingIds, setRevertingIds] = useState(new Set())

  // ── Display names for picker filters ──
  const [trackName, setTrackName] = useState('')
  const [topicName, setTopicName] = useState('')

  // ── Modal open states ──
  const [trackModalOpen, setTrackModalOpen] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)

  const hasActive = Object.values(filters).some((v) => v !== '')

  const doFetchRef = useRef()
  const doFetch = useCallback(async (pg, currentFilters) => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pg, PageSize: PAGE_SIZE }
      if (currentFilters.keyword) params.Keyword = currentFilters.keyword
      if (currentFilters.status) params.Status = currentFilters.status
      if (currentFilters.isBanned !== '') params.IsBanned = currentFilters.isBanned === 'true'
      if (currentFilters.isDisable !== '') params.IsDisable = currentFilters.isDisable === 'true'
      params.RoundId = roundId
      if (currentFilters.trackId) params.TrackId = currentFilters.trackId
      if (currentFilters.topicId) params.TopicId = currentFilters.topicId
      const result = await getEventRegisterTeams(eventId, params)
      setItems(result.registerTeams || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load register teams.')
      setItems([]); setTotal(0)
    } finally { setLoading(false) }
  }, [eventId, roundId])
  doFetchRef.current = doFetch

  useEffect(() => {
    if (open) {
      setPage(1); setFilters(INITIAL_FILTERS)
      setTrackName(''); setTopicName('')
      doFetchRef.current(1, INITIAL_FILTERS)
      setAdvancingIds(new Set()); setRevertingIds(new Set())
    }
  }, [open])

  useEffect(() => { if (open) doFetch(page, filters) }, [open, page, filters, doFetch])

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'trackId') { next.topicId = ''; setTopicName('') }
      return next
    })
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS); setTrackName(''); setTopicName(''); setPage(1)
  }, [])

  async function handleAdvance(row) {
    const ok = await confirm('Advance Team', `Move "${row.teamName}" from Round ${roundNo} to the next round?`)
    if (!ok) return
    setAdvancingIds((prev) => { const next = new Set(prev); next.add(row.id); return next })
    try {
      const result = await assignRegisterTeamToNextRound(row.id)
      toast.success(`"${row.teamName}" advanced to ${result.data.roundName}`)
      doFetchRef.current(page, filters)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to advance team.')
    } finally {
      setAdvancingIds((prev) => { const next = new Set(prev); next.delete(row.id); return next })
    }
  }

  async function handleRevert(row) {
    const ok = await confirm('Revert Team', `Move "${row.teamName}" from Round ${roundNo} back to the previous round?`)
    if (!ok) return
    setRevertingIds((prev) => { const next = new Set(prev); next.add(row.id); return next })
    try {
      const result = await revertRegisterTeamToPreviousRound(row.id)
      toast.success(`"${row.teamName}" reverted to ${result.data.roundName}`)
      doFetchRef.current(page, filters)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to revert team.')
    } finally {
      setRevertingIds((prev) => { const next = new Set(prev); next.delete(row.id); return next })
    }
  }

  // ── Filter bar uses a mix of built-in selects + custom picker buttons ──
  const filterConfigs = [
    { type: 'search', key: 'keyword', label: 'Team Name', icon: Search, placeholder: 'Search team name...' },
    { type: 'select', key: 'status', label: 'Status', icon: CircleCheck, options: [{ value: '', label: 'All' }, { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }] },
    { type: 'select', key: 'isBanned', label: 'Banned', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
    { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
    {
      type: 'custom', key: 'trackPicker',
      render: () => (
        <FilterPickButton icon={FolderKanban} label="Track" allLabel="All Tracks"
          name={filters.trackId ? trackName : ''}
          onClick={() => setTrackModalOpen(true)} />
      ),
    },
    {
      type: 'custom', key: 'topicPicker',
      render: () => (
        <FilterPickButton icon={FileText} label="Topic" allLabel="All Topics"
          name={filters.topicId ? topicName : ''}
          onClick={() => setTopicModalOpen(true)} />
      ),
    },
  ]

  if (!open) return null

  const columns = [
    {
      key: 'teamName', header: 'Team', headerIcon: Users,
      render: (row) => (
        <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.teamName || '—'}
        </Link>
      ),
    },
    {
      key: 'trackName', header: 'Track', headerIcon: FileText,
      render: (row) => (
        row.trackId
          ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackName || '—'}</Link>
          : <span className="text-[13px] text-gray-400">—</span>
      ),
    },
    {
      key: 'topicTitle', header: 'Topic', headerIcon: FileText,
      render: (row) => (
        row.topicId && row.trackId
          ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}/topics`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.topicTitle || '—'}</Link>
          : <span className="text-[13px] text-gray-400">—</span>
      ),
    },
    {
      key: 'isBanned', header: 'Banned', headerIcon: Ban,
      render: (row) => (
        row.isBanned
          ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" />
          : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />
      ),
    },
    {
      key: 'status', header: 'Status', headerIcon: CircleCheck,
      render: (row) => <Badge label={row.status} className={statusBadge[row.status] || 'bg-gray-50 text-gray-600'} />,
    },
    {
      key: 'createdAt', header: 'Created', headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions', header: 'Actions', headerIcon: TrendingUp, headerClassName: 'text-right', className: 'text-right',
      render: (row) => {
        const advancing = advancingIds.has(row.id)
        const reverting = revertingIds.has(row.id)
        const busy = advancing || reverting
        return (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/admin/register-teams/${row.id}`}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]"
            >
              <Eye className="h-3.5 w-3.5" />View
            </Link>
            <button onClick={() => handleRevert(row)} disabled={busy}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fff3e0] px-3 py-1.5 text-[13px] font-semibold text-[#e65100] transition-colors hover:bg-[#ffe0b2] disabled:opacity-50"
            >
              {reverting ? (<><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#e65100] border-t-transparent" />Reverting...</>) : (<><ChevronLeft className="h-3.5 w-3.5" />Revert</>)}
            </button>
            <button onClick={() => handleAdvance(row)} disabled={busy}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] disabled:opacity-50"
            >
              {advancing ? (<><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2e7d32] border-t-transparent" />Advancing...</>) : (<>Advance<TrendingUp className="h-3.5 w-3.5" /></>)}
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
        <div className="relative z-10 flex max-h-[88vh] w-full max-w-[95%] sm:max-w-[1100px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
          {/* ── Header ── */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
                <TrendingUp className="h-4 w-4 text-[#2e7d32]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">Round Team Flow</h3>
              <span className="mx-0.5 text-gray-300">·</span>
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#f0f7ff] px-3 py-1 text-[13px] font-semibold text-[#1565c0]">{roundName} (Round {roundNo})</span>
            </div>
            <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Filter Bar ── */}
          <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <FilterBar filters={filterConfigs} values={filters} onChange={setFilter} onReset={resetFilters} hasActive={hasActive} />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
            </div>
          )}

          {/* ── Table ── */}
          <div className="flex-1 min-h-0 overflow-auto">
            <BaseTable
              borderless
              columns={columns}
              data={items}
              page={page}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
              loading={loading}
              serverSide
              emptyText={hasActive ? 'No teams match the current filters for this round.' : `No register teams found in ${roundName}.`}
              keyExtractor={(row) => row.id}
              minWidth="900px"
            />
          </div>
        </div>
      </div>

      {/* ── Picker Modals ── */}
      <TrackSelectModal
        open={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        eventId={eventId}
        selectedTrackId={filters.trackId}
        onSelect={(id, name) => {
          setFilter('trackId', id)
          setTrackName(name)
        }}
      />
      <TopicSelectModal
        open={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        trackId={filters.trackId}
        selectedTopicId={filters.topicId}
        onSelect={(id, name) => {
          setFilter('topicId', id)
          setTopicName(name)
        }}
      />
    </>
  )
}
