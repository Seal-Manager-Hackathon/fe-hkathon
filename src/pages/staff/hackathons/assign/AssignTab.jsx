import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Avatar from '../../../../components/Avatar'
import { getAssignedUsers, restoreAssign, removeTrackFromAssign, restoreTrackToAssign } from '../../../../api/staff'
import { toast, confirm } from '../../../../utils/toast'
import { Search, User, Shield, GraduationCap, MoreHorizontal, UserCheck, ClipboardList, Eye, Phone, X, Ban, RotateCcw, CircleCheck } from 'lucide-react'

const PAGE_SIZE = 10

const roleBadge = {
  Mentor: 'bg-[#e3f2fd] text-[#1565c0] border border-blue-200',
  Judge: 'bg-[#f3e5f5] text-[#6a1b9a] border border-purple-200',
  Staff: 'bg-[#fff3e0] text-[#e65100] border border-orange-200',
}

const roleIcon = {
  Mentor: <UserCheck className="h-3.5 w-3.5" />,
  Judge: <ClipboardList className="h-3.5 w-3.5" />,
  Staff: <User className="h-3.5 w-3.5" />,
}

const assignedFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by name or email...' },
  { type: 'select', key: 'eventRole', label: 'Role', icon: Shield, options: [{ value: '', label: 'All' }, { value: 'Mentor', label: 'Mentor' }, { value: 'Judge', label: 'Judge' }, { value: 'Staff', label: 'Staff' }] },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'
const restoreBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9] w-[92px]'

