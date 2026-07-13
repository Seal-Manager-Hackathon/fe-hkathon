import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RankingCard from '../RankingCard'

export default function TeamRanking({ teams }) {
  return (
    <div className="w-full shrink-0 lg:w-[320px]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1f2f3a]">Leaderboard</h2>
        <Link
          to="/leaderboard"
          className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#064f5d] hover:underline"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {teams.slice(0, 10).map((team) => (
          <RankingCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
