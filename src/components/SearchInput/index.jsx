import { Hash, Search } from 'lucide-react'

export default function SearchInput({
  className = '',
  inputClassName = '',
  label,
  icon: LabelIcon,
  ...props
}) {
  const isNumber = props.type === 'number'
  const InputIcon = LabelIcon || (isNumber ? Hash : Search)

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {LabelIcon && <LabelIcon className="h-3 w-3" />}
          {label}
        </label>
      )}
      <div className="relative">
        <InputIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type={isNumber ? 'number' : 'text'}
          className={`w-full rounded-lg border border-[#d8e0e6] py-2.5 pl-10 pr-4 text-[14px] text-[#1f2f3a] placeholder-gray-400 outline-none transition-colors focus:border-[#064f5d] ${inputClassName}`}
          {...props}
        />
      </div>
    </div>
  )
}
