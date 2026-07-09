import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, Clock, Target, BadgeCheck } from 'lucide-react'
import { getNotificationDetail, getUserDetail, getTeamDetail } from '../../../api/staff'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import NotificationTarget from '../../../components/NotificationTarget'
import { formatDateTime } from '../../../utils/format'

const targetTypeBadge = {
  Personal: 'bg-[#e3f2fd] text-[#1565c0]',
  Team: 'bg-[#e8f5e9] text-[#2e7d32]',
  System: 'bg-[#f3e5f5] text-[#7b1fa2]',
}

export default function NotificationDetail() {
  const { id } = useParams()
  const [notification, setNotification] = useState(null)
  const [targetDetails, setTargetDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getNotificationDetail(id)
        if (!cancelled) setNotification(data)

        // Resolve target detail
        const details = {}
        if (data?.targetType === 'Personal' && data?.userId) {
          try {
            const user = await getUserDetail(data.userId)
            details[data.userId] = user
          } catch (_) { details[data.userId] = null }
        }
        if (data?.targetType === 'Team' && data?.teamId) {
          try {
            const team = await getTeamDetail(data.teamId)
            details[`team:${data.teamId}`] = team
          } catch (_) { details[`team:${data.teamId}`] = null }
        }
        if (!cancelled) setTargetDetails(details)
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message || 'Failed to load notification detail.'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 space-y-2">
          <div className="h-7 w-96 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-5 h-40 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  // ---------- Error ----------
  if (error || !notification) {
    const isNotFound = error === 'Notification Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Notification not found' : error || 'Notification not found.'}
        </p>
        <Link to="/staff/notifications" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Notifications
        </Link>
      </div>
    )
  }

  // ---------- Detail ----------
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/staff/notifications"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Notifications
        </Link>
      </div>

      {/* Header: title + status + target + edit */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
              {notification.title}
            </h1>
            <Badge
              label={notification.status === 'Read' ? 'Read' : 'Unread'}
              className={notification.status === 'Read'
                ? 'bg-[#f5f5f5] text-[#757575]'
                : 'bg-[#e3f2fd] text-[#1565c0]'}
            />
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <Badge
              label={notification.targetType === 'Personal' ? 'User' : notification.targetType}
              className={targetTypeBadge[notification.targetType] || ''}
            />
          </div>
        </div>
        <Link
          to={`/staff/notifications/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Notification
        </Link>
      </div>

      {/* Details card */}
      <CardPanel title="Details">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Target" icon={Target}>
            <NotificationTarget
              targetType={notification.targetType}
              userId={notification.userId}
              teamId={notification.teamId}
              details={targetDetails}
            />
          </InfoRow>
          <InfoRow label="Status" icon={BadgeCheck}>
            {notification.status === 'Read'
              ? <Badge label="Read" className="bg-[#f5f5f5] text-[#757575]" />
              : <Badge label="Unread" className="bg-[#e3f2fd] text-[#1565c0]" />
            }
          </InfoRow>
          <InfoRow label="Created At" icon={Calendar}>
            <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(notification.createdAt)}</p>
          </InfoRow>
          <InfoRow label="Updated At" icon={Clock}>
            <p className="text-[14px] text-[#1f2f3a]">{notification.updatedAt ? formatDateTime(notification.updatedAt) : '—'}</p>
          </InfoRow>
        </div>
      </CardPanel>

      {/* Message body */}
      {notification.description && (
        <div className="mt-5">
          <CardPanel title="Message">
            <div className="px-5 py-5">
              <p className="text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">
                {notification.description}
              </p>
            </div>
          </CardPanel>
        </div>
      )}
    </div>
  )
}
