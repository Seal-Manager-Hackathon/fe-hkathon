import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Avatar from '../../../../components/Avatar'
import { getAssignedUsers, getAvailableLecturers, getAvailableStaff, assignUserToEvent, removeAssign, restoreAssign, getTracks, assignTrackToEventAssign, removeTrackFromAssign, restoreTrackToAssign } from '../../../../api/staff'
import { toast, confirm } from '../../../../utils/toast'
import { Search, UserPlus, User, Shield, GraduationCap, MoreHorizontal, UserCheck, ClipboardList, Eye, Phone, X, FolderKanban, Ban, Trash2, RotateCcw, CircleCheck } from 'lucide-react'

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
const trackBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#ede7f6] px-2.5 py-1.5 text-[13px] font-semibold text-[#5e35b1] hover:bg-[#d1c4e9]'
const assignBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#e8f5e9] px-2.5 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9]'
const removeBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2] w-[92px]'
const restoreBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9] w-[92px]'

function assignedColumns(handleRemove, handleRestore, handleTrack, handleRemoveTrack, handleRestoreTrack) {
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
              <Link to={`/staff/hackathons/${t.eventId}/tracks/${t.trackId}`} className="hover:underline">{t.title}</Link>
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
        {!row.isDisable && (row.eventRole === 'Mentor' || row.eventRole === 'Judge') && (
          <button onClick={() => handleTrack(row)} className={trackBtnClass}><FolderKanban className="h-3.5 w-3.5" />Track</button>
        )}
        <Link to={`/staff/users/${row.userId}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
        {row.isDisable ? (
          <button onClick={() => handleRestore(row)} className={restoreBtnClass}><RotateCcw className="h-3.5 w-3.5" />Restore</button>
        ) : (
          <button onClick={() => handleRemove(row)} className={removeBtnClass}><Trash2 className="h-3.5 w-3.5" />Delete</button>
        )}
      </div>
    )},
  ]
}

const availFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by name or email...' },
]

function availableColumns(openAssignModal, assigning, label) {
  return [
    { key: 'user', header: label, headerIcon: User, render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p>
          <p className="text-[12px] text-[#1f2f3a]">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', header: 'Phone', headerIcon: Phone, render: (row) => <span className="text-[13px] font-medium text-[#1f2f3a]">{row.phoneNumber || '—'}</span> },
    { key: 'college', header: 'College', headerIcon: GraduationCap, render: (row) => <span className="text-[13px] font-medium text-[#1f2f3a]">{row.college || '—'}</span> },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => openAssignModal(row)} disabled={assigning} className={assignBtnClass}><UserPlus className="h-3.5 w-3.5" />Assign</button>
        <Link to={`/staff/users/${row.id}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
      </div>
    )},
  ]
}

const SUB_TABS = [
  { key: 'assigned', label: 'Assigned', icon: <UserCheck className="h-4 w-4" /> },
  { key: 'lecturers', label: 'Available Lecturers', icon: <GraduationCap className="h-4 w-4" /> },
  { key: 'staff', label: 'Available Staff', icon: <User className="h-4 w-4" /> },
]

