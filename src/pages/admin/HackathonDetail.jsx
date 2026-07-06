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

const TABS = ['Overview', 'Rounds', 'Tracks & Topics', 'Teams']

export default function HackathonDetail() {
  const { id } = useParams()
  const [tab, setTab] = useState('Overview')

  const hackathon = allHackathons.find((h) => h.id === id)
  if (!hackathon) {
    return <NotFoundState entity="Hackathon" fallbackTo="/admin/hackathons" />
  }

  const rounds = hackathonRounds[id] || []
  const tracks = hackathonTracks[id] || []
  const teams = hackathonTeams[id] || []

  return (
    <div className="px-8 py-8">
      <BackButton fallback="/admin/hackathons" label="Back to Hackathons" />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-[#1f2f3a]">{hackathon.name}</h1>
            <Badge label={hackathon.status} className={statusBadge[hackathon.status]} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
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
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <Edit className="h-4 w-4" />
          Edit Hackathon
        </Link>
      </div>

      <div className="mb-6 flex gap-1 border-b border-[#e8ecf0]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer px-5 py-3 text-[14px] font-semibold transition-colors ${
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
      {tab === 'Teams' && <TeamsTab teams={teams} />}
    </div>
  )
}
