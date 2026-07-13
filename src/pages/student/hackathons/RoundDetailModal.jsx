import { useState, useEffect } from 'react'
import { X, Layers, Calendar, Clock, Users } from 'lucide-react'
import { getStudentRoundDetail } from '../../../api/student'
import { formatDateTime } from '../../../utils/format'
import RichTextViewer from '../../../components/RichTextViewer'
import { cn } from '../../../utils/cn'

/* ------------------------------------------------------------------ */
/*  Helper                                                              */
/* ------------------------------------------------------------------ */

function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#1f2f3a]">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  RoundDetailModal                                                    */
/* ------------------------------------------------------------------ */

export default function RoundDetailModal({ roundId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentRoundDetail(roundId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy vòng')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin vòng.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [roundId])

  if (!roundId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Layers className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.name || 'Round Detail'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              {/* Info rows */}
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Calendar} label="Start Time" value={formatDateTime(detail.startTime)} accent="#3b82f6" />
                <DetailRow icon={Calendar} label="End Time" value={formatDateTime(detail.endTime)} accent="#ef4444" />
                {detail.startSubmission && (
                  <DetailRow icon={Clock} label="Submission Start" value={formatDateTime(detail.startSubmission)} accent="#10b981" />
                )}
                {detail.endSubmission && (
                  <DetailRow icon={Clock} label="Submission End" value={formatDateTime(detail.endSubmission)} accent="#f59e0b" />
                )}
                <DetailRow icon={Users} label="Max Teams" value={detail.limitTeam ?? '—'} accent="#8b5cf6" />
              </div>

              {/* Description */}
              <div>
                <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                  <RichTextViewer content={detail.description} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
