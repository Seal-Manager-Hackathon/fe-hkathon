import { useState, useEffect } from 'react'
import {
  getLecturerEventsCount,
  getLecturerUsersCount,
  getLecturerTeamsCount,
  getLecturerRecentEvents,
  getLecturerRecentUsers,
  getLecturerRecentNotifications,
  getLecturerRecentReports,
} from '../api/lecturer'
import { formatDateTime } from '../utils/format'

function formatUser(u) {
  return {
    id: u.id, name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    email: u.email, role: u.role, status: 'Active', avatarUrl: u.avatarUrl,
  }
}

function formatEvent(e) {
  return {
    id: e.id, name: e.name,
    season: e.startTime ? formatDateTime(e.startTime, '') : '',
    date: e.createdAt ? formatDateTime(e.createdAt, '') : '',
    status: e.status, teams: 0, prize: '',
  }
}

function formatNotification(n) {
  return {
    id: n.id, title: n.title, description: n.description, status: n.status,
    date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}) : '',
  }
}

function formatReport(r) {
  return {
    id: r.id, title: r.title, description: r.description, status: r.status,
    typeReport: r.typeReport, date: r.createdAt ? formatDateTime(r.createdAt, '') : '',
  }
}

/**
 * Fetches dashboard data for the lecturer.
 * Shape and APIs mirror useStaffDashboardData, using /lecturer prefix.
 */
export function useLecturerDashboardData() {
  const [counts, setCounts] = useState({
    totalEvents:'-',publishedEvents:'-',draftEvents:'-',closedEvents:'-',
    totalUsers:'-',studentUsers:'-',lecturerUsers:'-',staffUsers:'-',adminUsers:'-',
    totalTeams:'-',activeTeams:'-',disabledTeams:'-',
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])
  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    async function fetchAll() {
      try {
        const [total,published,draft,closed,totalU,student,lecturer,staff,admin,totalT,active,disabled] =
          await Promise.all([
            getLecturerEventsCount(),getLecturerEventsCount('Published'),getLecturerEventsCount('Draft'),getLecturerEventsCount('Closed'),
            getLecturerUsersCount(),getLecturerUsersCount('Student'),getLecturerUsersCount('Lecturer'),getLecturerUsersCount('Staff'),getLecturerUsersCount('Admin'),
            getLecturerTeamsCount(),getLecturerTeamsCount(false),getLecturerTeamsCount(true),
          ])
        setCounts({
          totalEvents:total.total,publishedEvents:published.total,draftEvents:draft.total,closedEvents:closed.total,
          totalUsers:totalU.total,studentUsers:student.total,lecturerUsers:lecturer.total,staffUsers:staff.total,adminUsers:admin.total,
          totalTeams:totalT.total,activeTeams:active.total,disabledTeams:disabled.total,
        })
      } catch {}
      try { const r = await getLecturerRecentEvents(); if(r?.events?.length) setRecentEvents(r.events.map(formatEvent)) } catch {}
      try { const r = await getLecturerRecentUsers(); if(r?.users?.length) setRecentUsers(r.users.map(formatUser)) } catch {}
      try { const r = await getLecturerRecentNotifications(); if(r?.notifications?.length) setRecentNotifications(r.notifications.map(formatNotification)) } catch {}
      try { const r = await getLecturerRecentReports(); if(r?.reports?.length) setRecentReports(r.reports.map(formatReport)) } catch {}
    }
    fetchAll()
  }, [])

  return { counts, recentEvents, recentUsers, recentNotifications, recentReports }
}
