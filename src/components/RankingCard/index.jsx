import { Medal } from 'lucide-react'

function RankBadge({ rank }) {
  if (rank === 1) {
    return <Medal className="h-6 w-6 text-[#ffca28]" fill="#ffca28" fillOpacity={0.3} />
  }
  if (rank === 2) {
    return <Medal className="h-6 w-6 text-[#b0bec5]" fill="#b0bec5" fillOpacity={0.3} />
  }
  if (rank === 3) {
    return <Medal className="h-6 w-6 text-[#cd7f32]" fill="#cd7f32" fillOpacity={0.3} />
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
      {rank}
    </div>
  )
}

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
