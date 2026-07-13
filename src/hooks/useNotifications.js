import { useState, useEffect, useCallback, useRef } from 'react'
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
import { MOCK_NOTIFICATIONS } from '../data/notifications'
import { formatDate } from '../utils/format'

/**
 * Hook to fetch and manage notifications based on user role.
 * - Student: calls the student notification API.
 * - Lecturer: calls the lecturer notification API.
 * - Other roles / no user: falls back to MOCK_NOTIFICATIONS (legacy).
 */
export default function useNotifications(user) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const intervalRef = useRef(null)

  const role = user?.role

  const isStudent = role === 'Student'
  const isLecturer = role === 'Lecturer'
  const hasApi = isStudent || isLecturer

  /** Map notification shape from the API to the flat format expected by UI components. */
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

  // ------- Resolve which API to call based on role -------
  const api = {
    fetch: isStudent
      ? (p) => getStudentNotifications(p)
      : isLecturer
        ? (p) => getLecturerNotifications(p)
        : null,
    unreadCount: isStudent
      ? () => getStudentNotificationUnreadCount()
      : isLecturer
        ? () => getLecturerNotificationUnreadCount()
        : null,
    markRead: isStudent
      ? (id) => markStudentNotificationRead(id)
      : isLecturer
        ? (id) => markLecturerNotificationRead(id)
        : null,
    markAllRead: isStudent
      ? () => markStudentAllNotificationsRead()
      : isLecturer
        ? () => markLecturerAllNotificationsRead()
        : null,
  }

  const fetchNotifications = useCallback(async () => {
    if (!api.fetch) return
    try {
      const result = await api.fetch({ PageIndex: 1, PageSize: 10 })
      if (result?.notifications) {
        setNotifications(result.notifications.map(transform))
      }
    } catch {
      // silently fail
    }
  }, [api.fetch])

  const fetchUnreadCount = useCallback(async () => {
    if (!api.unreadCount) return
    try {
      const result = await api.unreadCount()
      setUnreadCount(result?.count ?? 0)
    } catch {
      // silently fail
    }
  }, [api.unreadCount])

  // Initial fetch + poll every 60 seconds
  useEffect(() => {
    if (!hasApi) {
      setNotifications(MOCK_NOTIFICATIONS)
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length)
      return
    }

    fetchNotifications()
    fetchUnreadCount()

    intervalRef.current = setInterval(() => {
      fetchNotifications()
      fetchUnreadCount()
    }, 60_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hasApi, fetchNotifications, fetchUnreadCount])

  const markAsRead = useCallback(async (id) => {
    if (api.markRead) {
      try { await api.markRead(id) } catch { /* ignore */ }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [api.markRead])

  const markAllRead = useCallback(async () => {
    if (api.markAllRead) {
      try { await api.markAllRead() } catch { /* ignore */ }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [api.markAllRead])

  return { notifications, unreadCount, markAsRead, markAllRead, refetch: fetchNotifications }
}
