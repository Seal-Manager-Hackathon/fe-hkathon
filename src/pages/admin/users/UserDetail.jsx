import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Edit, Mail, Shield, Calendar, Hash, GraduationCap, BadgeCheck,
  Phone, MapPin, AlertTriangle, Clock, FileText, Trophy, Search, Ban,
  CircleCheck, Users, Eye, MoreHorizontal,
} from 'lucide-react'
import { getUserDetail, getUserEvents } from '../../../api/admin'
import { roleBadge } from '../../../constants/adminOptions'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'

const eventStatusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

const eventColumns = [
  { key: 'eventName', header: 'Event', headerIcon: Trophy, render: (row) => (
    <Link to={`/admin/hackathons/${row.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.eventName}</Link>
  )},
  { key: 'teamName', header: 'Team', headerIcon: Users, render: (row) => (
    row.teamId ? <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName}</Link> : <span className="text-[14px] text-gray-400">—</span>
  )},
  { key: 'trackTitle', header: 'Track', headerIcon: FileText, render: (row) => (
    row.trackId ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackTitle || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span>
  )},
  { key: 'topicTitle', header: 'Topic', headerIcon: FileText, render: (row) => (
    row.topicId && row.trackId ? <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.trackId}/topics`} className="text-[13px] font-medium text-[#1f2f3a] hover:underline">{row.topicTitle || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span>
  )},
  { key: 'isBanned', header: 'Banned', headerIcon: Ban, render: (row) => (
    row.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />
  )},
  { key: 'eventStatus', header: 'Status', headerIcon: CircleCheck, render: (row) => (
    <Badge label={row.eventStatus} className={eventStatusBadge[row.eventStatus] || 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'status', header: 'Registration', headerIcon: Shield, render: (row) => (
    <Badge label={row.status} className={row.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => (
    <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>
  )},
  { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
    <Link to={`/admin/register-teams/${row.registerTeamId}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
  )},
]

const PAGE_SIZE = 10

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [events, setEvents] = useState([])
  const [eventsTotal, setEventsTotal] = useState(0)
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventPage, setEventPage] = useState(1)
  const [eventKeyword, setEventKeyword] = useState('')

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const params = { PageIndex: eventPage, PageSize: PAGE_SIZE }
      if (eventKeyword) params.Keyword = eventKeyword
      const result = await getUserEvents(id, params)
      setEvents(result.events || [])
      setEventsTotal(result.totalCount || 0)
    } catch {}
    finally { setEventsLoading(false) }
  }, [id, eventPage, eventKeyword])

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getUserDetail(id)
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load user detail.')
      } finally { if (!cancelled) setLoading(false) }
    }
    fetch(); return () => { cancelled = true }
  }, [id])

  useEffect(() => { if (user) fetchEvents() }, [fetchEvents, user])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 flex items-center gap-5"><div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200" /><div className="space-y-2"><div className="h-7 w-48 animate-pulse rounded bg-gray-200" /><div className="h-4 w-72 animate-pulse rounded bg-gray-200" /></div></div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    const nf = error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">{nf ? 'User not found' : error}</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Users</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">User not found.</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Users</Link>
      </div>
    )
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
  const isDisabled = user.isDisable
  const eventHasActive = eventKeyword !== ''
  const eventFilters = [{ type: 'search', key: 'keyword', label: 'Event', icon: Search, placeholder: 'Search event name...' }]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link to="/admin/users" className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Users</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-5">
          <Avatar src={user.avatarUrl} name={fullName} size="h-20 w-20" textSize="text-[24px]" />
          <div>
            <h1 className="text-[24px] font-bold text-[#1f2f3a] leading-tight sm:text-[28px]">{fullName}</h1>
            <p className="mt-1 text-[14px] text-gray-400">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge label={user.role} className={roleBadge[user.role] || ''} />
              {isDisabled && <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />}
              {user.isVerified ? <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Not verified" className="bg-[#fce4ec] text-[#c62828]" />}
            </div>
          </div>
        </div>
        <Link to={`/admin/users/${id}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#05404a] shrink-0 self-start"><Edit className="h-4 w-4" />Edit User</Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CardPanel title="Personal Information">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Full Name" icon={BadgeCheck}><p className="text-[14px] font-medium text-[#1f2f3a]">{fullName}</p></InfoRow>
            <InfoRow label="Email" icon={Mail}><p className="text-[14px] text-[#064f5d]">{user.email}</p></InfoRow>
            <InfoRow label="Phone" icon={Phone}><p className="text-[14px] text-[#1f2f3a]">{user.phoneNumber || '—'}</p></InfoRow>
            <InfoRow label="Date of Birth" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{user.dateOfBirth ? formatDateTime(user.dateOfBirth) : '—'}</p></InfoRow>
            <InfoRow label="Address" icon={MapPin}><p className="text-[14px] text-[#1f2f3a]">{user.address || '—'}</p></InfoRow>
            <InfoRow label="Bio" icon={FileText}><p className="text-[14px] text-[#1f2f3a] whitespace-pre-wrap">{user.bio || '—'}</p></InfoRow>
            <InfoRow label="College" icon={GraduationCap}><p className="text-[14px] text-[#1f2f3a]">{user.college || '—'}</p></InfoRow>
            <InfoRow label="Student ID" icon={Hash}><p className="text-[14px] font-mono text-[13px] text-gray-500">{user.studentId || '—'}</p></InfoRow>
            <InfoRow label="Role" icon={Shield}><Badge label={user.role} className={roleBadge[user.role] || ''} /></InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Account Status">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Status" icon={BadgeCheck}>
              {isDisabled ? <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
            </InfoRow>
            <InfoRow label="Verified" icon={Shield}>
              {user.isVerified ? <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Not verified" className="bg-[#fce4ec] text-[#c62828]" />}
            </InfoRow>
            <InfoRow label="Verified At" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{user.verifyEmailAt ? formatDateTime(user.verifyEmailAt) : '—'}</p></InfoRow>
            <InfoRow label="Ban Reason" icon={AlertTriangle}><p className="text-[14px] text-[#c62828]">{user.banReason || '—'}</p></InfoRow>
            <InfoRow label="Banned At" icon={AlertTriangle}><p className="text-[14px] text-[#1f2f3a]">{user.bannedAt ? formatDateTime(user.bannedAt) : '—'}</p></InfoRow>
            <InfoRow label="Created" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(user.createdAt)}</p></InfoRow>
            <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(user.updatedAt)}</p></InfoRow>
          </div>
        </CardPanel>
      </div>

      {/* Event History — full width */}
      <div className="mt-5">
        <div className="rounded-xl border border-[#e8ecf0] bg-white">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
            <h3 className="text-[15px] font-bold text-[#1f2f3a]">Event History</h3>
          </div>
          <div className="px-5 pt-4 pb-0">
            <div className="mb-4">
              <FilterBar filters={eventFilters} values={{ keyword: eventKeyword }} onChange={(key, val) => { setEventKeyword(val); setEventPage(1) }} onReset={() => { setEventKeyword(''); setEventPage(1) }} hasActive={eventHasActive} />
            </div>
          </div>
          <BaseTable borderless columns={eventColumns} data={events} page={eventPage} pageSize={PAGE_SIZE} total={eventsTotal} onPageChange={setEventPage} loading={eventsLoading} emptyText="No event history found." keyExtractor={(row) => row.registerTeamId || row.eventId} />
        </div>
      </div>
    </div>
  )
}
