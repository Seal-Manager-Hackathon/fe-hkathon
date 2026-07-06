export default function DetailField({ label, children, className }) {
  return (
    <div className={`rounded-lg p-3.5 ${className || 'bg-white'}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  )
}
