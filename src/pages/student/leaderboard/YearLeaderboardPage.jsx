import { useState, useMemo, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { mockLeaderboardData, AVAILABLE_YEARS, CURRENT_YEAR } from '../../../data/mockLeaderboardData';
import SeasonSwitcher from '../../../components/SeasonSwitcher';
import LeaderboardList from '../../../components/LeaderboardList';
import LeaderboardSkeleton from '../../../components/LeaderboardSkeleton';
import EmptyLeaderboardState from '../../../components/EmptyLeaderboardState';

const PODIUM_CONFIG = {
  gold: {
    cardBg: 'from-[#fefce8] to-[#fef3c7]',
    border: 'border-[#d97706]',
    shadow: 'shadow-[0_4px_24px_rgba(217,119,6,0.18)]',
    rankBg: 'from-[#d97706] to-[#b45309]',
    textColor: '#b45309',
    label: '1st',
    height: 'pb-8 pt-5',
    avatarSize: 'h-18 w-18 text-[24px]',
    scoreSize: 'text-[38px]',
  },
  silver: {
    cardBg: 'from-[#f8fafc] to-[#f1f5f9]',
    border: 'border-[#64748b]',
    shadow: 'shadow-[0_4px_20px_rgba(100,116,139,0.14)]',
    rankBg: 'from-[#64748b] to-[#475569]',
    textColor: '#475569',
    label: '2nd',
    height: 'pb-5 pt-5',
    avatarSize: 'h-14 w-14 text-[18px]',
    scoreSize: 'text-[30px]',
  },
  bronze: {
    cardBg: 'from-[#fff7ed] to-[#ffedd5]',
    border: 'border-[#ea580c]',
    shadow: 'shadow-[0_4px_16px_rgba(234,88,12,0.12)]',
    rankBg: 'from-[#ea580c] to-[#c2410c]',
    textColor: '#c2410c',
    label: '3rd',
    height: 'pb-5 pt-5',
    avatarSize: 'h-14 w-14 text-[18px]',
    scoreSize: 'text-[30px]',
  },
};

// Podium: 2nd (left) | 1st (center) | 3rd (right)
const PODIUM_ORDER = ['silver', 'gold', 'bronze'];

export default function YearLeaderboardPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  const yearData = useMemo(
    () => mockLeaderboardData.find((d) => d.year === selectedYear),
    [selectedYear]
  );

  const teams = yearData?.teams || [];
  const top3 = useMemo(() => teams.filter(t => t.rank <= 3 && t.highlight), [teams]);
  const restTeams = useMemo(() => teams.filter(t => t.rank > 3), [teams]);

  const top3Map = useMemo(() => {
    const map = {};
    top3.forEach(t => { map[t.highlight] = t; });
    return map;
  }, [top3]);

  const handleYearChange = (year) => {
    if (AVAILABLE_YEARS.includes(year)) {
      setSelectedYear(year);
    }
  };

  const handleBackToCurrent = () => {
    setSelectedYear(CURRENT_YEAR);
  };

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* ---- Header + Season Switcher ---- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h1 className="text-[38px] font-semibold text-[#1f2f3a] tracking-[-0.5px] leading-tight max-sm:text-[30px]">
              Year Leaderboard
            </h1>
            <p className="mt-1.5 text-[15px] text-[#5a6a73]">
              Team rankings accumulated across all events in the season
            </p>
          </div>
          {!isLoading && (
            <SeasonSwitcher
              years={AVAILABLE_YEARS}
              selectedYear={selectedYear}
              currentYear={CURRENT_YEAR}
              onChange={handleYearChange}
            />
          )}
        </div>

        {/* ---- Top 3 Podium ---- */}
        {!isLoading && top3.length > 0 && (
          <div className="flex items-end justify-center gap-3 sm:gap-5 mb-8 px-2">
            {PODIUM_ORDER.map((hl) => {
              const team = top3Map[hl];
              if (!team) return null;
              const cfg = PODIUM_CONFIG[hl];
              const isGold = hl === 'gold';

              return (
                <div
                  key={team.id}
                  className={cn(
                    'relative flex flex-col items-center rounded-2xl border-2 bg-gradient-to-b overflow-hidden w-full max-w-[200px] sm:max-w-[240px]',
                    isGold ? 'sm:max-w-[260px]' : '',
                    cfg.cardBg, cfg.border, cfg.shadow, cfg.height
                  )}
                >
                  {/* Rank badge */}
                  <div className={cn(
                    'absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 shadow-md',
                    cfg.rankBg
                  )}>
                    <Trophy size={isGold ? 16 : 13} color="#fff" fill="#fff" />
                    <span className={cn(
                      'font-bold text-white',
                      isGold ? 'text-[13px]' : 'text-[11px]'
                    )}>{cfg.label}</span>
                  </div>

                  {/* Avatar */}
                  <div className={cn(
                    'flex items-center justify-center rounded-full text-white font-bold ring-4 ring-white/60 shadow-lg mt-8 mb-3',
                    cfg.avatarSize, team.avatarColor
                  )}>
                    {team.initials}
                  </div>

                  {/* Team name */}
                  <h3 className={cn(
                    'font-bold text-[#1f2f3a] leading-tight text-center mb-1 px-2',
                    isGold ? 'text-[16px]' : 'text-[14px]'
                  )}>
                    {team.name}
                  </h3>

                  {/* Score */}
                  <p
                    className={cn(cfg.scoreSize, 'font-extrabold leading-none mb-1')}
                    style={{ color: cfg.textColor }}
                  >
                    {team.points.toFixed(1)}
                  </p>
                  <span className="text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-3">
                    Points
                  </span>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 pt-3 border-t border-black/5 w-full justify-center px-3">
                    <span className="text-[11px] text-[#5a6a73]">
                      <span className="font-semibold text-[#1f2f3a]">{team.participatedEvents}</span> evts
                    </span>
                    <span className="text-[11px] text-[#5a6a73]">
                      <span className="font-semibold text-[#1f2f3a]">{team.awards}</span> awds
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- List / Loading / Empty ---- */}
        {isLoading ? (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <LeaderboardSkeleton key={i} />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <EmptyLeaderboardState onClickBack={handleBackToCurrent} />
        ) : (
          <>
            {restTeams.length > 0 && (
              <div className="mb-3">
                <h2 className="text-[15px] font-semibold text-[#5a6a73] uppercase tracking-wider">
                  Other Rankings
                </h2>
              </div>
            )}
            <LeaderboardList teams={restTeams} />
          </>
        )}
      </div>
    </div>
  );
}
