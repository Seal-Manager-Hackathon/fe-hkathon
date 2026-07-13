import { Link } from 'react-router-dom'
import { ArrowRight, CheckCheck, Eye } from 'lucide-react'
import { cn } from '../../utils/cn'
import { toast, confirm } from '../../utils/toast'

const TARGET_TYPE_COLORS = {
  Personal: { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]' },
  Team: { bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]' },
  System: { bg: 'bg-[#f3e5f5]', text: 'text-[#7b1fa2]' },
}

/**
 * Dropdown list of notifications with mark-as-read + detail view.
 */
export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  viewAllTo = '/notifications',
  onSelect,
  onMarkRead,
  onMarkAllRead,
}) {
  async function handleMarkAllRead(e) {
    e.stopPropagation()
    const ok = await confirm(
      'Mark all as read?',
      'This will mark all your notifications as read.',
    )
    if (!ok) return
    onMarkAllRead?.()
    toast.success('All notifications marked as read')
  }

  return (
    <div className="fixed left-2 right-2 top-14 z-40 rounded-xl border border-[#e8ecf0] bg-white shadow-lg sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:z-auto sm:mt-2 sm:w-[380px]">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-3.5">
        <h3 className="text-[14px] font-bold text-[#1f2f3a]">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#ffebee] px-2 py-0.5 text-[11px] font-semibold text-[#c62828]">
              {unreadCount} new
            </span>
          )}
          <button
            onClick={handleMarkAllRead}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#e8f5e9] text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]"
            aria-label="Mark all as read"
            title="Mark all as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-[340px] overflow-y-auto">
        {notifications.length === 0 && (
          <p className="px-5 py-8 text-center text-[14px] text-gray-400">
            No notifications
          </p>
        )}
        {notifications.map((n) => {
          const isUnread = !n.read
          const typeStyle = TARGET_TYPE_COLORS[n.targetType] || TARGET_TYPE_COLORS.System

          return (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-2 border-b border-[#f5f5f5] px-5 py-3 transition-colors last:border-0',
                isUnread ? 'bg-[#f4f9ff]' : '',
              )}
            >
              <div
                className={cn(
                  'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                  isUnread ? 'bg-[#1565c0]' : 'bg-transparent',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">
                    {n.title}
                  </p>
                  {n.targetType && (
                    <span className={cn(
                      'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none',
                      typeStyle.bg, typeStyle.text,
                    )}>
                      {n.targetType}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] text-gray-400">{n.date}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkRead?.(n.id)
                  onSelect?.(n)
                }}
                className="shrink-0 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d7e0e5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1f78d1] transition-colors hover:bg-[#f0f7ff] hover:border-[#1f78d1]/30"
              >
                <Eye size={12} />
                View
              </button>
            </div>
          )
        })}
      </div>

      <Link
        to={viewAllTo}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-[#f0f0f0] px-5 py-3 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]/50"
      >
        View all notifications <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