function assignedColumns(handleRestore, handleRemoveTrack, handleRestoreTrack) {
  return [
    { key: 'user', header: 'User', headerIcon: User, render: (row) => (
      <Link to={`/staff/users/${row.userId}`} className="flex items-center gap-3 hover:opacity-80">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.firstName} {row.lastName}</p>
          <p className="text-[12px] text-[#1f2f3a]">{row.email}</p>
        </div>
      </Link>
    )},
    { key: 'phone', header: 'Phone', headerIcon: Phone, render: (row) => <span className="text-[13px] font-medium text-[#1f2f3a]">{row.phoneNumber || '—'}</span> },
    { key: 'tracks', header: 'Tracks', headerIcon: GraduationCap, render: (row) => {
      const tracks = row.assignTracks || []
      if (tracks.length === 0) return <span className="text-[13px] text-gray-400">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {tracks.map((t) => (
            <span key={t.trackId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${t.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#f5f5f5] text-[#064f5d]'}`}>
              <Link to={`/staff/tracks/${t.trackId}`} className="hover:underline">{t.title}</Link>
              {t.isDisable ? (
                <button onClick={() => handleRestoreTrack(row.assignEventId, t.trackId)} className="ml-0.5 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#e8f5e9] p-0.5 text-[#2e7d32] hover:bg-[#c8e6c9]" title="Restore track">
                  <RotateCcw className="h-3 w-3" />
                </button>
              ) : (
                <button onClick={() => handleRemoveTrack(row.assignEventId, t.trackId)} className="ml-0.5 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#fce4ec] p-0.5 text-[#c62828] hover:bg-[#ffcdd2]" title="Remove track">
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )
    }},
    { key: 'eventRole', header: 'Role', headerIcon: Shield, render: (row) => (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${roleBadge[row.eventRole] || ''}`}>
        {roleIcon[row.eventRole]} {row.eventRole}
      </span>
    )},
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => (
      row.isDisable
        ? <span className="inline-flex rounded-full bg-[#fce4ec] px-2.5 py-0.5 text-[12px] font-semibold text-[#c62828]">Deleted</span>
        : <span className="inline-flex rounded-full bg-[#e8f5e9] px-2.5 py-0.5 text-[12px] font-semibold text-[#2e7d32]">Active</span>
    )},
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <Link to={`/staff/users/${row.userId}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
        {row.isDisable && row.eventRole !== 'Staff' && (
          <button onClick={() => handleRestore(row)} className={restoreBtnClass}><RotateCcw className="h-3.5 w-3.5" />Restore</button>
        )}
      </div>
    )},
  ]
}

const SUB_TABS = [
  { key: 'assigned', label: 'Assigned', icon: <UserCheck className="h-4 w-4" /> },
]

export default function AssignTab({ eventId }) {
  const [subTab, setSubTab] = useState('assigned')

  // Assigned
  const [assigned, setAssigned] = useState([])
  const [assignedTotal, setAssignedTotal] = useState(0)
  const [assignedPage, setAssignedPage] = useState(1)
  const [assignedLoading, setAssignedLoading] = useState(false)
  const [asFilters, setAsFilters] = useState({ keyword: '', eventRole: '', isDisable: '' })
  const asHasActive = Object.values(asFilters).some(v => v !== '')

  const fetchAssigned = useCallback(async () => {
    setAssignedLoading(true)
    try {
      const params = { PageIndex: assignedPage, PageSize: PAGE_SIZE }
      if (asFilters.keyword) params.Keyword = asFilters.keyword
      if (asFilters.eventRole) params.EventRole = asFilters.eventRole
      if (asFilters.isDisable !== '') params.IsDisable = asFilters.isDisable === 'true'
      const result = await getAssignedUsers(eventId, params)
      setAssigned(result.items || [])
      setAssignedTotal(result.totalCount || 0)
    } catch (err) { setAssigned([]); setAssignedTotal(0) }
    finally { setAssignedLoading(false) }
  }, [eventId, assignedPage, asFilters])

  useEffect(() => { fetchAssigned() }, [fetchAssigned])

  async function handleRestore(row) {
    const ok = await confirm('Restore Assignment', `Restore ${row.firstName} ${row.lastName} (${row.eventRole}) to this event?`)
    if (!ok) return
    try {
      await restoreAssign(row.assignEventId)
      toast.success('Assignment restored successfully')
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore assignment.')
    }
  }

  async function handleRemoveTrack(assignEventId, trackId) {
    const ok = await confirm('Remove Track', 'Remove this track from the assignment?')
    if (!ok) return
    try {
      await removeTrackFromAssign(assignEventId, trackId)
      toast.success('Track removed from assignment')
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove track.')
    }
  }

  async function handleRestoreTrack(assignEventId, trackId) {
    const ok = await confirm('Restore Track', 'Restore this track to the assignment?')
    if (!ok) return
    try {
      await restoreTrackToAssign(assignEventId, trackId)
      toast.success('Track restored to assignment')
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore track.')
    }
  }

  function handleAsFilterChange(key, value) { setAsFilters(prev => ({ ...prev, [key]: value })); setAssignedPage(1) }
  function handleAsReset() { setAsFilters({ keyword: '', eventRole: '', isDisable: '' }); setAssignedPage(1) }

  return (
    <div>
      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
        {SUB_TABS.map((t) => (
          <button key={t.key} onClick={() => setSubTab(t.key)} className={`cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors ${subTab === t.key ? 'border-b-2 border-[#064f5d] text-[#064f5d]' : 'text-gray-400 hover:text-[#1f2f3a]'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {subTab === 'assigned' && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <FilterBar filters={assignedFilters} values={asFilters} onChange={handleAsFilterChange} onReset={handleAsReset} hasActive={asHasActive} />
          </div>
          <BaseTable borderless columns={assignedColumns(handleRestore, handleRemoveTrack, handleRestoreTrack)} data={assigned} page={assignedPage} pageSize={PAGE_SIZE} total={assignedTotal} onPageChange={setAssignedPage} loading={assignedLoading} serverSide emptyText={asHasActive ? 'No results match.' : 'No users assigned to this event yet.'} keyExtractor={(row) => row.assignEventId} minWidth="950px" />
        </div>
      )}
    </div>
  )
}