// ---- Assign Role Modal ----
function AssignRoleModal({ open, user, userRole, onClose, onSubmit, submitting }) {
  if (!open) return null

  const isLecturer = userRole === 'lecturer'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={!submitting ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">Assign Role</h3>
            <p className="mt-1 text-[13px] text-[#1f2f3a]">
              Select a role for <span className="font-semibold text-[#1f2f3a]">{user?.firstName} {user?.lastName}</span>
            </p>
          </div>
          {!submitting && (
            <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          {isLecturer ? (
            <>
              <button disabled={submitting} onClick={() => onSubmit('Mentor')} className="flex-1 cursor-pointer rounded-xl border-2 border-[#e0e0e0] p-4 text-center transition-all hover:border-[#1565c0] hover:bg-[#e3f2fd] disabled:opacity-50">
                <UserCheck className="mx-auto mb-2 h-6 w-6 text-[#1565c0]" />
                <p className="text-[14px] font-bold text-[#1565c0]">Mentor</p>
                <p className="mt-1 text-[12px] text-gray-400">Guide and support teams</p>
              </button>
              <button disabled={submitting} onClick={() => onSubmit('Judge')} className="flex-1 cursor-pointer rounded-xl border-2 border-[#e0e0e0] p-4 text-center transition-all hover:border-[#6a1b9a] hover:bg-[#f3e5f5] disabled:opacity-50">
                <ClipboardList className="mx-auto mb-2 h-6 w-6 text-[#6a1b9a]" />
                <p className="text-[14px] font-bold text-[#6a1b9a]">Judge</p>
                <p className="mt-1 text-[12px] text-gray-400">Evaluate submissions</p>
              </button>
            </>
          ) : (
            <button disabled={submitting} onClick={() => onSubmit('Staff')} className="flex-1 cursor-pointer rounded-xl border-2 border-[#e0e0e0] p-4 text-center transition-all hover:border-[#e65100] hover:bg-[#fff3e0] disabled:opacity-50">
              <User className="mx-auto mb-2 h-6 w-6 text-[#e65100]" />
              <p className="text-[14px] font-bold text-[#e65100]">Staff</p>
              <p className="mt-1 text-[12px] text-gray-400">Event operations</p>
            </button>
          )}
        </div>

        {submitting && (
          <p className="mt-4 text-center text-[13px] text-gray-400">Assigning...</p>
        )}
      </div>
    </div>
  )
}

// ---- Track Select Modal ----
function AssignTrackModal({ open, user, eventId, onClose, onAssign, submitting }) {
  const [tracks, setTracks] = useState([])
  const [trackTotal, setTrackTotal] = useState(0)
  const [trackPage, setTrackPage] = useState(1)
  const [trackLoading, setTrackLoading] = useState(false)
  const [tkFilters, setTkFilters] = useState({ keyword: '', isDisable: 'false' })
  const tkHasActive = Object.values(tkFilters).some(v => v !== '')

  useEffect(() => {
    if (!open) { setTrackPage(1); return }
    let cancelled = false
    async function fetchTracks() {
      setTrackLoading(true)
      try {
        const params = { PageIndex: trackPage, PageSize: 10 }
        if (tkFilters.keyword) params.Keyword = tkFilters.keyword
        if (tkFilters.isDisable !== '') params.IsDisable = tkFilters.isDisable === 'true'
        const result = await getTracks(eventId, params)
        if (!cancelled) {
          setTracks(result.tracks || [])
          setTrackTotal(result.totalCount || 0)
        }
      } catch { if (!cancelled) { setTracks([]); setTrackTotal(0) } }
      finally { if (!cancelled) setTrackLoading(false) }
    }
    fetchTracks()
    return () => { cancelled = true }
  }, [open, eventId, trackPage, tkFilters])

  if (!open) return null

  const trackFilters = [
    { type: 'search', key: 'keyword', label: 'Track Name', icon: Search, placeholder: 'Search track name...' },
    { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={!submitting ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e8ecf0] px-6 py-5">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">Assign to Track</h3>
            <p className="mt-1 text-[13px] text-[#1f2f3a]">
              Select a track for <span className="font-semibold text-[#1f2f3a]">{user?.firstName} {user?.lastName}</span>
            </p>
          </div>
          {!submitting && (
            <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-3">
          <FilterBar filters={trackFilters} values={tkFilters} onChange={(key, val) => { setTkFilters(prev => ({ ...prev, [key]: val })); setTrackPage(1) }} onReset={() => { setTkFilters({ keyword: '', isDisable: 'false' }); setTrackPage(1) }} hasActive={tkHasActive} />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          <BaseTable borderless
            columns={[
              { key: 'title', header: 'Track Title', headerIcon: FolderKanban, render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.title}</span> },
              { key: 'actions', header: '', headerClassName: 'text-right', className: 'text-right', render: (row) => (
                <button onClick={() => onAssign(row)} disabled={submitting || row.isDisable} className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${row.isDisable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#064f5d] text-white hover:bg-[#05404a]'} disabled:opacity-50`}>
                  <UserPlus className="h-3.5 w-3.5" />{row.isDisable ? 'Disabled' : 'Assign'}
                </button>
              )},
            ]}
            data={tracks}
            page={trackPage}
            pageSize={10}
            total={trackTotal}
            onPageChange={setTrackPage}
            loading={trackLoading}
            serverSide
            emptyText={tkHasActive ? 'No results match.' : 'No tracks configured for this event.'}
            keyExtractor={(row) => row.id}
            minWidth="550px"
            borderless
          />
        </div>
      </div>
    </div>
  )
}

export default function AssignTab({ eventId }) {
  const [subTab, setSubTab] = useState('assigned')

  // Assigned
  const [assigned, setAssigned] = useState([])
  const [assignedTotal, setAssignedTotal] = useState(0)
  const [assignedPage, setAssignedPage] = useState(1)
  const [assignedLoading, setAssignedLoading] = useState(false)
  const [asFilters, setAsFilters] = useState({ keyword: '', eventRole: '', isDisable: '' })
  const asHasActive = Object.values(asFilters).some(v => v !== '')

  // Available Lecturers
  const [lecturers, setLecturers] = useState([])
  const [lecTotal, setLecTotal] = useState(0)
  const [lecPage, setLecPage] = useState(1)
  const [lecLoading, setLecLoading] = useState(false)
  const [lecKeyword, setLecKeyword] = useState('')

  // Available Staff
  const [staff, setStaff] = useState([])
  const [staffTotal, setStaffTotal] = useState(0)
  const [staffPage, setStaffPage] = useState(1)
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffKeyword, setStaffKeyword] = useState('')

  const [assigning, setAssigning] = useState(false)
  const [assignTarget, setAssignTarget] = useState(null)
  const [assignUserRole, setAssignUserRole] = useState('')

  // Track assignment
  const [trackTarget, setTrackTarget] = useState(null)
  const [trackAssigning, setTrackAssigning] = useState(false)

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

  const fetchLecturers = useCallback(async () => {
    setLecLoading(true)
    try {
      const params = { PageIndex: lecPage, PageSize: PAGE_SIZE }
      if (lecKeyword) params.Keyword = lecKeyword
      const result = await getAvailableLecturers(eventId, params)
      setLecturers(result.items || [])
      setLecTotal(result.totalCount || 0)
    } catch (err) { setLecturers([]); setLecTotal(0) }
    finally { setLecLoading(false) }
  }, [eventId, lecPage, lecKeyword])

  useEffect(() => { fetchLecturers() }, [fetchLecturers])

  const fetchStaff = useCallback(async () => {
    setStaffLoading(true)
    try {
      const params = { PageIndex: staffPage, PageSize: PAGE_SIZE }
      if (staffKeyword) params.Keyword = staffKeyword
      const result = await getAvailableStaff(eventId, params)
      setStaff(result.items || [])
      setStaffTotal(result.totalCount || 0)
    } catch (err) { setStaff([]); setStaffTotal(0) }
    finally { setStaffLoading(false) }
  }, [eventId, staffPage, staffKeyword])

  useEffect(() => { fetchStaff() }, [fetchStaff])

  async function handleRemove(row) {
    const ok = await confirm('Delete Assignment', `Delete ${row.firstName} ${row.lastName} (${row.eventRole}) from this event?`)
    if (!ok) return
    try {
      await removeAssign(row.assignEventId)
      toast.success('Assignment deleted successfully')
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete assignment.')
    }
  }

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

  function openAssignModal(user, role) {
    setAssignTarget(user)
    setAssignUserRole(role)
  }

  async function handleAssignRole(role) {
    if (!assignTarget) return
    setAssigning(true)
    try {
      await assignUserToEvent(eventId, { userId: assignTarget.id, eventRole: role })
      toast.success(`${assignTarget.firstName} ${assignTarget.lastName} assigned as ${role}`)
      setAssignTarget(null)
      if (assignUserRole === 'staff') fetchStaff()
      else fetchLecturers()
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign.')
    } finally { setAssigning(false) }
  }

  function handleAsFilterChange(key, value) { setAsFilters(prev => ({ ...prev, [key]: value })); setAssignedPage(1) }
  function handleAsReset() { setAsFilters({ keyword: '', eventRole: '', isDisable: '' }); setAssignedPage(1) }

  function openTrackModal(user) { setTrackTarget(user) }

  async function handleAssignTrack(trackRow) {
    if (!trackTarget) return
    const ok = await confirm('Assign to Track', `Assign "${trackTarget.firstName} ${trackTarget.lastName}" to track "${trackRow.title}"?`)
    if (!ok) return
    setTrackAssigning(true)
    try {
      await assignTrackToEventAssign(trackTarget.assignEventId, { trackId: trackRow.id })
      toast.success(`${trackTarget.firstName} ${trackTarget.lastName} assigned to track successfully`)
      setTrackTarget(null)
      fetchAssigned()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign track.')
    } finally { setTrackAssigning(false) }
  }

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
          <BaseTable borderless columns={assignedColumns(handleRemove, handleRestore, openTrackModal, handleRemoveTrack, handleRestoreTrack)} data={assigned} page={assignedPage} pageSize={PAGE_SIZE} total={assignedTotal} onPageChange={setAssignedPage} loading={assignedLoading} serverSide emptyText={asHasActive ? 'No results match.' : 'No users assigned to this event yet.'} keyExtractor={(row) => row.assignEventId} minWidth="950px" />
        </div>
      )}

      {subTab === 'lecturers' && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <FilterBar filters={availFilters} values={{ keyword: lecKeyword }} onChange={(key, val) => { setLecKeyword(val); setLecPage(1) }} onReset={() => { setLecKeyword(''); setLecPage(1) }} hasActive={lecKeyword !== ''} />
          </div>
          <BaseTable borderless columns={availableColumns((row) => openAssignModal(row, 'lecturer'), assigning, 'Lecturer')} data={lecturers} page={lecPage} pageSize={PAGE_SIZE} total={lecTotal} onPageChange={setLecPage} loading={lecLoading} serverSide emptyText={lecKeyword ? 'No results match.' : 'No available lecturers.'} keyExtractor={(row) => row.id} minWidth="700px" />
        </div>
      )}

      {subTab === 'staff' && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <FilterBar filters={availFilters} values={{ keyword: staffKeyword }} onChange={(key, val) => { setStaffKeyword(val); setStaffPage(1) }} onReset={() => { setStaffKeyword(''); setStaffPage(1) }} hasActive={staffKeyword !== ''} />
          </div>
          <BaseTable borderless columns={availableColumns((row) => openAssignModal(row, 'staff'), assigning, 'Staff')} data={staff} page={staffPage} pageSize={PAGE_SIZE} total={staffTotal} onPageChange={setStaffPage} loading={staffLoading} serverSide emptyText={staffKeyword ? 'No results match.' : 'No available staff.'} keyExtractor={(row) => row.id} minWidth="700px" />
        </div>
      )}

      <AssignRoleModal
        open={!!assignTarget}
        user={assignTarget}
        userRole={assignUserRole}
        onClose={() => { if (!assigning) setAssignTarget(null) }}
        onSubmit={handleAssignRole}
        submitting={assigning}
      />

      <AssignTrackModal
        open={!!trackTarget}
        user={trackTarget}
        eventId={eventId}
        onClose={() => { if (!trackAssigning) setTrackTarget(null) }}
        onAssign={handleAssignTrack}
        submitting={trackAssigning}
      />
    </div>
  )
}
