import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, ArrowLeft, X, Eye, Calendar, Shield } from 'lucide-react'
import {
  getStaffMyNotifications,
  getStaffMyNotificationDetail,
  markStaffMyNotificationRead,
  markStaffAllMyNotificationsRead,
} from '../../../api/staff'
import { formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import Pagination from '../../../components/Pagination'
import RichTextViewer from '../../../components/RichTextViewer'
import { toast, confirm } from '../../../utils/toast'

const TARGET_TYPE_COLORS = {
  Personal: { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', label: 'Personal' },
  Team: { bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]', label: 'Team' },
  System: { bg: 'bg-[#f3e5f5]', text: 'text-[#7b1fa2]', label: 'System' },
}

const TARGET_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'Personal', label: 'Personal' },
  { value: 'System', label: 'System' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All status' },
  { value: 'Unread', label: 'Unread' },
  { value: 'Read', label: 'Read' },
]

export default function MyNotifications() {
  const [notifications, setNotifications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10

  // Filters
  const [filterTargetType, setFilterTargetType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Detail modal
  const [viewDetailId, setViewDetailId] = useState(null)

  const totalPages = Math.ceil(totalCount / pageSize)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: pageSize }
      if (filterTargetType) params.TargetType = filterTargetType
      if (filterStatus) params.Status = filterStatus

      const result = await getStaffMyNotifications(params)
      setNotifications(result.notifications || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load notifications.'
      setError(msg)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, filterTargetType, filterStatus])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  function handleFilterChange() {
    setPageIndex(1)
  }

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length

  async function handleMarkAllRead() {
    const ok = await confirm(
      'Mark all as read?',
      'This will mark all your notifications as read.',
    )
    if (!ok) return
    try {
      await markStaffAllMyNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })))
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Back link */}
        <Link
          to="/staff"
          className="mb-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">My Notifications</h1>
            <p className="mt-1 text-[14px] text-[#5a6a73]">
              Stay updated with your personal and system notifications.
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#ffebee] px-2.5 py-0.5 text-[12px] font-semibold text-[#c62828]">
                  {unreadCount} unread
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50 sm:self-auto"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-3">
          <select
            value={filterTargetType}
            onChange={(e) => { setFilterTargetType(e.target.value); handleFilterChange() }}
            className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-3.5 py-2 text-[13px] text-[#1f2f3a] outline-none transition-colors focus:border-[#1565c0] focus:ring-2 focus:ring-[#1565c0]/10"
          >
            {TARGET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); handleFilterChange() }}
            className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-3.5 py-2 text-[13px] text-[#1f2f3a] outline-none transition-colors focus:border-[#1565c0] focus:ring-2 focus:ring-[#1565c0]/10"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Notification list */}
        <div className="rounded-xl border border-[#d7e0e5] bg-white">
          {loading && (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 border-b border-[#f0f4f8] px-5 py-4 last:border-0">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                  </div>
                  <div className="h-8 w-16 shrink-0 animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fee2e2]">
                <Bell className="h-6 w-6 text-[#c62828]" />
              </div>
              <p className="text-[15px] font-semibold text-[#1f2f3a]">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-3 cursor-pointer text-[14px] font-semibold text-[#1565c0] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f6f8]">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-[15px] font-semibold text-[#1f2f3a]">No notifications</p>
              <p className="mt-1 text-[13px] text-gray-400">You're all caught up!</p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div>
              {notifications.map((n) => {
                const isUnread = n.status === 'Unread'
                const typeStyle = TARGET_TYPE_COLORS[n.targetType] || TARGET_TYPE_COLORS.System

                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-4 border-b border-[#f0f4f8] px-5 py-4 last:border-0 transition-colors',
                      isUnread ? 'bg-[#f4f9ff]' : '',
                    )}
                  >
                    {/* Unread dot */}
                    <div className="mt-2 shrink-0">
                      <div className={cn('h-2 w-2 rounded-full', isUnread ? 'bg-[#1565c0]' : 'bg-transparent')} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={cn('truncate text-[14px]', isUnread ? 'font-bold text-[#1f2f3a]' : 'font-semibold text-[#5a6a73]')}>
                          {n.title}
                        </h4>
                        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', typeStyle.bg, typeStyle.text)}>
                          {typeStyle.label}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-[#9aaab5]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDateTime(n.createdAt)}
                        </span>
                        {isUnread && (
                          <span className="rounded-full bg-[#ffebee] px-1.5 py-0.5 text-[10px] font-semibold text-[#c62828]">New</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => setViewDetailId(n.id)}
                      className="shrink-0 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1f78d1] transition-colors hover:bg-[#f0f7ff] hover:border-[#1f78d1]/30"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5">
            <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <NotificationDetailModal
        notificationId={viewDetailId}
        onClose={() => setViewDetailId(null)}
        onMarkRead={(id) => {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'Read' } : n)))
        }}
      />
    </div>
  )
}

/* ================================================================== */
/*  Notification Detail Modal                                         */
/* ================================================================== */

function NotificationDetailModal({ notificationId, onClose, onMarkRead }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyFetched, setAlreadyFetched] = useState(false)

  useEffect(() => {
    if (!notificationId) { setAlreadyFetched(false); return }
    if (alreadyFetched) return

    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStaffMyNotificationDetail(notificationId)
        if (!cancelled) {
          setDetail(data)
          setAlreadyFetched(true)
          onMarkRead?.(notificationId)
          markStaffMyNotificationRead(notificationId).catch(() => {})
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load notification detail.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [notificationId, alreadyFetched, onMarkRead])

  if (!notificationId) return null

  const typeStyle = TARGET_TYPE_COLORS[detail?.targetType] || TARGET_TYPE_COLORS.System

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Bell className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.title || 'Notification Detail'}
            </h3>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-24 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-[14px] text-[#c62828]">{error}</p>
              <button onClick={() => setAlreadyFetched(false)} className="mt-3 cursor-pointer text-[14px] font-semibold text-[#1565c0] hover:underline">Try again</button>
            </div>
          ) : detail ? (
            <div className="space-y-5">
              {/* Status badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold', detail.status === 'Unread' ? 'bg-[#ffebee] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]')}>
                  <Shield size={12} />
                  {detail.status === 'Unread' ? 'Unread' : 'Read'}
                </span>
                <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold', typeStyle.bg, typeStyle.text)}>
                  {typeStyle.label}
                </span>
              </div>

              {/* Detail rows */}
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Calendar} label="Created" value={formatDateTime(detail.createdAt)} accent="#3b82f6" />
                {detail.updatedAt && <DetailRow icon={Calendar} label="Updated" value={formatDateTime(detail.updatedAt)} accent="#8a9ba6" />}
                {detail.userId && detail.targetType === 'Personal' && <DetailRow icon={Calendar} label="User ID" value={detail.userId} accent="#10b981" />}
              </div>

              {/* Description */}
              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Helper                                                             */
/* ================================================================== */

function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#1f2f3a]">{value}</span>
    </div>
  )
}
