import { useState, useEffect } from 'react'
import { X, Award, Users } from 'lucide-react'
import { getStudentAwardDetail } from '../../../api/student'
import { formatDateTime } from '../../../utils/format'
import RichTextViewer from '../../../components/RichTextViewer'
import { getLevelLabel } from './eventDetailConstants'

export default function AwardDetailModal({ awardId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!awardId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentAwardDetail(awardId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Not found')
          } else {
            setError(err?.response?.data?.message || 'Cannot load award information.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [awardId])

  if (!awardId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Award className="h-5 w-5 text-[#f59e0b]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.name || 'Award Detail'}
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
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-sm">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-[17px] font-bold text-[#1f2f3a]">{detail.name}</p>
                  <p className="text-[13px] text-[#f59e0b] font-semibold">
                    {detail.prize ? new Intl.NumberFormat('vi-VN').format(detail.prize) + ' ₫' : '—'}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef3c7]">
                    <Award size={16} className="text-[#f59e0b]" />
                  </div>
                  <span className="text-[13px] font-medium text-[#7a8a9a]">Level</span>
                  <span className="ml-auto text-[14px] font-semibold text-[#1f2f3a]">
                    {getLevelLabel(detail.levelAward).label}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d1fae5]">
                    <Users size={16} className="text-[#10b981]" />
                  </div>
                  <span className="text-[13px] font-medium text-[#7a8a9a]">Winners</span>
                  <span className="ml-auto text-[14px] font-semibold text-[#1f2f3a]">
                    {detail.numberOfAward ?? '—'}
                  </span>
                </div>
              </div>

              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}
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
