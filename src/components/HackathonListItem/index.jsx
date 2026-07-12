import { MapPin, Globe, Monitor, Layers, CalendarClock } from 'lucide-react';
import { cn } from '../../utils/cn';

const THEME_GRADIENTS = {
  blue: 'from-blue-600 to-blue-800',
  emerald: 'from-emerald-600 to-emerald-800',
  violet: 'from-violet-600 to-violet-800',
  rose: 'from-rose-500 to-rose-700',
  amber: 'from-amber-500 to-amber-700',
  teal: 'from-teal-600 to-teal-800',
  indigo: 'from-indigo-600 to-indigo-800',
  orange: 'from-orange-500 to-orange-700',
  green: 'from-green-600 to-green-800',
  cyan: 'from-cyan-600 to-cyan-800',
  slate: 'from-slate-600 to-slate-800',
  sky: 'from-sky-600 to-sky-800',
};

const STATUS_CONFIG = {
  published: { label: 'Upcoming', className: 'bg-blue-50 text-blue-700' },
  ongoing: { label: 'Ongoing', className: 'bg-emerald-50 text-emerald-700' },
  closed: { label: 'Ended', className: 'bg-slate-100 text-slate-500' },
};

const MODE_ICON = {
  online: { icon: Globe, label: 'Online' },
  offline: { icon: Monitor, label: 'Offline' },
  hybrid: { icon: MapPin, label: 'Hybrid' },
};

export default function HackathonListItem({ hackathon }) {
  const gradient = THEME_GRADIENTS[hackathon.themeColor] || THEME_GRADIENTS.blue;
  const statusCfg = STATUS_CONFIG[hackathon.status] || STATUS_CONFIG.closed;
  const modeCfg = MODE_ICON[hackathon.mode] || MODE_ICON.online;
  const ModeIcon = modeCfg.icon;

  return (
    <div
      className={cn(
        'group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#d8e0e6] bg-white',
        'transition-all duration-200 cursor-pointer',
        'hover:border-[#064f5d]/30 hover:shadow-[0_4px_20px_rgba(6,79,93,0.08)]'
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'sm:w-[120px] sm:min-h-[120px] h-[100px] shrink-0 bg-gradient-to-br flex items-center justify-center px-3 py-3',
          gradient
        )}
      >
        <p className="text-white text-sm font-semibold leading-snug text-center line-clamp-2 drop-shadow-sm">
          {hackathon.shortName}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 px-4 py-3 sm:px-5 sm:py-0 min-w-0">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-[#1f2f3a] leading-tight group-hover:text-[#064f5d] transition-colors">
          {hackathon.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#5a6a73] leading-relaxed line-clamp-1">
          {hackathon.description}
        </p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1">
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', statusCfg.className)}>
            {statusCfg.label}
          </span>

          {hackathon.mode && (
            <span className="inline-flex items-center gap-1 text-[12px] text-[#5a6a73]">
              <ModeIcon size={13} />
              {modeCfg.label}
            </span>
          )}

          {hackathon.rounds != null && (
            <span className="inline-flex items-center gap-1 text-[12px] text-[#5a6a73]">
              <Layers size={13} />
              {hackathon.rounds} {hackathon.rounds === 1 ? 'round' : 'rounds'}
            </span>
          )}

          {hackathon.remainingText && (
            <span className="inline-flex items-center gap-1 text-[12px] text-[#5a6a73]">
              <CalendarClock size={13} />
              {hackathon.remainingText}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex sm:flex-col items-center sm:justify-center px-4 pb-3 sm:pb-0 sm:pr-5 sm:pl-0 shrink-0">
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center rounded-xl px-4 py-2 text-[13px] font-semibold cursor-pointer',
            'transition-all duration-200 whitespace-nowrap',
            'border border-[#064f5d] text-[#064f5d] bg-white hover:bg-[#064f5d] hover:text-white',
            'shadow-[0_1px_3px_rgba(6,79,93,0.08)] hover:shadow-[0_3px_12px_rgba(6,79,93,0.18)]'
          )}
        >
          View details
        </button>
      </div>
    </div>
  );
}
