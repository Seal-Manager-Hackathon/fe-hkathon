/**
 * Styled date input for filter bars. Matches SelectInput look & feel.
 */
export default function DateInput({ label, icon: Icon, value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {Icon && <Icon className="h-3 w-3" />}
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-4 text-[14px] text-[#1f2f3a] outline-none transition-colors focus:border-[#064f5d]"
      />
    </div>
  )
}
