import { X, UserCog } from 'lucide-react'
import Avatar from '../../../components/Avatar'

export default function ChangeLeaderModal({ open, members, onClose, onSelect }) {
  if (!open || !members) return null
  const nonLeaders = members.filter((m) => !m.isLeader)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f2fd]"><UserCog className="h-5 w-5 text-[#1565c0]" /></div><h3 className="text-[16px] font-bold text-[#1f2f3a]">Change Team Leader</h3></div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-[13px] text-[#5a6a73]">Select a member to become the new team leader:</p>
          {nonLeaders.length === 0 ? (
            <p className="text-[13px] text-[#7a8e99]">No other members to transfer leadership to.</p>
          ) : (
            nonLeaders.map((m) => (
              <button key={m.userId} type="button" onClick={() => onSelect(m.userId)} className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#d7e0e5] bg-white px-4 py-3 text-left transition-all hover:border-[#1565c0]/30 hover:bg-[#f0f7ff] hover:shadow-sm">
                <Avatar src={m.avatarUrl} name={`${m.firstName} ${m.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{m.firstName} {m.lastName}</p>
                  <p className="truncate text-[12px] text-[#8a9ba6]">{m.email}</p>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-[#1565c0]">Select &rarr;</span>
              </button>
            ))
          )}
          <div className="flex justify-end pt-2"><button onClick={onClose} className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1f2f3a] hover:bg-gray-50">Cancel</button></div>
        </div>
      </div>
    </div>
  )
}
