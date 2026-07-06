export default function Badge({ label, className }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className || ''}`}>
      {label}
    </span>
  )
}
