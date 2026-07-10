import { useDashboardData } from '../../../hooks/useDashboardData'
import { statSections, statusBadge } from '../../../data/mockAdminData'
import { roleBadge } from '../../../constants/commonOptions'
import DashboardStatsSection from './DashboardStatsSection'
import RecentActivityPanel from './RecentActivityPanel'

export default function AdminDashboard() {
  const {
    counts,
    recentEvents,
    recentUsers,
    recentNotifications,
    recentReports,
  } = useDashboardData()

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
        <p className="mt-1 text-[15px] text-gray-500">
          Welcome back, Admin. Here&apos;s what&apos;s happening.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-8">
        {resolvedSections.map((section) => (
          <DashboardStatsSection key={section.title} section={section} />
        ))}
      </div>

      <RecentActivityPanel
        recentEvents={recentEvents}
        recentUsers={recentUsers}
        recentNotifications={recentNotifications}
        recentReports={recentReports}
        statusBadge={statusBadge}
        roleBadge={roleBadge}
      />
    </div>
  )
}
