import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Search, CircleDot, Calendar } from 'lucide-react'
import Badge from '../../../components/Badge'
import FilterBar from '../../../components/FilterBar'
import { formatDateTime } from '../../../utils/format'

const MOCK_EVENTS = [
  { id: '1', name: 'Hackathon AI 2026', role: 'Mentor', status: 'Ongoing', season: 'Summer', startTime: '2026-06-01T00:00:00Z', endTime: '2026-07-01T00:00:00Z', teams: 5 },
  { id: '2', name: 'Cloud Builders Cup 2026', role: 'Judge', status: 'Upcoming', season: 'Fall', startTime: '2026-09-15T00:00:00Z', endTime: '2026-10-15T00:00:00Z', teams: 3 },
  { id: '3', name: 'FinTech Rush 2026', role: 'Judge', status: 'Completed', season: 'Spring', startTime: '2026-03-01T00:00:00Z', endTime: '2026-04-01T00:00:00Z', teams: 8 },
  { id: '4', name: 'Web3 Hackathon 2026', role: 'Mentor', status: 'Ongoing', season: 'Summer', startTime: '2026-05-15T00:00:00Z', endTime: '2026-06-30T00:00:00Z', teams: 4 },
  { id: '5', name: 'IoT Smart City 2026', role: 'Mentor', status: 'Completed', season: 'Spring', startTime: '2026-02-01T00:00:00Z', endTime: '2026-03-15T00:00:00Z', teams: 6 },
]

const statusBadge = {
  Ongoing: 'bg-[#e8f5e9] text-[#2e7d32]',
  Upcoming: 'bg-[#e3f2fd] text-[#1565c0]',
  Completed: 'bg-[#e0f2f1] text-[#00695c]',
}

const eventFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by event name...', className: 'w-full sm:w-[280px]' },
  { type: 'select', key: 'status', label: 'Status', icon: CircleDot, options: [{ value: '', label: 'All Statuses' }, { value: 'Ongoing', label: 'Ongoing' }, { value: 'Upcoming', label: 'Upcoming' }, { value: 'Completed', label: 'Completed' }], className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'fromDate', label: 'From', icon: Calendar, className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'toDate', label: 'To', icon: Calendar, className: 'w-full sm:w-[180px]' },
]

export default function LecturerHackathonsPage() {
  const [filters, setFilters] = useState({ keyword: '', status: '', fromDate: '', toDate: '' })
  const hasActive = Object.values(filters).some(v => v !== '')

  const events = MOCK_EVENTS

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">My Events</h1>
        <p className="mt-1 text-[14px] text-gray-500">Events where you are assigned as Mentor or Judge.</p>
      </div>

      <FilterBar filters={eventFilters} values={filters} onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} onReset={() => setFilters({ keyword: '', status: '', fromDate: '', toDate: '' })} hasActive={hasActive} />

      <div className="mt-5 rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#fafbfc]">
              <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-gray-400">Event</th>
              <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-gray-400">Role</th>
              <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-gray-400">Period</th>
              <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-gray-400">Teams</th>
              <th className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-5 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f5f5]">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-[#fafbfc]">
                <td className="px-5 py-4">
                  <Link to={`/lecture/hackathons/${ev.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{ev.name}</Link>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f2fd] px-2.5 py-0.5 text-[12px] font-semibold text-[#1565c0]">{ev.role}</span>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#1f2f3a]">{formatDateTime(ev.startTime)}</td>
                <td className="px-5 py-4 text-[13px] text-[#1f2f3a]">{ev.teams}</td>
                <td className="px-5 py-4"><Badge label={ev.status} className={statusBadge[ev.status] || ''} /></td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/lecture/hackathons/${ev.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"><Trophy className="h-3.5 w-3.5" /> View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
