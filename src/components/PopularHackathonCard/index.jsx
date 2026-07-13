import { Link } from 'react-router-dom'
import { Calendar, Layers } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'

const THEME_ACCENTS = {
  blue: { thumb: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  emerald: { thumb: 'bg-gradient-to-br from-emerald-500 to-emerald-700' },
  violet: { thumb: 'bg-gradient-to-br from-violet-500 to-violet-700' },
  rose: { thumb: 'bg-gradient-to-br from-rose-400 to-rose-600' },
  amber: { thumb: 'bg-gradient-to-br from-amber-400 to-amber-600' },
  teal: { thumb: 'bg-gradient-to-br from-teal-500 to-teal-700' },
  indigo: { thumb: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
  orange: { thumb: 'bg-gradient-to-br from-orange-400 to-orange-600' },
  green: { thumb: 'bg-gradient-to-br from-green-500 to-green-700' },
  cyan: { thumb: 'bg-gradient-to-br from-cyan-400 to-cyan-600' },
  slate: { thumb: 'bg-gradient-to-br from-slate-500 to-slate-700' },
  sky: { thumb: 'bg-gradient-to-br from-sky-400 to-sky-600' },
}

const STATUS_CONFIG = {
  Published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' },
  Closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60' },
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getRelativeTime(startTime, endTime) {
  const now = Date.now()
  const start = startTime ? new Date(startTime).getTime() : null
  const end = endTime ? new Date(endTime).getTime() : null

  if (start && now < start) {
    const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Starts today!', urgent: true }
    if (days === 1) return { label: 'Starts tomorrow', urgent: true }
    if (days <= 7) return { label: `Starts in ${days} days`, urgent: true }
    return { label: `Starts in ${days} days`, urgent: false }
  }
  if (end && now > end) {
    const days = Math.floor((now - end) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Ended today', urgent: false }
    if (days === 1) return { label: 'Ended yesterday', urgent: false }
    return { label: `Ended ${days} days ago`, urgent: false }
  }
  if (end) {
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Last day!', urgent: true }
    if (days === 1) return { label: '1 day left', urgent: true }
    if (days <= 7) return { label: `${days} days left`, urgent: true }
    return { label: `${days} days left`, urgent: false }
  }
  return null
}

export default function PopularHackathonCard({ hackathon }) {
  const accent = THEME_ACCENTS[hackathon.themeColor] || THEME_ACCENTS.blue
  const statusCfg = STATUS_CONFIG[hackathon.status] || STATUS_CONFIG.Closed
  const relative = getRelativeTime(hackathon.startTime, hackathon.endTime)
  const initials = getInitials(hackathon.name)
  return (
    <Link
      to={`/hackathons/${hackathon.id}`}
      className="group flex cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative flex w-[100px] shrink-0 items-center justify-center overflow-hidden sm:w-[110px]',
          accent.thumb
        )}
      >
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/8" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/5" />
        <span className="relative z-10 select-none text-[22px] font-bold leading-none tracking-wide text-white/90 drop-shadow-sm">
          {initials}
        </span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0 flex-1">
          {/* Badge + time */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', statusCfg.cls)}>
              {statusCfg.label}
            </span>
            {relative && (
              <span className={cn('inline-flex items-center gap-1 text-[11px]', relative.urgent ? 'font-semibold text-rose-500' : 'text-[#8a9ba6]')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', relative.urgent ? 'bg-rose-400' : 'bg-[#c8d4dc]')} />
                {relative.label}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="truncate text-[15px] font-bold text-[#1f2f3a] leading-snug group-hover:text-[#064f5d] transition-colors">
            {hackathon.name}
          </h3>

          {/* Metadata */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[#6a7e8b]">
            {(hackathon.startTime || hackathon.endTime) && (
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} className="shrink-0" />
                {hackathon.startTime && <span>{formatDate(hackathon.startTime)}</span>}
                {hackathon.startTime && hackathon.endTime && <span className="text-[#c8d4dc]">–</span>}
                {hackathon.endTime && <span>{formatDate(hackathon.endTime)}</span>}
              </span>
            )}
            {hackathon.numberRound != null && (
              <span className="inline-flex items-center gap-1">
                <Layers size={12} className="shrink-0" />
                {hackathon.numberRound} {hackathon.numberRound === 1 ? 'Round' : 'Rounds'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
