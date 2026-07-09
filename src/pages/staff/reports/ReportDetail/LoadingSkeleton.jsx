import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react'

export default function LoadingSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5 h-4 w-28 animate-pulse rounded bg-slate-200" />
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="h-1.5 w-full animate-pulse bg-slate-200 -mx-5 -mt-5 mb-5 sm:-mx-6 sm:-mt-6 sm:mb-6" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="h-6 w-14 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-7 w-72 animate-pulse rounded bg-slate-200 sm:h-8 sm:w-96" />
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
        <div className="mt-5 flex gap-8 border-t border-slate-100 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  )
}

export function ErrorState({ isNotFound, message }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${
          isNotFound ? 'bg-amber-50 text-amber-400' : 'bg-rose-50 text-rose-400'
        }`}
      >
        {isNotFound ? (
          <FileText className="h-10 w-10" />
        ) : (
          <AlertCircle className="h-10 w-10" />
        )}
      </div>
      <h2 className="text-[20px] font-bold text-[#1f2f3a]">
        {isNotFound ? 'Report Not Found' : 'Something went wrong'}
      </h2>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-gray-500">
        {isNotFound
          ? 'The report you are looking for does not exist or has been removed.'
          : message || 'An unexpected error occurred while loading this report.'}
      </p>
      <Link
        to="/staff/reports"
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#05404a] hover:shadow-md active:scale-[0.97]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Link>
    </div>
  )
}

