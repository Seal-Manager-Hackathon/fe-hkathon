import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable modal for prompting an optional reason before an action.
 * @param {boolean} open - whether the modal is visible
 * @param {Function} onClose - called when the modal is dismissed
 * @param {Function} onSubmit - called with (reason: string) on confirm; reason is always a string (may be empty)
 * @param {string} [title='Enter Reason'] - modal title
 * @param {string} [description] - optional sub-text below the title
 * @param {string} [confirmText='Submit'] - confirm button label
 * @param {string} [placeholder='Enter reason...'] - textarea placeholder
 * @param {boolean} [submitting=false] - disables buttons while submitting
 * @param {'danger'|'primary'} [confirmVariant='primary'] - confirm button style
 */
export default function PromptReason({
  open,
  onClose,
  onSubmit,
  title = 'Enter Reason',
  description,
  confirmText = 'Submit',
  placeholder = 'Enter reason...',
  submitting = false,
  confirmVariant = 'primary',
}) {
  const [reason, setReason] = useState('')

  // Reset reason whenever the modal opens
  useEffect(() => {
    if (open) setReason('')
  }, [open])

  const handleSubmit = useCallback(() => {
    onSubmit(reason.trim())
  }, [reason, onSubmit])

  const handleClose = useCallback(() => {
    setReason('')
    onClose()
  }, [onClose])

  if (!open) return null

  const isDanger = confirmVariant === 'danger'
  const confirmBtnClass = isDanger
    ? 'cursor-pointer rounded-lg bg-[#c62828] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#b71c1c] disabled:opacity-50'
    : 'cursor-pointer rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a] disabled:opacity-50'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={!submitting ? handleClose : undefined} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">{title}</h3>
            {description && <p className="mt-1 text-[13px] text-gray-500">{description}</p>}
          </div>
          {!submitting && (
            <button
              onClick={handleClose}
              className="cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-4">
          <label className="text-[13px] font-semibold text-slate-500">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5 min-h-[80px] w-full resize-none rounded-lg border border-[#e0e0e0] px-3 py-2 text-[14px] text-[#1f2f3a] placeholder:text-gray-400 focus:border-[#064f5d] focus:outline-none focus:ring-1 focus:ring-[#064f5d]"
            placeholder={placeholder}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting} className={confirmBtnClass}>
            {submitting ? 'Submitting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
