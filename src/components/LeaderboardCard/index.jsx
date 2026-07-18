import { Trophy, Award, Calendar, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getRankScoreColor } from '../../utils/rankScoreColor';

const HIGHLIGHT_STYLES = {
  gold: {
    card: 'border-[#d97706]/30 bg-gradient-to-r from-[#fefce8]/60 to-white',
    rankWrapper: 'bg-[#fef3c7] text-[#b45309]',
    label: 'gold',
  },
  silver: {
    card: 'border-[#64748b]/25 bg-gradient-to-r from-[#f8fafc]/60 to-white',
    rankWrapper: 'bg-[#f1f5f9] text-[#475569]',
    label: 'silver',
  },
  bronze: {
    card: 'border-[#ea580c]/25 bg-gradient-to-r from-[#fff7ed]/60 to-white',
    rankWrapper: 'bg-[#ffedd5] text-[#c2410c]',
    label: 'bronze',
  },
};

function RankBadge({ rank, highlight }) {
  if (highlight === 'gold') {
    return <Trophy size={22} className="text-[#d97706]" fill="#d97706" />;
  }
  if (highlight === 'silver') {
    return <Trophy size={22} className="text-[#64748b]" fill="#64748b" />;
  }
  if (highlight === 'bronze') {
    return <Award size={22} className="text-[#ea580c]" />;
  }
  return <span className="text-[15px] font-bold text-[#5a6a73] w-[22px] text-center">#{rank}</span>;
}

export default function LeaderboardCard({ team }) {
  const isTop3 = team.highlight && HIGHLIGHT_STYLES[team.highlight];
  const highlightStyle = isTop3 || null;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-[#d8e0e6] bg-white px-4 py-3.5 sm:px-5 transition-shadow duration-200',
        'hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]',
        highlightStyle?.card
      )}
    >
      {/* Rank */}
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          highlightStyle ? highlightStyle.rankWrapper : 'bg-[#f4f6f8]'
        )}
      >
        <RankBadge rank={team.rank} highlight={team.highlight} />
      </div>

      {/* Avatar */}
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white text-[15px] font-bold',
          team.avatarColor
        )}
      >
        {team.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-[#1f2f3a] leading-tight">
          {team.name}
        </h3>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end shrink-0">
        <span className={cn(
          'text-[22px] font-bold leading-none',
          getRankScoreColor(team.rank)
        )}>
          {team.points.toFixed(1)}
        </span>
        <span className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-1">
          Points
        </span>
      </div>
    </div>
  );
}
