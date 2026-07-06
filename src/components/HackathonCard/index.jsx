import { cn } from '../../utils/cn'

export default function HackathonCard({ hackathon }) {
  const isEnded = hackathon.status === 'ended'
  const statusLabel = isEnded ? 'Ended' : (hackathon.timeLeft ?? 'Active')

  return (
    <div className="flex h-[82px] cursor-pointer overflow-hidden rounded-lg border border-[#d8e0e6] bg-white transition-shadow hover:shadow-sm">
      <div
        className="flex w-[105px] shrink-0 items-center justify-center"
        style={{ backgroundColor: hackathon.thumbnailColor }}
      >
        <div className="h-8 w-8 rounded bg-white/20" />
      </div>
      <div className="flex flex-1 items-center justify-between px-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#1f2f3a]">{hackathon.name}</p>
        </div>
        <span
          className={cn(
            'ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
            isEnded
              ? 'bg-[#e0f2f1] text-[#00695c]'
              : 'bg-[#e3f2fd] text-[#1565c0]'
          )}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  )
}
