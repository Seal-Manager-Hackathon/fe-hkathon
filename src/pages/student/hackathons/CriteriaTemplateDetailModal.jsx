import { useState, useEffect } from 'react'
import { X, ListChecks } from 'lucide-react'
import { getStudentCriteriaTemplateDetail } from '../../../api/student'

export default function CriteriaTemplateDetailModal({ templateId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!templateId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentCriteriaTemplateDetail(templateId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy tiêu chí')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin tiêu chí.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [templateId])

  if (!templateId) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <ListChecks className="h-5 w-5 text-[#1f78d1]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.title || 'Template Detail'}
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
              {/* Criteria items */}
              <div>
                {detail.items && detail.items.length > 0 ? (
                  <div className="space-y-2.5">
                    {detail.items.map((item, idx) => {
                      const maxScore = Math.max(...detail.items.map(i => i.score), 1)
                      const pct = (item.score / maxScore) * 100
                      return (
                        <div key={item.id} className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white">
                          <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f7ff] text-[11px] font-bold text-[#1f78d1]">
                                {idx + 1}
                              </span>
                              <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{item.name}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-[#e3f2fd] px-2.5 py-1.5 text-[12px] font-bold text-[#1f78d1]">
                                {item.score}<span className="text-[10px] font-medium text-[#64b5f6]">pts</span>
                              </span>
                            </div>
                          </div>
                          {/* Score bar */}
                          <div className="h-1.5 w-full bg-[#f0f4f8]">
                            <div
                              className="h-full rounded-r-full bg-gradient-to-r from-[#64b5f6] to-[#1f78d1] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-[#e8ecf0] py-8">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#8a9ba6]">
                      <ListChecks size={20} />
                    </div>
                    <p className="text-[13px] text-[#7a8e99]">No criteria items defined.</p>
                  </div>
                )}
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
