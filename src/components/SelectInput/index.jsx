import { ChevronDown } from 'lucide-react'

export default function SelectInput({
  label,
  icon: Icon,
  options = [],
  value,
  onChange,
  className = '',
  selectClassName = '',
}) {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {Icon && <Icon className="h-3 w-3" />}
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full cursor-pointer appearance-none rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-10 text-[14px] text-[#1f2f3a] outline-none transition-colors focus:border-[#064f5d] ${selectClassName}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}