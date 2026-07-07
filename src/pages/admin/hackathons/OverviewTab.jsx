import { Calendar, Clock, Users, Hash, Flag, UserPlus, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/Badge'
import RichTextViewer from '../../../components/RichTextViewer'
import { formatDateTime } from '../../../utils/format'

export const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function OverviewTab({ event }) {
  const cards = [
    { label: 'Season', value: event.season || '—', icon: <Flag className="h-5 w-5 text-[#ef6c00]" />, bg: 'bg-orange-50' },
    { label: 'Start Time', value: formatDateTime(event.startTime), icon: <Calendar className="h-5 w-5 text-[#1565c0]" />, bg: 'bg-blue-50' },
    { label: 'End Time', value: formatDateTime(event.endTime), icon: <Calendar className="h-5 w-5 text-[#c62828]" />, bg: 'bg-red-50' },
    { label: 'Reg Deadline', value: event.registerLimitTime ? formatDateTime(event.registerLimitTime) : '—', icon: <Clock className="h-5 w-5 text-[#e65100]" />, bg: 'bg-orange-50' },
    { label: 'Max Teams', value: event.limitTeam ?? '—', icon: <Users className="h-5 w-5 text-[#2e7d32]" />, bg: 'bg-green-50' },
    { label: 'Min Members', value: event.minMember ?? '—', icon: <UserPlus className="h-5 w-5 text-[#6a1b9a]" />, bg: 'bg-purple-50' },
    { label: 'Max Members', value: event.maxMember ?? '—', icon: <UserPlus className="h-5 w-5 text-[#6a1b9a]" />, bg: 'bg-purple-50' },
    { label: 'Rounds', value: event.numberRound ?? 0, icon: <Hash className="h-5 w-5 text-[#37474f]" />, bg: 'bg-gray-100' },
    { label: 'Created', value: formatDateTime(event.createdAt), icon: <Clock className="h-5 w-5 text-[#546e7a]" />, bg: 'bg-gray-50' },
    { label: 'Updated', value: formatDateTime(event.updatedAt), icon: <Clock className="h-5 w-5 text-[#546e7a]" />, bg: 'bg-gray-50' },
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
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{event.season ? `${event.season} · ` : ''}{formatDateTime(event.startTime)} – {formatDateTime(event.endTime)}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event.limitTeam ?? '—'} teams</span>
          </div>
        </div>
        <Link to={`/admin/hackathons/${event.id}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Edit className="h-4 w-4" />Edit Hackathon
        </Link>
      </div>

      <h3 className="mb-4 text-[15px] font-bold text-[#1f2f3a]">Event Information</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map((c, i) => (
          <div key={i} className={`rounded-xl border border-[#e8ecf0] ${c.bg} p-4 flex flex-col gap-2`}>
            <div className="flex items-center gap-2">
              {c.icon}
              <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="text-[16px] font-bold text-[#1f2f3a]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h3>
        </div>
        <div className="px-5 py-5">
          <RichTextViewer content={event.description} />
        </div>
      </div>
    </>
  )
}
