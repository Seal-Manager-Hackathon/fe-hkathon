import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import NotificationModal from '../NotificationModal'
import UserMenu from '../UserMenu'

const mockNotifications = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: 'Registration is open for all students and teams. New tracks in AI, Blockchain, and Climate Tech are available.', date: 'Jul 06, 2026', read: false },
  { id: 2, title: 'New round added: Final Pitch', body: 'The Final Pitch round has been added to Cloud Builders Cup 2026. Submit your slides by July 20.', date: 'Jul 05, 2026', read: false },
  { id: 3, title: 'System maintenance scheduled', body: 'Platform will undergo maintenance on July 12 from 02:00 AM to 06:00 AM UTC.', date: 'Jul 03, 2026', read: true },
  { id: 4, title: 'Your team has been approved', body: 'Your team registration for SEAL Hackathon 2026 has been approved. Good luck!', date: 'Jul 01, 2026', read: true },
]

export default function Header({ viewAllTo = '/notifications', user, menuItems }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function markAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b border-[#e8ecf0] bg-white px-6">
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1f2f3a]"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#c62828] text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-[380px] rounded-xl border border-[#e8ecf0] bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-3.5">
                <h3 className="text-[14px] font-bold text-[#1f2f3a]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#ffebee] px-2 py-0.5 text-[11px] font-semibold text-[#c62828]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-[340px] overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-5 py-8 text-center text-[14px] text-gray-400">No notifications</p>
                )}
                {notifications.map((n) => {
                  const isUnread = !n.read
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id)
                        setSelected(n)
                      }}
                      className={`flex w-full cursor-pointer gap-3 border-b border-[#f5f5f5] px-5 py-3 text-left transition-colors hover:bg-gray-50 last:border-0 ${isUnread ? 'bg-[#f4f9ff]' : ''}`}
                    >
                      <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${isUnread ? 'bg-[#1565c0]' : 'bg-transparent'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">{n.date}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <Link
                to={viewAllTo}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center justify-center border-t border-[#f0f0f0] px-5 py-3 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]/50"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {user && menuItems && <UserMenu user={user} menuItems={menuItems} />}
      </header>

      <NotificationModal notification={selected} onClose={() => setSelected(null)} />
    </>
  )
}
