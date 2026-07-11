import { Trophy, Users, BarChart3, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLecturerDashboardData } from '../../../hooks/useLecturerDashboardData'
import DashboardStatsSection from './DashboardStatsSection'
import SectionTitle from '../../../components/SectionTitle'
import Badge from '../../../components/Badge'
import ViewButton from '../../../components/ViewButton'

const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const statSections = [
  {
    title: 'My Events',
    items: [
      { label: 'Total Events', icon: 'Trophy', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Ongoing', icon: 'Play', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Upcoming', icon: 'Clock', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Completed', icon: 'Flag', color: 'bg-[#e0f2f1] text-[#00695c]' },
    ],
  },
]

export default function LecturerDashboard() {
  const { counts, recentEvents, loading } = useLecturerDashboardData()

  const resolvedSections = statSections.map((section) => {
    const merged = { ...section }
    const mapLabels = {
      'My Events': {
        'Total Events': counts.totalEvents,
        'Ongoing': counts.ongoingEvents,
        'Upcoming': counts.upcomingEvents,
        'Completed': counts.completedEvents,
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
          Welcome back, Lecturer. Here&apos;s an overview of your events.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-8">
        {resolvedSections.map((section) => (
          <DashboardStatsSection key={section.title} section={section} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Recent Events */}
        <div>
          <SectionTitle>Recent Activity</SectionTitle>
          <div className="rounded-xl border border-[#e9edf0] bg-white overflow-hidden">
            <div className="flex bg-gradient-to-r from-[#064f5d] to-[#0a6e7d]">
              <div className="inline-flex items-center gap-1.5 px-5 py-3 text-[13px] font-semibold border-b-2 border-white text-white">
                <Trophy className="h-3.5 w-3.5" />
                Events
              </div>
              <div className="ml-auto flex items-center pr-4">
                <Link
                  to="/lecture/hackathons"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/70 hover:text-white hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-[#f5f5f5]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                ))
              ) : recentEvents.length > 0 ? (
                recentEvents.map((ev) => (
                  <Link
                    key={ev.id}
                    to={`/lecture/hackathons/${ev.id}`}
                    className="flex items-center justify-between px-5 py-3 gap-3 transition-colors hover:bg-[#fafbfc]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{ev.name}</p>
                        <Badge label={ev.status} className={statusBadge[ev.status]} />
                      </div>
                      <p className="mt-0.5 text-[12px] text-gray-400">{ev.season} &middot; {ev.date}</p>
                    </div>
                    <ViewButton to={`/lecture/hackathons/${ev.id}`} />
                  </Link>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-[13px] text-gray-400">
                  No events assigned yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
            <div className="border-b border-[#f0f0f0] px-5 py-4">
              <h3 className="text-[15px] font-bold text-[#1f2f3a]">Quick Actions</h3>
            </div>
            <div className="divide-y divide-[#f5f5f5]">
              <Link
                to="/lecture/hackathons"
                className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]"
              >
                <Trophy className="h-4 w-4 text-[#1565c0]" /> Browse My Events <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
              <Link
                to="/lecture/teams"
                className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]"
              >
                <Users className="h-4 w-4 text-[#2e7d32]" /> View Teams <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
              <Link
                to="/lecture/leaderboard"
                className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]"
              >
                <BarChart3 className="h-4 w-4 text-[#7b1fa2]" /> Leaderboard <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
