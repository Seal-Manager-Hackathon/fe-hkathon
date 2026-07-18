import { Medal } from 'lucide-react'

export default function RankBadge({ rank }) {
  if (rank === 1) {
    return <Medal className="h-6 w-6 text-[#0EA5E9]" fill="#0EA5E9" fillOpacity={0.3} />
  }
  if (rank === 2) {
    return <Medal className="h-6 w-6 text-[#EAB308]" fill="#EAB308" fillOpacity={0.3} />
  }
  if (rank === 3) {
    return <Medal className="h-6 w-6 text-[#22C55E]" fill="#22C55E" fillOpacity={0.3} />
  }
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
      {rank}
    </div>
  )
}
