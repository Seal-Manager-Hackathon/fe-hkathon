import { Check } from 'lucide-react'

export default function RadioCell({ isSelected }) {
  return (
    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
      isSelected
        ? 'border-[#064f5d] bg-[#064f5d] shadow-sm'
        : 'border-[#d0d5dd] group-hover:border-[#064f5d]'
    }`}>
      {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </div>
  )
}
