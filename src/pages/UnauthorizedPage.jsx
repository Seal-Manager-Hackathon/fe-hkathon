import { Link } from 'react-router-dom'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f6f8] px-6">
      <div className="text-center">
        <h1 className="text-[120px] font-extrabold leading-none tracking-[-4px] text-[#c62828]">
          403
        </h1>
        <h2 className="mt-2 text-[28px] font-bold text-[#1f2f3a]">
          Access Denied
        </h2>
        <p className="mt-3 max-w-md text-[16px] leading-relaxed text-gray-500">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-5 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
          >
            ← Back to Home
          </Link>
          <Link
            to="/login"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
