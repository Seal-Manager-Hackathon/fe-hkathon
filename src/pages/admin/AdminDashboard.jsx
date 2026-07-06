import { useState, useEffect } from 'react'
import {
  statSections,
  recentHackathons,
  recentUsers,
  notifications,
  statusBadge,
  roleBadge,
  userStatusBadge,
  iconMap,
} from '../../data/mockAdminData'
import { getEventsCount, getUsersCount, getTeamsCount, getRecentEvents } from '../../api/admin'
import StatCard from '../../components/StatCard'
import SectionTitle from '../../components/SectionTitle'
import CardPanel from '../../components/CardPanel'
import ViewButton from '../../components/ViewButton'
import Badge from '../../components/Badge'
import DashboardModal from '../../components/DashboardModal'
import Avatar from '../../components/Avatar'

export default function AdminDashboard() {
  const [modal, setModal] = useState(null)
  const [counts, setCounts] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    closedEvents: 0,
    totalUsers: 0,
    studentUsers: 0,
    lecturerUsers: 0,
    staffUsers: 0,
    adminUsers: 0,
    totalTeams: 0,
    activeTeams: 0,
    disabledTeams: 0,
  })
  const [recentEvents, setRecentEvents] = useState(recentHackathons)

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
              season: e.startTime ? new Date(e.startTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
              date: e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
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
    fetchCounts()
    fetchRecent()
  }, [])

  const badgeMaps = { status: statusBadge, role: roleBadge, userStatus: userStatusBadge }

  function openModal(type, data) {
    setModal({ type, data, badges: badgeMaps })
  }

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
            <SectionTitle viewAllTo={section.title === 'Hackathons' ? '/admin/hackathons' : undefined}>
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

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <CardPanel title="Recent Hackathons" viewAllTo="/admin/hackathons">
          {recentEvents.map((h) => (
            <div key={h.name} className="flex items-center justify-between border-b border-[#f5f5f5] px-5 py-3 last:border-0 gap-3">
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
        </CardPanel>

        <CardPanel title="Recent Users" viewAllTo="/admin/users">
          {recentUsers.map((u) => (
            <div key={u.email} className="flex items-center justify-between border-b border-[#f5f5f5] px-5 py-3 last:border-0 gap-3">
              <Avatar name={u.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{u.name}</p>
                  <Badge label={u.role} className={roleBadge[u.role]} />
                </div>
                <p className="mt-0.5 truncate text-[12px] text-gray-400">{u.email}</p>
              </div>
              <ViewButton onClick={() => openModal('user', u)} />
            </div>
          ))}
        </CardPanel>

        <CardPanel title="System Notifications" viewAllTo="/admin/notifications">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between border-b border-[#f5f5f5] px-5 py-3.5 last:border-0 gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{n.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{n.date}</p>
              </div>
              <ViewButton onClick={() => openModal(null, n)} />
            </div>
          ))}
        </CardPanel>
      </div>

      {modal && <DashboardModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
