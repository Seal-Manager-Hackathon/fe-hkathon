import { Trophy, Medal } from 'lucide-react'

export default function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-[#d97706]" fill="#d97706" />
  if (rank === 2) return <Trophy className="h-4 w-4 text-[#64748b]" fill="#64748b" />
  if (rank === 3) return <Medal className="h-4 w-4 text-[#ea580c]" />
  return <span className="text-[13px] font-bold text-[#5a6a73] text-center w-4">#{rank}</span>
}
