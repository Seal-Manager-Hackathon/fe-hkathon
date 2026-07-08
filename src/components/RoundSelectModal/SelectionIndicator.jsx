import { Check } from 'lucide-react'

export default function SelectionIndicator({ items, pendingId, currentId }) {
  if (!currentId && pendingId === null) return null

  const selectedItem = pendingId
    ? items.find((r) => r.id === pendingId)
    : items.find((r) => r.id === currentId)

  const label = pendingId
    ? `Selected: ${selectedItem?.name || '...'}`
    : `Current: ${selectedItem?.name || '...'}`

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#e3f2fd] px-4 py-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#064f5d]">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </div>
      <span className="text-[13px] font-semibold text-[#064f5d]">{label}</span>
      <span className="text-[12px] text-[#1565c0]">— Click Confirm to apply</span>
    </div>
  )
}
