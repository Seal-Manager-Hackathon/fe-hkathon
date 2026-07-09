export default function HackathonSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-[#d8e0e6] bg-white animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="sm:w-[120px] sm:min-h-[120px] h-[100px] bg-[#e8edf1] shrink-0" />

      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-center gap-3 px-4 py-3 sm:px-5 sm:py-0">
        <div className="h-3 w-20 rounded-full bg-[#e8edf1]" />
        <div className="h-5 w-3/4 rounded bg-[#e8edf1]" />
        <div className="h-3.5 w-2/3 rounded bg-[#e8edf1]" />
        <div className="flex items-center gap-3 pt-1">
          <div className="h-6 w-20 rounded-full bg-[#e8edf1]" />
          <div className="h-4 w-24 rounded bg-[#e8edf1]" />
          <div className="h-4 w-16 rounded bg-[#e8edf1]" />
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="sm:flex hidden items-center pr-5">
        <div className="h-9 w-28 rounded-lg bg-[#e8edf1]" />
      </div>
    </div>
  );
}
