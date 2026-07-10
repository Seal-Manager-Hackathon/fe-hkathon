import { Trophy, Users, UserCheck, ClipboardList, BarChart3, FileText, ChevronRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/Badge'
import StatCard from '../../../components/StatCard'
import SectionTitle from '../../../components/SectionTitle'
import { formatDateTime } from '../../../utils/format'

const statusBadge = {
  Ongoing: 'bg-[#e8f5e9] text-[#2e7d32]',
  Upcoming: 'bg-[#e3f2fd] text-[#1565c0]',
  Completed: 'bg-[#e0f2f1] text-[#00695c]',
}

const MOCK_STATS = {
  assignedEvents: 3,
  mentorTeams: 12,
  pendingGrading: 24,
  completedGrading: 45,
}

const statSections = [
  {
    title: 'My Event Roles',
    items: [
      { label: 'Assigned Events', value: MOCK_STATS.assignedEvents, icon: 'Trophy', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Mentored Teams', value: MOCK_STATS.mentorTeams, icon: 'Users', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Pending Grading', value: MOCK_STATS.pendingGrading, icon: 'ClipboardList', color: 'bg-[#fff3e0] text-[#e65100]' },
      { label: 'Graded', value: MOCK_STATS.completedGrading, icon: 'CheckCircle', color: 'bg-[#e0f2f1] text-[#00695c]' },
    ],
  },
]

const MOCK_MY_EVENTS = [
  { id: '1', name: 'Hackathon AI 2026', role: 'Mentor', status: 'Ongoing', teams: 5, startTime: '2026-06-01T00:00:00Z' },
  { id: '2', name: 'Cloud Builders Cup 2026', role: 'Judge', status: 'Upcoming', teams: 0, startTime: '2026-09-15T00:00:00Z' },
  { id: '3', name: 'FinTech Rush 2026', role: 'Judge', status: 'Completed', teams: 8, startTime: '2026-03-01T00:00:00Z' },
]

const MOCK_PENDING_GRADING = [
  { id: 's1', teamName: 'Cloud Ninjas', eventName: 'Hackathon AI 2026', roundName: 'Final Round', submittedAt: '2026-06-28T10:00:00Z' },
  { id: 's2', teamName: 'AI Warriors', eventName: 'Hackathon AI 2026', roundName: 'Final Round', submittedAt: '2026-06-27T14:30:00Z' },
  { id: 's3', teamName: 'Data Wizards', eventName: 'Hackathon AI 2026', roundName: 'Semi-Final', submittedAt: '2026-06-20T09:00:00Z' },
]

export default function LecturerDashboard() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Dashboard</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Welcome, Lecturer. Manage your mentoring and judging tasks.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-8">
        {statSections.map((section) => (
          <div key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {section.items.map((item) => {
                const iconMap = { Trophy, Users, ClipboardList, UserCheck }
                const CheckCircle = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                const Icon = iconMap[item.icon] || (({ className }) => <BarChart3 className={className} />)
                if (item.label === 'Graded') {
                  return (
                    <StatCard
                      key={item.label}
                      icon={CheckCircle}
                      label={item.label}
                      value={item.value}
                      color={item.color}
                    />
                  )
                }
                return (
                  <StatCard
                    key={item.label}
                    icon={Icon}
                    label={item.label}
                    value={item.value}
                    color={item.color}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* My Events */}
        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#064f5d]" />
              <h3 className="text-[15px] font-bold text-[#1f2f3a]">My Events</h3>
            </div>
            <Link to="/lecture/hackathons" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#064f5d] hover:underline">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {MOCK_MY_EVENTS.map((ev) => (
              <Link key={ev.id} to={`/lecture/hackathons/${ev.id}`} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#fafbfc]">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#1f2f3a] truncate">{ev.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-[12px] text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" /> {ev.role}
                    </span>
                    <span>{ev.teams} teams</span>
                  </div>
                </div>
                <Badge label={ev.status} className={statusBadge[ev.status] || ''} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Pending Grading */}
          <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-[#e65100]" />
                <h3 className="text-[15px] font-bold text-[#1f2f3a]">Pending Grading</h3>
              </div>
              <Link to="/lecture/submissions" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#064f5d] hover:underline">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#f5f5f5]">
              {MOCK_PENDING_GRADING.map((s) => (
                <Link key={s.id} to={`/lecture/submissions/${s.id}`} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#fafbfc]">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-[#064f5d] truncate">{s.teamName}</p>
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-gray-400">
                      <span>{s.eventName}</span>
                      <span>·</span>
                      <span>{s.roundName}</span>
                    </div>
                  </div>
                  <Badge label="Ready" className="bg-[#fff3e0] text-[#e65100]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
            <div className="border-b border-[#f0f0f0] px-5 py-4">
              <h3 className="text-[15px] font-bold text-[#1f2f3a]">Quick Actions</h3>
            </div>
            <div className="divide-y divide-[#f5f5f5]">
              <Link to="/lecture/hackathons" className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]">
                <Trophy className="h-4 w-4 text-[#1565c0]" /> Browse My Events <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
              <Link to="/lecture/teams" className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]">
                <Users className="h-4 w-4 text-[#2e7d32]" /> View Teams <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
              <Link to="/lecture/leaderboard" className="flex items-center gap-3 px-5 py-3.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#fafbfc]">
                <BarChart3 className="h-4 w-4 text-[#7b1fa2]" /> Leaderboard <ChevronRight className="ml-auto h-4 w-4 text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
