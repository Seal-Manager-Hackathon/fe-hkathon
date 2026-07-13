import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getStudentNotifications,
  getStudentNotificationUnreadCount,
  markStudentNotificationRead,
  markStudentAllNotificationsRead,
} from '../api/student'
import { MOCK_NOTIFICATIONS } from '../data/notifications'
import { formatDate } from '../utils/format'

/**
 * Hook to fetch and manage notifications based on user role.
 * For students: calls the real student notification API.
 * For other roles (or when no user): falls back to MOCK_NOTIFICATIONS (legacy).
 */
export default function useNotifications(user) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const intervalRef = useRef(null)
  const isStudent = user?.role === 'Student'

  /**
   * Transform an API notification into the shape expected
   * by NotificationDropdown and NotificationModal.
   */
  function transform(apiNotif) {
    return {
      id: apiNotif.id,
      title: apiNotif.title,
      body: apiNotif.description,
      date: formatDate(apiNotif.createdAt),
      read: apiNotif.status === 'Read',
      targetType: apiNotif.targetType || '',
      createdAt: apiNotif.createdAt,
      // Keep original fields for downstream use
      _raw: apiNotif,
    }
  }

  const fetchNotifications = useCallback(async () => {
    if (!isStudent) return
    try {
      const result = await getStudentNotifications({ PageIndex: 1, PageSize: 10 })
      if (result?.notifications) {
        const list = result.notifications.map(transform)
        setNotifications(list)
      }
    } catch {
      // silently fail — dropdown shows stale data or empty
    }
  }, [isStudent])

  const fetchUnreadCount = useCallback(async () => {
    if (!isStudent) return
    try {
      const result = await getStudentNotificationUnreadCount()
      setUnreadCount(result?.count ?? 0)
    } catch {
      // silently fail
    }
  }, [isStudent])

  // Initial fetch + poll every 60 seconds
  useEffect(() => {
    if (!isStudent) {
      // Fallback to mock data for non-students
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
  }, [isStudent, fetchNotifications, fetchUnreadCount])

  /**
   * Mark a single notification as read.
   * Optimistically updates local state, then calls the API.
   */
  const markAsRead = useCallback(async (id) => {
    if (isStudent) {
      try {
        await markStudentNotificationRead(id)
      } catch {
        // API call failed — revert not necessary for read status
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [isStudent])

  /**
   * Mark all notifications as read.
   */
  const markAllRead = useCallback(async () => {
    if (isStudent) {
      try {
        await markStudentAllNotificationsRead()
      } catch {
        // silently fail
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [isStudent])

  return { notifications, unreadCount, markAsRead, markAllRead, refetch: fetchNotifications }
}
