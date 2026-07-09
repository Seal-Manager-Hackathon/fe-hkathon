import { cn } from '../../../../utils/cn'

/**
 * Reusable section header with icon + title + optional subtitle.
 */
export default function SectionHeader({ icon: Icon, iconBg, iconColor, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#f0f0f0] px-5 py-4">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', iconBg, iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold text-[#1f2f3a] truncate">{title}</h3>
        {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}
