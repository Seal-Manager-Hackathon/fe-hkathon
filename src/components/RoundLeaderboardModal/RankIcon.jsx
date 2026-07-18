import { Trophy, Medal } from 'lucide-react'

export default function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-[#0EA5E9]" fill="#0EA5E9" />
  if (rank === 2) return <Trophy className="h-4 w-4 text-[#EAB308]" fill="#EAB308" />
  if (rank === 3) return <Medal className="h-4 w-4 text-[#22C55E]" />
  return <span className="text-[13px] font-bold text-[#5a6a73] text-center w-4">#{rank}</span>
}
