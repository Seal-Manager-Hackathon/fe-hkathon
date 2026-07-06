import { cn } from '../../utils/cn'

export default function PopularHackathonCard({ hackathon }) {
  const isEnded = hackathon.status === 'ended'
  const statusLabel = isEnded ? 'Ended' : (hackathon.timeLeft ?? 'Active')
  const labelBg = hackathon.label === 'ACTIVE' ? 'bg-[#ffca28]' : 'bg-[#5b8def]'

  return (
    <div className="flex cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          'flex w-[42px] shrink-0 items-center justify-center',
          labelBg
        )}
      >
        <span
          className={cn(
            'text-[11px] font-extrabold tracking-wider [writing-mode:vertical-rl]',
            hackathon.label === 'ACTIVE' ? 'text-[#064f5d]' : 'text-white'
          )}
        >
          {hackathon.label}
        </span>
      </div>

      <div
        className="flex w-[120px] shrink-0 items-center justify-center"
        style={{ backgroundColor: hackathon.thumbnailColor }}
      >
        <div className="h-10 w-10 rounded-lg bg-white/20" />
      </div>

      <div className="flex flex-1 items-center justify-between px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#1f2f3a]">{hackathon.name}</p>
          <p className="mt-1 text-[13px] text-gray-400">
            {hackathon.participants} participants · {hackathon.teams} teams
          </p>
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
