import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  getStudentNotifications,
  getStudentNotificationUnreadCount,
  markStudentNotificationRead,
  markStudentAllNotificationsRead,
} from '../api/student'
import {
  getLecturerNotifications,
  getLecturerNotificationUnreadCount,
  markLecturerNotificationRead,
  markLecturerAllNotificationsRead,
} from '../api/lecturer'
import {
  getStaffMyNotifications,
  getStaffMyNotificationUnreadCount,
  markStaffMyNotificationRead,
  markStaffAllMyNotificationsRead,
} from '../api/staff'
import {
  getAdminMyNotifications,
  getAdminMyNotificationUnreadCount,
  markAdminMyNotificationRead,
  markAdminAllMyNotificationsRead,
} from '../api/admin'
import { MOCK_NOTIFICATIONS } from '../data/notifications'
import { formatDate } from '../utils/format'

const ROLE_API = {
  Student: {
    fetch: (p) => getStudentNotifications(p),
    unreadCount: () => getStudentNotificationUnreadCount(),
    markRead: (id) => markStudentNotificationRead(id),
    markAllRead: () => markStudentAllNotificationsRead(),
  },
  Lecturer: {
    fetch: (p) => getLecturerNotifications(p),
    unreadCount: () => getLecturerNotificationUnreadCount(),
    markRead: (id) => markLecturerNotificationRead(id),
    markAllRead: () => markLecturerAllNotificationsRead(),
  },
  Staff: {
    fetch: (p) => getStaffMyNotifications(p),
    unreadCount: () => getStaffMyNotificationUnreadCount(),
    markRead: (id) => markStaffMyNotificationRead(id),
    markAllRead: () => markStaffAllMyNotificationsRead(),
  },
  Admin: {
    fetch: (p) => getAdminMyNotifications(p),
    unreadCount: () => getAdminMyNotificationUnreadCount(),
    markRead: (id) => markAdminMyNotificationRead(id),
    markAllRead: () => markAdminAllMyNotificationsRead(),
  },
}

function transform(apiNotif) {
  return {
    id: apiNotif.id,
    title: apiNotif.title,
    body: apiNotif.description,
    date: formatDate(apiNotif.createdAt),
    read: apiNotif.status === 'Read',
    targetType: apiNotif.targetType || '',
    createdAt: apiNotif.createdAt,
    _raw: apiNotif,
  }
}

/**
 * Hook to fetch and manage notifications based on user role.
 * - Student / Lecturer / Staff: calls the corresponding API.
 * - Other roles / no user: falls back to MOCK_NOTIFICATIONS (legacy).
 */
export default function useNotifications(user) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const intervalRef = useRef(null)

  const role = user?.role
  const api = useMemo(() => ROLE_API[role] || null, [role])
  const hasApi = !!api

  // Initial fetch + poll every 60 seconds
  useEffect(() => {
    if (!api) {
      setNotifications(MOCK_NOTIFICATIONS)
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length)
      return
    }

    api.fetch({ PageIndex: 1, PageSize: 10 })
      .then((result) => {
        if (result?.notifications) setNotifications(result.notifications.map(transform))
      })
      .catch(() => {})

    api.unreadCount()
      .then((result) => setUnreadCount(result?.count ?? 0))
      .catch(() => {})

    intervalRef.current = setInterval(() => {
      api.fetch({ PageIndex: 1, PageSize: 10 })
        .then((result) => {
          if (result?.notifications) setNotifications(result.notifications.map(transform))
        })
        .catch(() => {})

      api.unreadCount()
        .then((result) => setUnreadCount(result?.count ?? 0))
        .catch(() => {})
    }, 60_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [api])

  const markAsRead = useCallback(async (id) => {
    const m = api?.markRead
    if (m) { try { await m(id) } catch { /* ignore */ } }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [api])

  const markAllRead = useCallback(async () => {
    const m = api?.markAllRead
    if (m) { try { await m() } catch { /* ignore */ } }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [api])

  return { notifications, unreadCount, markAsRead, markAllRead, refetch: () => {} }
}
