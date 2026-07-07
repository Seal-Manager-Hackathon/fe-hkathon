import { Calendar, Clock, Users, Hash, Flag, UserPlus, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../components/Badge'
import { formatDate } from '../../utils/format'

export const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function OverviewTab({ event }) {
  const rows = [
    { label: 'Season', value: event.season || '—', icon: <Flag className="h-4 w-4 text-[#ef6c00]" /> },
    { label: 'Start Time', value: formatDate(event.startTime), icon: <Calendar className="h-4 w-4 text-[#1565c0]" /> },
    { label: 'End Time', value: formatDate(event.endTime), icon: <Calendar className="h-4 w-4 text-[#c62828]" /> },
    { label: 'Registration Deadline', value: event.registerLimitTime ? formatDate(event.registerLimitTime) : '—', icon: <Clock className="h-4 w-4 text-[#e65100]" /> },
    { label: 'Max Teams', value: event.limitTeam ?? '—', icon: <Users className="h-4 w-4 text-[#2e7d32]" /> },
    { label: 'Min Members', value: event.minMember ?? '—', icon: <UserPlus className="h-4 w-4 text-[#6a1b9a]" /> },
    { label: 'Max Members', value: event.maxMember ?? '—', icon: <UserPlus className="h-4 w-4 text-[#6a1b9a]" /> },
    { label: 'Number of Rounds', value: event.numberRound ?? 0, icon: <Hash className="h-4 w-4 text-[#37474f]" /> },
    { label: 'Created', value: formatDate(event.createdAt), icon: <Clock className="h-4 w-4 text-[#546e7a]" /> },
    { label: 'Last Updated', value: formatDate(event.updatedAt), icon: <Clock className="h-4 w-4 text-[#546e7a]" /> },
  ]
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{event.name}</h1>
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] sm:text-[13px] text-gray-400">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{event.season ? `${event.season} · ` : ''}{formatDate(event.startTime)} – {formatDate(event.endTime)}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event.limitTeam ?? '—'} teams</span>
          </div>
        </div>
        <Link to={`/admin/hackathons/${event.id}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Edit className="h-4 w-4" />Edit Hackathon
        </Link>
      </div>
      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4"><h3 className="text-[15px] font-bold text-white">Event Information</h3></div>
      <div className="divide-y divide-[#f5f5f5]">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center px-5 ${row.full ? 'flex-col items-start py-3' : 'justify-between py-3'}`}>
            <span className={`text-[13px] text-gray-400 flex items-center gap-2 ${row.full ? 'mb-1 w-full' : ''}`}>
              {row.icon}
              {row.label}
            </span>
            {row.badge ? <Badge label={row.badge} className={row.badgeClass} /> : <span className={`text-[14px] font-medium text-[#1f2f3a] ${row.full ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{row.value}</span>}
          </div>
        ))}
      </div>
    </div>
    </>
  )
}