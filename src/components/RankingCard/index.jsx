import RankBadge from '../RankBadge'

export default function RankingCard({ team }) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e8ecf0] bg-white px-4 py-3 transition-shadow hover:shadow-sm">
      <RankBadge rank={team.rank} />
      <div className="flex-1 min-w-0">
        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{team.name}</p>
        <p className="text-xs text-gray-400">{team.events} event{team.events !== 1 ? 's' : ''}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-[#1f2f3a]">{team.points}</p>
        <p className="text-xs font-medium text-gray-400">PTS</p>
      </div>
    </div>
  )
}
