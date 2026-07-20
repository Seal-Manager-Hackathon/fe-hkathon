import { useState } from 'react'
import { X, Flag, AlertCircle } from 'lucide-react'
import { createStudentReport } from '../../../api/student'
import { REPORT_TYPE_OPTIONS } from '../../../constants/commonOptions'
import { toast } from '../../../utils/toast'
import RichTextEditor from '../../../components/RichTextEditor'

const TITLE_MAX = 200

export default function CreateReportModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [typeReport, setTypeReport] = useState('Spam')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Title is required.')
      return
    }
    if (trimmed.length > TITLE_MAX) {
      setError(`Title must not exceed ${TITLE_MAX} characters.`)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createStudentReport({
        title: trimmed,
        description: description || undefined,
        typeReport,
      })
      toast.success('Report submitted successfully.')
      setTitle('')
      setTypeReport('Spam')
      setDescription('')
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    if (submitting) return
    setError('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[580px] rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Flag className="h-5 w-5 text-[#e65100]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Create Report</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Type */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
                Type
              </label>
              <select
                value={typeReport}
                onChange={(e) => setTypeReport(e.target.value)}
                className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2.5 px-3 text-[14px] text-[#1f2f3a] outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
              >
                {REPORT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
                Title <span className="text-[#c62828]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  placeholder="Brief summary of your report..."
                  autoFocus
                  className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2.5 px-3 pr-16 text-[14px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#8a9ba6]">
                  {title.length}/{TITLE_MAX}
                </span>
              </div>
            </div>

            {/* Description — Rich text */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
                Description <span className="text-[#8a9ba6] text-[12px] font-normal">(optional)</span>
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide details about your report..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[#e8ecf0] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
