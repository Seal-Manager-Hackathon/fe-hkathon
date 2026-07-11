import { BarChart3 } from 'lucide-react'

export default function LecturerLeaderboardTab({ eventId }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <BarChart3 className="mb-4 h-12 w-12 text-gray-300" />
      <p className="text-[15px] text-gray-500">Leaderboard for this event will appear here.</p>
    </div>
  )
}
