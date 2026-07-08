import { Bell } from 'lucide-react'

/**
 * Notification bell icon with unread badge counter.
 * Shows a red dot when unreadCount > 0.
 */
export default function NotificationBell({ unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#1f2f3a]"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#c62828] text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  )
}
