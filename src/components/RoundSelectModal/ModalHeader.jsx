import { X, Layers } from 'lucide-react'

export default function ModalHeader({ selectedRoundId, onClose }) {
  return (
    <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e3f2fd]">
          <Layers className="h-[18px] w-[18px] text-[#1565c0]" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[#1f2f3a]">Select Round</h3>
          <p className="text-[13px] text-gray-400">
            {selectedRoundId
              ? 'Click a row to change selection, or press All Rounds to clear.'
              : 'Choose a round to filter submissions.'}
          </p>
        </div>
      </div>
      <button type="button" onClick={onClose}
        className="ml-4 shrink-0 cursor-pointer rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}
