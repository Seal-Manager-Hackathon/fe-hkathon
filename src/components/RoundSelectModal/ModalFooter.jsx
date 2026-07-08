import { Layers, Check } from 'lucide-react'

export default function ModalFooter({ selectedRoundId, pendingId, items, onSelectAll, onCancel, onConfirm }) {
  const isAllActive = !selectedRoundId && pendingId === null
  const canConfirm = pendingId !== null || !!selectedRoundId

  return (
    <div className="shrink-0 flex items-center justify-between border-t border-[#f0f0f0] px-6 py-4 bg-[#fafbfc]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSelectAll}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition-all ${
            isAllActive
              ? 'border-[#064f5d] bg-[#064f5d] text-white shadow-sm'
              : 'border-[#d8e0e6] bg-white text-[#5c6b7a] hover:border-[#064f5d] hover:text-[#064f5d]'
          }`}
        >
          <Layers className="h-4 w-4" /> All Rounds
        </button>
        <span className="text-[13px] text-gray-400 hidden sm:inline">Show submissions from all rounds</span>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel}
          className="inline-flex cursor-pointer items-center rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={!canConfirm}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-all ${
            canConfirm
              ? 'bg-[#064f5d] text-white hover:bg-[#05404a] shadow-sm'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
        >
          <Check className="h-4 w-4" /> Confirm
        </button>
      </div>
    </div>
  )
}
