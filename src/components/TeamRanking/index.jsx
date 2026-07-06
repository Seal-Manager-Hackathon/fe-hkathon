import { ArrowRight } from 'lucide-react'
import RankingCard from '../RankingCard'

export default function TeamRanking({ teams }) {
  return (
    <div className="w-[320px] shrink-0">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1f2f3a]">Team Ranking</h2>
        <button className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#064f5d] hover:underline">
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {teams.map((team) => (
          <RankingCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
