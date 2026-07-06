import { Medal } from 'lucide-react'

export default function RankBadge({ rank }) {
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
