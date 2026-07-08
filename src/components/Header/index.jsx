import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu } from 'lucide-react'
import { MOCK_NOTIFICATIONS } from '../../data/notifications'
import NotificationModal from '../NotificationModal'
import UserMenu from '../UserMenu'
import NotificationBell from './NotificationBell'
import NotificationDropdown from './NotificationDropdown'

export default function Header({
  user,
  menuItems,
  onLogout,
  showSidebarToggle,
  onToggleSidebar,
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const viewAllTo =
    user?.role === 'Admin' ? '/admin/my-notifications' : '/notifications'
  const resolvedUser = user || { name: 'Guest visitor' }

  useEffect(() => {
    function handleClickOutside(e) {
      // Don't close dropdown when clicking inside the notification modal
      if (e.target.closest('[data-notification-modal]')) return
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    )
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-[#e8ecf0] bg-white px-3 sm:px-4 lg:px-6">
        {/* Left: sidebar hamburger */}
        <div className="flex items-center gap-2">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#1f2f3a] lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Right: bell + user */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div ref={ref} className="relative">
            <NotificationBell
              unreadCount={unreadCount}
              onClick={() => setOpen(!open)}
            />

            {open && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                viewAllTo={viewAllTo}
                onSelect={setSelected}
                onMarkRead={markAsRead}
                onMarkAllRead={markAllRead}
              />
            )}
          </div>

          <UserMenu
            user={resolvedUser}
            menuItems={menuItems}
            onLogout={onLogout}
          />
        </div>
      </header>

      <NotificationModal
        notification={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
