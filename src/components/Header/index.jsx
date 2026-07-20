import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, LogIn } from 'lucide-react'
import useNotifications from '../../hooks/useNotifications'
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
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)

  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications(user)

  const viewAllTo =
    user?.role === 'Admin'
      ? '/admin/my-notifications'
      : user?.role === 'Staff'
        ? '/staff/my-notifications'
        : user?.role === 'Lecturer'
          ? '/lecture/my-notifications'
          : '/my-notifications'
  const isGuest = !user

  useEffect(() => {
    function handleClickOutside(e) {
      // Don't close dropdown when clicking inside the notification modal
      if (e.target.closest('[data-notification-modal]')) return
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
          {!isGuest && (
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
          )}

          {isGuest ? (
            <Link
              to="/login"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1250a0]"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          ) : (
            <UserMenu
              user={user}
              menuItems={menuItems}
              onLogout={onLogout}
            />
          )}
        </div>
      </header>

      <NotificationModal
        notification={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
