import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, Users, Megaphone } from 'lucide-react'
import { allNotifications, notificationTypeBadge, notificationStatusBadge } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import InfoRow from '../../components/InfoRow'

export default function NotificationDetail() {
  const { id } = useParams()
  const notification = allNotifications.find((n) => n.id === Number(id))

  if (!notification) {
    return <NotFoundState entity="Notification" fallbackTo="/admin/notifications" />
  }

  return (
    <div className="px-8 py-8">
      <BackButton fallback="/admin/notifications" label="Back to Notifications" />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[#1f2f3a]">{notification.title}</h1>
            <Badge label={notification.status} className={notificationStatusBadge[notification.status]} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Megaphone className="h-3.5 w-3.5" /> {notification.type}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {notification.audience}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {notification.date}
            </span>
          </div>
        </div>
        <Link
          to={`/admin/notifications/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <Edit className="h-4 w-4" />
          Edit Notification
        </Link>
      </div>

      <CardPanel title="Details">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Type"><Badge label={notification.type} className={notificationTypeBadge[notification.type]} /></InfoRow>
          <InfoRow label="Status"><Badge label={notification.status} className={notificationStatusBadge[notification.status]} /></InfoRow>
          <InfoRow label="Audience"><p className="text-[14px] text-[#1f2f3a]">{notification.audience}</p></InfoRow>
          <InfoRow label="Sent By"><p className="text-[14px] text-[#1f2f3a]">{notification.sentBy}</p></InfoRow>
          <InfoRow label="Date"><p className="text-[14px] text-[#1f2f3a]">{notification.date}</p></InfoRow>
        </div>
      </CardPanel>

      <div className="mt-5">
        <CardPanel title="Message Body">
          <div className="px-5 py-5">
            <p className="text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">{notification.body}</p>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}
