import { Layers, ChevronDown } from 'lucide-react'

const S = {
  roundBtn:
    'group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none',
}

export default function RoundPickerButton({ name, onClick }) {
  return (
    <div className="relative w-full sm:w-[200px]">
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <Layers className="h-3 w-3" /> Round
      </label>
      <button type="button" onClick={onClick} className={S.roundBtn}>
        <span className={name ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
          {name || 'All Rounds'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
      </button>
    </div>
  )
}
