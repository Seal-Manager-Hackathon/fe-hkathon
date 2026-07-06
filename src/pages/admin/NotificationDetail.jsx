import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, Users, Megaphone } from 'lucide-react'
import { allNotifications, notificationTypeBadge, notificationStatusBadge } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'

export default function NotificationDetail() {
  const { id } = useParams()
  const notification = allNotifications.find((n) => n.id === Number(id))

  if (!notification) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">Notification not found.</p>
        <Link to="/admin/notifications" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          ← Back to Notifications
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-8">
      <Link
        to="/admin/notifications"
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notifications
      </Link>

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
          <div className="flex items-start gap-6 px-5 py-4">
            <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Type</span>
            <Badge label={notification.type} className={notificationTypeBadge[notification.type]} />
          </div>
          <div className="flex items-start gap-6 px-5 py-4">
            <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Status</span>
            <Badge label={notification.status} className={notificationStatusBadge[notification.status]} />
          </div>
          <div className="flex items-start gap-6 px-5 py-4">
            <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Audience</span>
            <p className="text-[14px] text-[#1f2f3a]">{notification.audience}</p>
          </div>
          <div className="flex items-start gap-6 px-5 py-4">
            <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Sent By</span>
            <p className="text-[14px] text-[#1f2f3a]">{notification.sentBy}</p>
          </div>
          <div className="flex items-start gap-6 px-5 py-4">
            <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Date</span>
            <p className="text-[14px] text-[#1f2f3a]">{notification.date}</p>
          </div>
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