import { Link } from 'react-router-dom'
import { Calendar, Clock, Flag, Users, Hash } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

function R({ icon, label, value, cls = '', mono = false }) {
  return (
    <p className="flex items-center gap-2 text-[13px]">
      {icon}
      <span className="text-gray-400">{label}</span>
      <span className={`ml-auto font-semibold ${cls} ${mono ? 'text-[12px] font-medium' : ''}`}>
        {value}
      </span>
    </p>
  )
}

export default function EventInfoCard({ event, detailLinkPrefix = '/admin' }) {
  if (!event) {
    return (
      <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
          <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#80deea]" /> Event Info
          </h4>
        </div>
        <div className="px-5 py-6 flex items-center justify-center">
          <p className="text-[13px] text-gray-400">Event information not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#80deea]" /> Event Info
        </h4>
      </div>
      <div className="divide-y divide-[#f5f5f5]">
        <div className="px-5 py-3.5">
          <Link to={`${detailLinkPrefix}/hackathons/${event.id}`} className="text-[14px] font-bold text-[#064f5d] leading-snug hover:underline">
            {event.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
        </div>
        <div className="px-5 py-3 space-y-2">
          <R icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season || '—'} cls="text-[#ef6c00]" />
          <R icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDateTime(event.startTime)} mono />
          <R icon={<Clock className="h-3.5 w-3.5 text-[#e65100]" />} label="Reg Deadline" value={event.registerLimitTime ? formatDateTime(event.registerLimitTime) : '—'} mono />
          <R icon={<Clock className="h-3.5 w-3.5 text-[#c62828]" />} label="End" value={formatDateTime(event.endTime)} mono />
          <R icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Teams" value={event.limitTeam ?? '—'} cls="text-[#2e7d32]" />
          <R icon={<Users className="h-3.5 w-3.5 text-[#6a1b9a]" />} label="Members" value={`${event.minMember ?? '—'} – ${event.maxMember ?? '—'}`} cls="text-[#6a1b9a]" />
          <R icon={<Hash className="h-3.5 w-3.5 text-[#37474f]" />} label="Rounds" value={event.numberRound ?? 0} cls="text-[#37474f]" />
        </div>
      </div>
    </div>
  )
}
