import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import TrackSelectModal from '../../../../components/TrackSelectModal'
import TopicSelectModal from '../../../../components/TopicSelectModal'
import { getEventRegisterTeams, approveRegisterTeam, rejectRegisterTeam, banRegisterTeam, unbanRegisterTeam, assignTrackTopicToRegisterTeam, removeTrackTopicFromRegisterTeam } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import { toast, confirm } from '../../../../utils/toast'
import PromptReason from '../../../../components/PromptReason'
import { Search, Ban, Users, Eye, FileText, Trophy, Calendar, MoreHorizontal, CircleCheck, CheckCircle, XCircle, ShieldOff, Edit3, FolderKanban } from 'lucide-react'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', status: '', isBanned: '', isDisable: '' }

const statusBadge = { Pending: 'bg-amber-50 text-amber-700 border border-amber-200', Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Rejected: 'bg-rose-50 text-rose-700 border border-rose-200' }

const regFilters = [
  { type: 'search', key: 'keyword', label: 'Team Name', icon: Search, placeholder: 'Search team name...' },
  { type: 'select', key: 'status', label: 'Status', icon: CircleCheck, options: [{ value: '', label: 'All' }, { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }] },
  { type: 'select', key: 'isBanned', label: 'Banned', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

export default function RegisterTeamsTab({ eventId }) {
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejecting, setRejecting] = useState(false)

  const [banTarget, setBanTarget] = useState(null)
  const [banning, setBanning] = useState(false)

  // Track/Topic assignment state
  const [assignTarget, setAssignTarget] = useState(null)
  const [assigning, setAssigning] = useState(false)
  const [trackModalOpen, setTrackModalOpen] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)
  const selectedTrackIdRef = useRef(null)

  const fetchTeams = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.status) params.Status = filters.status
      if (filters.isBanned !== '') params.IsBanned = filters.isBanned === 'true'
      if (filters.isDisable !== '') params.IsDisable = filters.isDisable === 'true'
      const result = await getEventRegisterTeams(eventId, params)
      setTeams(result.registerTeams || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load register teams.')
      setTeams([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  function handleFilterChange(key, value) { setFilters((prev) => ({ ...prev, [key]: value })); setPageIndex(1) }
  function handleReset() { setFilters(DEFAULT_VALUES); setPageIndex(1) }

  async function handleApprove(row) {
    const ok = await confirm('Approve Registration', `Approve "${row.teamName}" to join this event?`)
    if (!ok) return
    try { await approveRegisterTeam(row.id); toast.success('Registration approved'); fetchTeams() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to approve') }
  }

  function openReject(row) { setRejectTarget(row) }

  async function handleRejectSubmit(reason) {
    const target = rejectTarget
    setRejectTarget(null)
    if (!target) return
    setRejecting(true)
    try {
      await rejectRegisterTeam(target.id, { rejectionReason: reason || undefined })
      toast.success('Registration rejected')
      fetchTeams()
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to reject') }
    finally { setRejecting(false) }
  }

  function openBan(row) { setBanTarget(row) }

  async function handleBanSubmit(reason) {
    const target = banTarget
    setBanTarget(null)
    if (!target) return
    setBanning(true)
    try {
      await banRegisterTeam(target.id, { rejectionReason: reason || undefined })
      toast.success('Team banned from event')
      fetchTeams()
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to ban team') }
    finally { setBanning(false) }
  }

  async function handleUnban(row) {
    const ok = await confirm('Unban Register Team', `Unban "${row.teamName}" so they can participate again?`)
    if (!ok) return
    try { await unbanRegisterTeam(row.id); toast.success('Team unbanned from event'); fetchTeams() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to unban team') }
  }

  // ── Track/Topic assignment handlers ──
  function openAssign(row) {
    setAssignTarget(row)
    selectedTrackIdRef.current = null
    setTrackModalOpen(true)
  }

  function handleTrackSelect(trackId) {
    if (!trackId) {
      toast.error('Please select a track')
      return
    }
    selectedTrackIdRef.current = trackId
    setTrackModalOpen(false)
    setTopicModalOpen(true)
  }

  function handleTopicSelect(topicId) {
    setTopicModalOpen(false)
    doAssign(selectedTrackIdRef.current, topicId || undefined)
  }

  function handleTopicModalClose() {
    setTopicModalOpen(false)
    // If user already confirmed via handleTopicSelect, assignTarget was already cleared.
    // Only submit if user closed without selecting (Cancel / X).
    if (assignTarget) {
      doAssign(selectedTrackIdRef.current, undefined)
    }
  }

  function doAssign(trackId, topicId) {
    const target = assignTarget
    if (!target || !trackId) return
    setAssigning(true)
    setAssignTarget(null)
    selectedTrackIdRef.current = null
    assignTrackTopicToRegisterTeam(target.id, { trackId, ...(topicId && { topicId }) })
      .then(() => { toast.success('Track/Topic assigned successfully'); fetchTeams() })
      .catch((err) => { toast.error(err?.response?.data?.message || 'Failed to assign track/topic') })
      .finally(() => { setAssigning(false) })
  }

  async function handleRemoveAssign(row) {
    const ok = await confirm('Remove Track & Topic', `Remove track and topic assignment from "${row.teamName}"?`)
    if (!ok) return
    try {
      await removeTrackTopicFromRegisterTeam(row.id)
      toast.success('Track/Topic removed')
      fetchTeams()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove track/topic')
    }
  }

  const columns = [
    { key: 'teamName', header: 'Team', headerIcon: Users, render: (row) => <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName || '—'}</Link> },
    { key: 'trackName', header: 'Track', headerIcon: FileText, render: (row) => row.trackId ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackName || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span> },
    { key: 'topicTitle', header: 'Topic', headerIcon: FileText, render: (row) => row.topicId && row.trackId ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}/topics`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.topicTitle || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span> },
    { key: 'isBanned', header: 'Banned', headerIcon: Ban, render: (row) => row.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label={row.status} className={statusBadge[row.status] || 'bg-gray-50 text-gray-600'} /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p> },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        {row.status === 'Pending' && !row.isBanned && (<>
          <button onClick={() => handleApprove(row)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#e8f5e9] px-2.5 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9]"><CheckCircle className="h-3.5 w-3.5" />Approve</button>
          <button onClick={() => openReject(row)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#fce4ec] px-2.5 py-1.5 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2]"><XCircle className="h-3.5 w-3.5" />Reject</button>
        </>)}
        {/* Assign/Remove Track — only when Approved & not Banned */}
        {row.status === 'Approved' && !row.isBanned && (
          row.trackId
            ? <button onClick={() => handleRemoveAssign(row)} disabled={assigning} className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#fff3cd] px-2.5 py-1.5 text-[13px] font-semibold text-[#856404] hover:bg-[#ffe8a1] disabled:opacity-50 w-[185px]"><FolderKanban className="h-3.5 w-3.5 shrink-0" />{assigning && assignTarget?.id === row.id ? '...' : 'Remove Track & Topic'}</button>
            : <button onClick={() => openAssign(row)} disabled={assigning} className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#e0f2f1] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#b2dfdb] disabled:opacity-50 w-[185px]"><FolderKanban className="h-3.5 w-3.5 shrink-0" />Assign Track & Topic</button>
        )}
        {row.isBanned
          ? <button onClick={() => handleUnban(row)} className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#e8f5e9] px-2.5 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9] w-[92px]"><ShieldOff className="h-3.5 w-3.5" />Unban</button>
          : <button onClick={() => openBan(row)} className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#fce4ec] px-2.5 py-1.5 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2] w-[92px]"><ShieldOff className="h-3.5 w-3.5" />Ban</button>
        }
        <Link to={`/admin/register-teams/${row.id}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
        <Link to={`/admin/register-teams/${row.id}/edit`} className={viewBtnClass}><Edit3 className="h-3.5 w-3.5" />Edit</Link>
      </div>
    ) },
  ]

  return (<>
    {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
    <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
      <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
        <FilterBar filters={regFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
      </div>
      <BaseTable borderless columns={columns} data={teams} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No results match.' : 'No registered teams for this event.'} keyExtractor={(row) => row.id} minWidth="950px" />
    </div>

    {/* Track Select Modal */}
    <TrackSelectModal
      open={trackModalOpen}
      onClose={() => { setTrackModalOpen(false) }}
      eventId={eventId}
      selectedTrackId={assignTarget?.trackId || null}
      onSelect={handleTrackSelect}
    />

    {/* Topic Select Modal (appears after track is chosen) */}
    <TopicSelectModal
      open={topicModalOpen}
      onClose={handleTopicModalClose}
      trackId={selectedTrackIdRef.current}
      selectedTopicId={assignTarget?.topicId || null}
      onSelect={handleTopicSelect}
    />

    <PromptReason
      open={!!rejectTarget}
      onClose={() => { if (!rejecting) setRejectTarget(null) }}
      onSubmit={handleRejectSubmit}
      title="Reject Registration"
      description={`Reject "${rejectTarget?.teamName}" from this event.`}
      confirmText="Reject"
      placeholder="Why is this team being rejected?"
      submitting={rejecting}
      confirmVariant="danger"
    />

    <PromptReason
      open={!!banTarget}
      onClose={() => { if (!banning) setBanTarget(null) }}
      onSubmit={handleBanSubmit}
      title="Ban Team"
      description={`Ban "${banTarget?.teamName}" from participating in this event.`}
      confirmText="Ban"
      placeholder="Why is this team being banned?"
      submitting={banning}
      confirmVariant="danger"
    />
  </>)
}
