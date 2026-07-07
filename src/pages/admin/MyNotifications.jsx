import { useState } from 'react'
import { CheckCheck, Bell, Eye } from 'lucide-react'
import { cn } from '../../utils/cn'
import CardPanel from '../../components/CardPanel'
import Badge from '../../components/Badge'
import NotificationModal from '../../components/NotificationModal'

const myNotifications = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: 'Registration is open for all students and teams. New tracks in AI, Blockchain, and Climate Tech are available.', date: 'Jul 06, 2026', read: false },
  { id: 2, title: 'New round added: Final Pitch', body: 'The Final Pitch round has been added to Cloud Builders Cup 2026. Submit your slides by July 20.', date: 'Jul 05, 2026', read: false },
  { id: 3, title: 'System maintenance scheduled', body: 'Platform will undergo maintenance on July 12 from 02:00 AM to 06:00 AM UTC.', date: 'Jul 03, 2026', read: true },
  { id: 4, title: 'Your team has been approved', body: 'Your team registration for SEAL Hackathon 2026 has been approved. Good luck!', date: 'Jul 01, 2026', read: true },
  { id: 5, title: 'Platform upgrade completed', body: 'The platform has been successfully upgraded to version 3.2. New features include improved team management and enhanced dashboard analytics.', date: 'Jun 20, 2026', read: true },
  { id: 6, title: 'Registration deadline extended', body: 'The registration deadline for Cloud Builders Cup 2026 has been extended to July 18, 2026. Spread the word!', date: 'Jun 28, 2026', read: true },
]

export default function MyNotifications() {
  const [notifications, setNotifications] = useState(myNotifications)
  const [selected, setSelected] = useState(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  function openModal(notif) {
    if (!notif.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)))
    }
    setSelected(notif)
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <>
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">My Notifications</h1>
            <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">
              Stay updated with your personal notifications.
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-[#ffebee] px-2 py-0.5 text-[12px] sm:text-[13px] font-semibold text-[#c62828]">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2 text-[13px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 sm:px-4 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        <CardPanel title="All Notifications">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f6f8]">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[15px] font-semibold text-[#1f2f3a]">No notifications</p>
              <p className="mt-1 text-[13px] text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isUnread = !n.read
              return (
                <div key={n.id} className="flex items-center justify-between border-b border-[#f5f5f5] px-5 py-3.5 last:border-0 gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      isUnread ? 'bg-[#1565c0]' : 'bg-transparent'
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          'truncate text-[13px]',
                          isUnread ? 'font-semibold text-[#1f2f3a]' : 'font-medium text-gray-600'
                        )}>
                          {n.title}
                        </p>
                        {isUnread && (
                          <Badge label="New" className="bg-[#e3f2fd] text-[#1565c0] text-[11px] shrink-0" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-400">{n.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(n)}
                    className="ml-3 shrink-0 cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              )
            })
          )}
        </CardPanel>
      </div>

      <NotificationModal notification={selected} onClose={() => setSelected(null)} />
    </>
  )
}
