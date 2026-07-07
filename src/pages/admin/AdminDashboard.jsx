import { useState, useEffect } from 'react'
import {
  statSections,
  statusBadge,
  iconMap,
} from '../../data/mockAdminData'
import { roleBadge } from '../../constants/adminOptions'
import { formatDate } from '../../utils/format'
import { getEventsCount, getUsersCount, getTeamsCount, getRecentEvents, getRecentUsers, getRecentNotifications } from '../../api/admin'
import StatCard from '../../components/StatCard'
import SectionTitle from '../../components/SectionTitle'
import ViewButton from '../../components/ViewButton'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    totalEvents: "-",
    publishedEvents: "-",
    draftEvents: "-",
    closedEvents: "-",
    totalUsers: "-",
    studentUsers: "-",
    lecturerUsers: "-",
    staffUsers: "-",
    adminUsers: "-",
    totalTeams: "-",
    activeTeams: "-",
    disabledTeams: "-",
  })
  const [recentTab, setRecentTab] = useState('hackathons')
  const [recentEvents, setRecentEvents] = useState([])
  const [dashboardUsers, setDashboardUsers] = useState([])
  const [dashboardNotifications, setDashboardNotifications] = useState([])

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [total, published, draft, closed, totalUsers, student, lecturer, staff, admin, totalTeams, active, disabled] = await Promise.all([
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
          totalUsers: totalUsers.total,
          studentUsers: student.total,
          lecturerUsers: lecturer.total,
          staffUsers: staff.total,
          adminUsers: admin.total,
          totalTeams: totalTeams.total,
          activeTeams: active.total,
          disabledTeams: disabled.total,
        })
      } catch {
        // keep mock defaults on error
      }
    }
    async function fetchRecent() {
      try {
        const result = await getRecentEvents()
        if (result?.events?.length > 0) {
          setRecentEvents(
            result.events.map((e) => ({
              id: e.id,
              name: e.name,
              season: e.startTime ? formatDate(e.startTime, '') : '',
              date: e.createdAt ? formatDate(e.createdAt, '') : '',
              status: e.status,
              teams: 0,
              prize: '',
            }))
          )
        }
      } catch {
        // keep mock defaults
      }
    }
    async function fetchRecentUsers() {
      try {
        const result = await getRecentUsers()
        if (result?.users?.length > 0) {
          setDashboardUsers(
            result.users.map((u) => ({
              id: u.id,
              name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
              email: u.email,
              role: u.role,
              status: 'Active',
              avatarUrl: u.avatarUrl,
            }))
          )
        }
      } catch {
        // keep mock defaults
      }
    }
    async function fetchRecentNotifications() {
      try {
        const result = await getRecentNotifications()
        if (result?.notifications?.length > 0) {
          setDashboardNotifications(
            result.notifications.map((n) => ({
              id: n.id,
              title: n.title,
              description: n.description,
              status: n.status,
              date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            }))
          )
        }
      } catch {
        // keep mock defaults
      }
    }
    fetchCounts()
    fetchRecent()
    fetchRecentUsers()
    fetchRecentNotifications()
  }, [])

  // Merge real API counts into statSections
  const resolvedSections = statSections.map((section) => {
    const merged = { ...section }
    const mapLabels = {
      Hackathons: {
        'Total Hackathons': counts.totalEvents,
        'Published Hackathons': counts.publishedEvents,
        'Draft Hackathons': counts.draftEvents,
        'Closed Hackathons': counts.closedEvents,
      },
      Users: {
        'Total Users': counts.totalUsers,
        'Student Users': counts.studentUsers,
        'Lecturer Users': counts.lecturerUsers,
        'Staff Users': counts.staffUsers,
        'Admin Users': counts.adminUsers,
      },
      Teams: {
        'Total Teams': counts.totalTeams,
        'Active Teams': counts.activeTeams,
        'Disabled Teams': counts.disabledTeams,
      },
    }
    const map = mapLabels[section.title]
    if (map) {
      merged.items = section.items.map((item) => ({
        ...item,
        value: map[item.label] != null ? map[item.label] : item.value,
      }))
    }
    return merged
  })

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Dashboard</h1>
        <p className="mt-1 text-[15px] text-gray-500">Welcome back, Admin. Here's what's happening.</p>
      </div>

      <div className="mb-8 flex flex-col gap-8">
        {resolvedSections.map((section) => (
          <div key={section.title}>
            <SectionTitle viewAllTo={({ Hackathons: '/admin/hackathons', Users: '/admin/users', Teams: '/admin/teams' })[section.title]}>
              {section.title}
            </SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {section.items.map((item) => (
                <StatCard
                  key={item.label}
                  icon={iconMap[item.icon]}
                  label={item.label}
                  value={item.value}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Recent Activity</SectionTitle>

      <div className="rounded-xl border border-[#e9edf0] bg-white">
        <div className="flex border-b border-[#e9edf0]">
          {[
            { key: 'hackathons', label: 'Hackathons', viewAll: '/admin/hackathons' },
            { key: 'users', label: 'Users', viewAll: '/admin/users' },
            { key: 'notifications', label: 'Notifications', viewAll: '/admin/notifications' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRecentTab(tab.key)}
              className={`cursor-pointer px-5 py-3 text-[13px] font-semibold transition-colors ${recentTab === tab.key
                ? 'border-b-2 border-[#064f5d] text-[#064f5d]'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-4">
            <Link
              to={({ hackathons: '/admin/hackathons', users: '/admin/users', notifications: '/admin/notifications' })[recentTab]}
              className="text-[12px] font-semibold text-[#064f5d] hover:underline"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y divide-[#f5f5f5]">
          {recentTab === 'hackathons' && recentEvents.map((h) => (
            <div key={h.name} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{h.name}</p>
                  <Badge label={h.status} className={statusBadge[h.status]} />
                </div>
                <p className="mt-0.5 text-[12px] text-gray-400">{h.season} &middot; {h.date}</p>
              </div>
              <ViewButton to={`/admin/hackathons/${h.id}`} />
            </div>
          ))}

          {recentTab === 'users' && dashboardUsers.map((u) => (
            <div key={u.email} className="flex items-center justify-between px-5 py-3 gap-3">
              <Avatar src={u.avatarUrl} name={u.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{u.name}</p>
                  <Badge label={u.role} className={roleBadge[u.role]} />
                </div>
                <p className="mt-0.5 truncate text-[12px] text-gray-400">{u.email}</p>
              </div>
              <ViewButton to={`/admin/users/${u.id}`} />
            </div>
          ))}

          {recentTab === 'notifications' && dashboardNotifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between px-5 py-3 gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{n.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{n.date}</p>
              </div>
              <ViewButton to={`/admin/notifications/${n.id}`} />
            </div>
          ))}

          {(recentTab === 'hackathons' && recentEvents.length === 0) ||
            (recentTab === 'users' && dashboardUsers.length === 0) ||
            (recentTab === 'notifications' && dashboardNotifications.length === 0) ? (
            <div className="px-5 py-8 text-center text-[13px] text-gray-400">No data available.</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
