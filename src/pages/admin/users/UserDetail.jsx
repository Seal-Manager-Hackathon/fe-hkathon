import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Mail, Shield, Calendar, Hash, GraduationCap, BadgeCheck,
  Phone, MapPin, AlertTriangle, Clock, FileText,
} from 'lucide-react'
import { getUserAssignEvents, getUserDetail, getUserEvents } from '../../../api/admin'
import { roleBadge } from '../../../constants/commonOptions'
import { formatDateTime } from '../../../utils/format'
import { getUserRoleId } from '../../../utils/userRoleId'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import UserDetailHeader from './UserDetailHeader'
import UserDetailEvents from './UserDetailEvents'
import UserDetailAssignEvents from './UserDetailAssignEvents'

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

  const [assignEvents, setAssignEvents] = useState([])
  const [assignEventsTotal, setAssignEventsTotal] = useState(0)
  const [assignEventsLoading, setAssignEventsLoading] = useState(false)
  const [assignEventsError, setAssignEventsError] = useState('')
  const [assignEventPage, setAssignEventPage] = useState(1)
  const [assignEventKeyword, setAssignEventKeyword] = useState('')
  const [assignEventRole, setAssignEventRole] = useState('')

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

  const fetchAssignEvents = useCallback(async () => {
    setAssignEventsLoading(true)
    setAssignEventsError('')
    try {
      const params = { PageIndex: assignEventPage, PageSize: PAGE_SIZE }
      if (assignEventKeyword) params.Keyword = assignEventKeyword
      if (assignEventRole) params.EventRole = assignEventRole
      const result = await getUserAssignEvents(id, params)
      setAssignEvents(result.events || [])
      setAssignEventsTotal(result.totalCount || 0)
    } catch (err) {
      setAssignEventsError(err?.response?.data?.message || 'Failed to load assigned events.')
      setAssignEvents([])
      setAssignEventsTotal(0)
    } finally {
      setAssignEventsLoading(false)
    }
  }, [id, assignEventPage, assignEventKeyword, assignEventRole])

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

  useEffect(() => {
    if (user?.role === 'Student') fetchEvents()
    if (user?.role === 'Lecturer' || user?.role === 'Staff') fetchAssignEvents()
  }, [fetchAssignEvents, fetchEvents, user])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    const nf = error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'User not found' : error}</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Users</Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-[#1f2f3a]">User not found.</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Users</Link>
      </div>
    )
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
  const isDisabled = user.isDisable
  const userIdInfo = getUserRoleId(user)

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link to="/admin/users" className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Users
        </Link>
      </div>

      <UserDetailHeader user={user} fullName={fullName} />

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
            <InfoRow label={userIdInfo.label} icon={Hash}><p className="text-[14px] font-mono text-[13px] text-[#1f2f3a]">{userIdInfo.value || '—'}</p></InfoRow>
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

      {user.role === 'Student' && (
        <UserDetailEvents
          events={events}
          eventsTotal={eventsTotal}
          eventsLoading={eventsLoading}
          eventPage={eventPage}
          eventKeyword={eventKeyword}
          onPageChange={setEventPage}
          onFilterChange={(key, val) => { setEventKeyword(val); setEventPage(1) }}
          onFilterReset={() => { setEventKeyword(''); setEventPage(1) }}
        />
      )}

      {(user.role === 'Lecturer' || user.role === 'Staff') && (
        <UserDetailAssignEvents
          userRole={user.role}
          events={assignEvents}
          total={assignEventsTotal}
          loading={assignEventsLoading}
          error={assignEventsError}
          page={assignEventPage}
          keyword={assignEventKeyword}
          eventRole={assignEventRole}
          onPageChange={setAssignEventPage}
          onFilterChange={(key, val) => {
            if (key === 'keyword') setAssignEventKeyword(val)
            if (key === 'eventRole') setAssignEventRole(val)
            setAssignEventPage(1)
          }}
          onFilterReset={() => {
            setAssignEventKeyword('')
            setAssignEventRole('')
            setAssignEventPage(1)
          }}
        />
      )}
    </div>
  )
}
