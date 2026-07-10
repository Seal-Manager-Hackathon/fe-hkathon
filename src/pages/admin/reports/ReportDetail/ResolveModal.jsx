import { useState, useCallback, useEffect } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import RichTextEditor from '../../../../components/RichTextEditor'
import { cn } from '../../../../utils/cn'

/**
 * Shared modal for Resolve / Reject with a rich-text reason field.
 * @param {'resolve'|'reject'} action
 * @param {boolean} open
 * @param {Function} onClose
 * @param {Function} onSubmit - (reasonHtml: string) => void
 * @param {boolean} submitting
 */
export default function ResolveModal({ action, open, onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState('')

  const handleSubmit = useCallback(() => {
    if (!reason.trim()) return
    onSubmit(reason)
  }, [reason, onSubmit])

  // Clear reason when modal opens
  useEffect(() => {
    if (open) setReason('')
  }, [open])

  if (!open) return null

  const isResolve = action === 'resolve'

  const title = isResolve ? 'Resolve Report' : 'Reject Report'
  const desc = isResolve
    ? 'Provide a reason for resolving this report.'
    : 'Provide a reason for rejecting this report.'
  const IconComp = isResolve ? CheckCircle : XCircle
  const accentColor = isResolve
    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
    : 'border-rose-500 bg-rose-50 text-rose-600'
  const btnClass = isResolve
    ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
    : 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[92%] sm:max-w-[620px] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl border', accentColor)}>
              <IconComp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">{title}</h2>
              <p className="text-[12px] text-slate-400">{desc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="mb-2 block text-[13px] font-semibold text-slate-600">
            Reason
          </label>
          <RichTextEditor
            value={reason}
            onChange={setReason}
            placeholder="Enter the reason for your decision..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !reason.trim()}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
              btnClass,
            )}
          >
            <IconComp className="h-4 w-4" />
            {submitting ? 'Processing…' : isResolve ? 'Resolve Report' : 'Reject Report'}
          </button>
        </div>
      </div>
    </div>
  )
}