import BrandLogo from '../BrandLogo'

export default function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8]">
      <div className="flex flex-col items-center gap-6">
        <BrandLogo />
        <div className="flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 animate-bounce rounded-full bg-[#ffca28]" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}