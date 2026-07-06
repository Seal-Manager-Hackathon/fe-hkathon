import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, MapPin, DollarSign, Users } from 'lucide-react'
import { allHackathons, statusBadge, hackathonRounds, hackathonTracks, hackathonTeams } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import OverviewTab from './hackathon-detail/OverviewTab'
import RoundsTab from './hackathon-detail/RoundsTab'
import TracksTopicsTab from './hackathon-detail/TracksTopicsTab'
import TeamsTab from './hackathon-detail/TeamsTab'

const TABS = ['Overview', 'Rounds', 'Tracks & Topics', 'Registered Teams']

const ROUND_NAMES = ['Qualification Round', 'Semi-Final', 'Final Round']
const STATUSES = ['Completed', 'Active', 'Upcoming']

const TRACK_TEMPLATES = [
  { name: 'Core Track', topics: ['Main Challenge', 'Innovation Sprint'] },
  { name: 'Special Topic', topics: ['Industry Focus', 'Social Impact'] },
]

function generateRounds(hackathon) {
  const baseTeams = hackathon.teams || 8
  return ROUND_NAMES.map((name, i) => ({
    id: `gen-r${i + 1}`,
    name,
    startDate: hackathon.date,
    endDate: hackathon.date,
    status: STATUSES[i],
    teams: i === 0 ? baseTeams * 3 : i === 1 ? Math.round(baseTeams * 1.5) : baseTeams,
  }))
}

function generateTracks(hackathon) {
  return TRACK_TEMPLATES.map((t, ti) => ({
    id: `gen-t${ti + 1}`,
    name: t.name,
    topics: t.topics.map((tp, tpi) => ({
      id: `gen-tp${ti + 1}-${tpi + 1}`,
      name: tp,
      teams: Math.max(1, Math.round((hackathon.teams || 4) / (ti + tpi + 1))),
    })),
  }))
}

function generateTeams(hackathon) {
  const count = hackathon.teams || 4
  const leaderNames = ['Alex Johnson', 'Maria Chen', 'David Kim', 'Sarah Wilson', 'James Brown', 'Emily Davis', 'Michael Lee', 'Lisa Wang', 'Thomas Nguyen', 'Anna Martinez', 'Grace Hopper', 'Kevin Tran']
  return Array.from({ length: count }, (_, i) => ({
    id: `gen-tm${i + 1}`,
    name: `Team ${String.fromCharCode(65 + i)}`,
    leader: leaderNames[i % leaderNames.length],
    members: Math.max(2, Math.ceil(Math.random() * 4) + 1),
    registered: hackathon.date,
    status: i < Math.ceil(count * 0.6) ? 'Confirmed' : i < Math.ceil(count * 0.85) ? 'Pending' : 'Rejected',
  }))
}

export default function HackathonDetail() {
  const { id } = useParams()
  const [tab, setTab] = useState('Overview')

  const hackathon = allHackathons.find((h) => h.id === id)
  if (!hackathon) {
    return <NotFoundState entity="Hackathon" fallbackTo="/admin/hackathons" />
  }

  const rounds = hackathonRounds[id] || generateRounds(hackathon)
  const tracks = hackathonTracks[id] || generateTracks(hackathon)
  const teams = hackathonTeams[id] || generateTeams(hackathon)

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback="/admin/hackathons" label="Back to Hackathons" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{hackathon.name}</h1>
            <Badge label={hackathon.status} className={statusBadge[hackathon.status]} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] sm:text-[13px] text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {hackathon.season} · {hackathon.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {hackathon.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> {hackathon.prize}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {teams.length} teams
            </span>
          </div>
        </div>
        <Link
          to={`/admin/hackathons/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Hackathon
        </Link>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer shrink-0 px-4 py-3 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[14px] ${
              tab === t
                ? 'border-b-2 border-[#064f5d] text-[#064f5d]'
                : 'text-gray-400 hover:text-[#1f2f3a]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab hackathon={hackathon} />}
      {tab === 'Rounds' && <RoundsTab rounds={rounds} />}
      {tab === 'Tracks & Topics' && <TracksTopicsTab tracks={tracks} />}
      {tab === 'Registered Teams' && <TeamsTab teams={teams} />}
    </div>
  )
}
