import { cn } from '../../utils/cn'

/**
 * Single label/value detail row used across detail/profile pages.
 * @param {string} label      - row label
 * @param {string} children   - value content
 * @param {string} labelWidth - default "w-[120px]"
 */
export default function InfoRow({ label, children, labelWidth = 'w-[120px]', className, icon: Icon }) {
  return (
    <div className={cn('flex items-start gap-6 px-5 py-4', className)}>
      <span className={cn('shrink-0 text-[13px] font-semibold text-gray-400', labelWidth)}>
        {Icon && <Icon className="inline h-3.5 w-3.5 mr-1" />}
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}