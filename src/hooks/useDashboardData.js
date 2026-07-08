import { useState, useEffect } from 'react'
import {
  getEventsCount,
  getUsersCount,
  getTeamsCount,
  getRecentEvents,
  getRecentUsers,
  getRecentNotifications,
  getRecentReports,
} from '../api/admin'
import { formatDateTime } from '../utils/format'

function formatUser(u) {
  return {
    id: u.id,
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    email: u.email,
    role: u.role,
    status: 'Active',
    avatarUrl: u.avatarUrl,
  }
}

function formatEvent(e) {
  return {
    id: e.id,
    name: e.name,
    season: e.startTime ? formatDateTime(e.startTime, '') : '',
    date: e.createdAt ? formatDateTime(e.createdAt, '') : '',
    status: e.status,
    teams: 0,
    prize: '',
  }
}

function formatNotification(n) {
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    status: n.status,
    date: n.createdAt
      ? new Date(n.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '',
  }
}

function formatReport(r) {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    typeReport: r.typeReport,
    date: r.createdAt ? formatDateTime(r.createdAt, '') : '',
  }
}

/**
 * Fetches dashboard stats and recent activity data.
 */
export function useDashboardData() {
  const [counts, setCounts] = useState({
    totalEvents: '-',
    publishedEvents: '-',
    draftEvents: '-',
    closedEvents: '-',
    totalUsers: '-',
    studentUsers: '-',
    lecturerUsers: '-',
    staffUsers: '-',
    adminUsers: '-',
    totalTeams: '-',
    activeTeams: '-',
    disabledTeams: '-',
  })

  const [recentEvents, setRecentEvents] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])
  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    async function fetchAll() {
      // Counts
      try {
        const [total, published, draft, closed, totalU, student, lecturer, staff, admin, totalT, active, disabled] =
          await Promise.all([
            getEventsCount(),
            getEventsCount('Published'),
            getEventsCount('Draft'),
            getEventsCount('Closed'),
            getUsersCount(),
            getUsersCount('Student'),
            getUsersCount('Lecturer'),
            getUsersCount('Staff'),
            getUsersCount('Admin'),
            getTeamsCount(),
            getTeamsCount(false),
            getTeamsCount(true),
          ])
        setCounts({
          totalEvents: total.total,
          publishedEvents: published.total,
          draftEvents: draft.total,
          closedEvents: closed.total,
          totalUsers: totalU.total,
          studentUsers: student.total,
          lecturerUsers: lecturer.total,
          staffUsers: staff.total,
          adminUsers: admin.total,
          totalTeams: totalT.total,
          activeTeams: active.total,
          disabledTeams: disabled.total,
        })
      } catch {
        // keep defaults on error
      }

      // Recent events
      try {
        const r = await getRecentEvents()
        if (r?.events?.length > 0) {
          setRecentEvents(r.events.map(formatEvent))
        }
      } catch { /* keep empty */ }

      // Recent users
      try {
        const r = await getRecentUsers()
        if (r?.users?.length > 0) {
          setRecentUsers(r.users.map(formatUser))
        }
      } catch { /* keep empty */ }

      // Recent notifications
      try {
        const r = await getRecentNotifications()
        if (r?.notifications?.length > 0) {
          setRecentNotifications(r.notifications.map(formatNotification))
        }
      } catch { /* keep empty */ }

      // Recent reports
      try {
        const r = await getRecentReports()
        if (r?.reports?.length > 0) {
          setRecentReports(r.reports.map(formatReport))
        }
      } catch { /* keep empty */ }
    }

    fetchAll()
  }, [])

  return {
    counts,
    recentEvents,
    recentUsers,
    recentNotifications,
    recentReports,
  }
}
