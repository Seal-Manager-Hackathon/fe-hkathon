import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

/**
 * Resolve / Reject action buttons shown when report is Pending.
 */
export default function ActionButtons({ acting, onResolve, onReject }) {
  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <button
        type="button"
        onClick={onResolve}
        disabled={acting}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CheckCircle className="h-4 w-4" />
        {acting ? 'Processing…' : 'Resolve'}
      </button>
      <button
        type="button"
        onClick={onReject}
        disabled={acting}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <XCircle className="h-4 w-4" />
        {acting ? 'Processing…' : 'Reject'}
      </button>
    </div>
  )
}

/**
 * Inline error banner for action failures.
 */
export function ActionError({ message }) {
  if (!message) return null
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
