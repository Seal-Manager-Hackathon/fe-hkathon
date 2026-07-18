import { Trophy, Award } from 'lucide-react'
import { cn } from '../../utils/cn'
import { getRankScoreColor } from '../../utils/rankScoreColor'

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-teal-600',
  'bg-orange-600', 'bg-green-600', 'bg-slate-600', 'bg-red-600',
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getColor(id) {
  if (!id) return AVATAR_COLORS[0]
  const idx = String(id).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return AVATAR_COLORS[idx % AVATAR_COLORS.length]
}

function SmallRankBadge({ rank }) {
  if (rank === 1) return <Trophy size={18} className="text-[#0EA5E9]" fill="#0EA5E9" />
  if (rank === 2) return <Trophy size={18} className="text-[#EAB308]" fill="#EAB308" />
  if (rank === 3) return <Award size={18} className="text-[#22C55E]" />
  return <span className="text-[13px] font-bold text-[#5a6a73]">#{rank}</span>
}

export default function RankingCard({ team }) {
  const initials = getInitials(team.name)
  const color = getColor(team.id)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#d8e0e6] bg-white px-3 py-2.5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Rank badge */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8]">
        <SmallRankBadge rank={team.rank} />
      </div>

      {/* Avatar */}
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[12px] font-bold', color)}>
        {initials}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{team.name}</p>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end shrink-0">
        <span className={cn('text-[16px] font-bold leading-none', getRankScoreColor(team.rank))}>{team.points}</span>
        <span className="text-[9px] font-semibold text-[#9ca3af] uppercase tracking-wider">PTS</span>
      </div>
    </div>
  )
}
