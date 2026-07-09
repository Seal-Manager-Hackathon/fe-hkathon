import { BarChart3 } from 'lucide-react';

export default function EmptyLeaderboardState({ onClickBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af] mb-5">
        <BarChart3 size={28} />
      </div>
      <h3 className="text-[17px] font-semibold text-[#1f2f3a] mb-1">
        No leaderboard data available
      </h3>
      <p className="text-[14px] text-[#5a6a73] mb-5 text-center max-w-xs">
        This season hasn&apos;t started yet or no scores have been recorded.
      </p>
      <button
        type="button"
        onClick={onClickBack}
        className="rounded-xl border border-[#d8e0e6] bg-white px-5 py-2 text-[14px] font-medium text-[#1f2f3a] hover:bg-[#f4f6f8] transition-colors cursor-pointer"
      >
        Back to current season
      </button>
    </div>
  );
}
