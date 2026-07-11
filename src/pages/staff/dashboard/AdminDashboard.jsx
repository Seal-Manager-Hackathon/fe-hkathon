import { useStaffDashboardData } from '../../../hooks/useStaffDashboardData'
import { roleBadge } from '../../../constants/commonOptions'
import DashboardStatsSection from './DashboardStatsSection'
import RecentActivityPanel from './RecentActivityPanel'

const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const statSections = [
  {
    title: 'Hackathons',
    items: [
      { label: 'Total Hackathons', icon: 'Trophy', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Published Hackathons', icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Draft Hackathons', icon: 'Layers', color: 'bg-[#f5f5f5] text-[#757575]' },
      { label: 'Closed Hackathons', icon: 'XCircle', color: 'bg-[#e0f2f1] text-[#00695c]' },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Total Users', icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Student Users', icon: 'GraduationCap', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Lecturer Users', icon: 'UserCheck', color: 'bg-[#f3e5f5] text-[#7b1fa2]' },
      { label: 'Staff Users', icon: 'Briefcase', color: 'bg-[#fff3e0] text-[#e65100]' },
      { label: 'Admin Users', icon: 'Shield', color: 'bg-[#fce4ec] text-[#c62828]' },
    ],
  },
  {
    title: 'Teams',
    items: [
      { label: 'Total Teams', icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Active Teams', icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Disabled Teams', icon: 'XCircle', color: 'bg-[#f5f5f5] text-[#757575]' },
    ],
  },
]

export default function AdminDashboard() {
  const {
    counts,
    recentEvents,
    recentUsers,
    recentNotifications,
    recentReports,
  } = useStaffDashboardData()

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
          Welcome back, Staff. Here&apos;s what&apos;s happening.
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
