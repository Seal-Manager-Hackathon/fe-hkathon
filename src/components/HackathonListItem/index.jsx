import { Link } from 'react-router-dom'
import { Calendar, Layers, Users, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate } from '../../utils/format'

const THEME_ACCENTS = {
  blue: { from: 'from-blue-600', to: 'to-blue-800', thumb: 'bg-gradient-to-br from-blue-500 to-blue-700', dot: 'bg-blue-500', ring: 'ring-blue-100', text: 'text-blue-600' },
  emerald: { from: 'from-emerald-500', to: 'to-emerald-700', thumb: 'bg-gradient-to-br from-emerald-500 to-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-100', text: 'text-emerald-600' },
  violet: { from: 'from-violet-500', to: 'to-violet-700', thumb: 'bg-gradient-to-br from-violet-500 to-violet-700', dot: 'bg-violet-500', ring: 'ring-violet-100', text: 'text-violet-600' },
  rose: { from: 'from-rose-400', to: 'to-rose-600', thumb: 'bg-gradient-to-br from-rose-400 to-rose-600', dot: 'bg-rose-500', ring: 'ring-rose-100', text: 'text-rose-500' },
  amber: { from: 'from-amber-400', to: 'to-amber-600', thumb: 'bg-gradient-to-br from-amber-400 to-amber-600', dot: 'bg-amber-500', ring: 'ring-amber-100', text: 'text-amber-600' },
  teal: { from: 'from-teal-500', to: 'to-teal-700', thumb: 'bg-gradient-to-br from-teal-500 to-teal-700', dot: 'bg-teal-500', ring: 'ring-teal-100', text: 'text-teal-600' },
  indigo: { from: 'from-indigo-500', to: 'to-indigo-700', thumb: 'bg-gradient-to-br from-indigo-500 to-indigo-700', dot: 'bg-indigo-500', ring: 'ring-indigo-100', text: 'text-indigo-600' },
  orange: { from: 'from-orange-400', to: 'to-orange-600', thumb: 'bg-gradient-to-br from-orange-400 to-orange-600', dot: 'bg-orange-500', ring: 'ring-orange-100', text: 'text-orange-600' },
  green: { from: 'from-green-500', to: 'to-green-700', thumb: 'bg-gradient-to-br from-green-500 to-green-700', dot: 'bg-green-500', ring: 'ring-green-100', text: 'text-green-600' },
  cyan: { from: 'from-cyan-400', to: 'to-cyan-600', thumb: 'bg-gradient-to-br from-cyan-400 to-cyan-600', dot: 'bg-cyan-500', ring: 'ring-cyan-100', text: 'text-cyan-600' },
  slate: { from: 'from-slate-500', to: 'to-slate-700', thumb: 'bg-gradient-to-br from-slate-500 to-slate-700', dot: 'bg-slate-500', ring: 'ring-slate-100', text: 'text-slate-600' },
  sky: { from: 'from-sky-400', to: 'to-sky-600', thumb: 'bg-gradient-to-br from-sky-400 to-sky-600', dot: 'bg-sky-500', ring: 'ring-sky-100', text: 'text-sky-600' },
}

const STATUS_CONFIG = {
  Published: { label: 'Published', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' },
  Closed: { label: 'Closed', className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60' },
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
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

export default function HackathonListItem({ hackathon, to }) {
  const accent = THEME_ACCENTS[hackathon.themeColor] || THEME_ACCENTS.blue
  const statusCfg = STATUS_CONFIG[hackathon.status] || STATUS_CONFIG.Closed
  const relative = getRelativeTime(hackathon.startTime, hackathon.endTime)
  const initials = getInitials(hackathon.title)

  return (
    <Link
      to={to || '#'}
      className={cn(
        'group relative flex flex-row overflow-hidden rounded-2xl bg-white',
        'border border-[#e9eef2] transition-all duration-300',
        'hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(6,79,93,0.12)] hover:border-[#064f5d]/25'
      )}
    >
      {/* Left — gradient thumbnail with initials */}
      <div
        className={cn(
          'relative flex w-[120px] shrink-0 items-center justify-center overflow-hidden',
          'sm:w-[140px]',
          accent.thumb
        )}
      >
        {/* Decorative circles */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/8" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/6" />

        {/* Initials */}
        <span className="relative z-10 select-none text-[28px] font-bold leading-none tracking-wide text-white/90 drop-shadow-sm sm:text-[32px]">
          {initials}
        </span>
      </div>

      {/* Right — content */}
      <div className="flex min-w-0 flex-1 items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
        {/* Content area */}
        <div className="min-w-0 flex-1">
          {/* Badge row */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', statusCfg.className)}>
              {statusCfg.label}
            </span>
            {relative && (
              <span className={cn('inline-flex items-center gap-1.5 text-[12px]', relative.urgent ? 'font-semibold text-rose-500' : 'text-[#8a9ba6]')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', relative.urgent ? 'bg-rose-400' : 'bg-[#c8d4dc]')} />
                {relative.label}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={cn(
            'text-[17px] font-bold text-[#1a2b36] leading-snug sm:text-[19px]',
            'group-hover:text-[#064f5d] transition-colors duration-200'
          )}>
            {hackathon.title}
          </h3>

          {/* Metadata */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1">
            {(hackathon.startTime || hackathon.endTime) && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6a7e8b]">
                <Calendar size={14} className="shrink-0" />
                {hackathon.startTime && <span>{formatDate(hackathon.startTime)}</span>}
                {hackathon.startTime && hackathon.endTime && <span className="text-[#c8d4dc]">–</span>}
                {hackathon.endTime && <span>{formatDate(hackathon.endTime)}</span>}
              </span>
            )}

            {hackathon.rounds != null && (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-[#d5e0e7] sm:inline-block" />
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6a7e8b]">
                  <Layers size={14} className="shrink-0" />
                  {hackathon.rounds} {hackathon.rounds === 1 ? 'Round' : 'Rounds'}
                </span>
              </>
            )}

            {hackathon.mode && (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-[#d5e0e7] sm:inline-block" />
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6a7e8b]">
                  <Users size={14} className="shrink-0" />
                  {hackathon.mode.charAt(0).toUpperCase() + hackathon.mode.slice(1)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* CTA arrow */}
        <div className="shrink-0">
          <span className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200',
            'border border-[#e4eaef] bg-white text-[#6a7e8b]',
            'group-hover:border-[#064f5d] group-hover:bg-[#064f5d] group-hover:text-white',
            'group-hover:shadow-[0_4px_12px_rgba(6,79,93,0.25)]'
          )}>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
