export default function LeaderboardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#d8e0e6] bg-white px-4 py-3.5 sm:px-5 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-[#e8edf1]" />
      <div className="h-11 w-11 shrink-0 rounded-full bg-[#e8edf1]" />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="h-3.5 w-16 rounded bg-[#e8edf1]" />
        <div className="h-4 w-3/4 rounded bg-[#e8edf1]" />
        <div className="flex gap-3">
          <div className="h-3 w-20 rounded bg-[#e8edf1]" />
          <div className="h-3 w-16 rounded bg-[#e8edf1]" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="h-6 w-14 rounded bg-[#e8edf1]" />
        <div className="h-2.5 w-10 rounded bg-[#e8edf1]" />
      </div>
    </div>
  );
}
