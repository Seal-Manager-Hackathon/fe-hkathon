export default function LoadingSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 h-28 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
    </div>
  )
}
