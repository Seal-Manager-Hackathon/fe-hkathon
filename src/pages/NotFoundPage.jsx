import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6f8] px-6">
      <div className="text-center">
        <h1 className="text-[120px] font-extrabold leading-none tracking-[-4px] text-[#064f5d]">
          404
        </h1>
        <h2 className="mt-2 text-[28px] font-bold text-[#1f2f3a]">
          Page not found
        </h2>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

