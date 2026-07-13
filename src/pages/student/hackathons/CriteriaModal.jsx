import { useState, useEffect } from 'react'
import { X, ListChecks, ArrowRight } from 'lucide-react'
import { getStudentRoundCriteriaTemplates } from '../../../api/student'
import Pagination from '../../../components/Pagination'
import CriteriaTemplateDetailModal from './CriteriaTemplateDetailModal'

export default function CriteriaModal({ roundId, onClose }) {
  const [templates, setTemplates] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentRoundCriteriaTemplates(roundId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) {
          setTemplates(result.templates || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy vòng')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải tiêu chí.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId, pageIndex, pageSize])

  if (!roundId) return null

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <>
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
                <ListChecks className="h-5 w-5 text-[#1f78d1]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">Criteria Templates</h3>
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
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[60px] animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            ) : error ? (
              <p className="text-[14px] text-[#c62828]">{error}</p>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
                  <ListChecks size={22} />
                </div>
                <p className="text-[15px] font-medium text-[#1f2f3a]">No criteria yet</p>
                <p className="mt-1 text-[13px] text-[#7a8e99]">Criteria will appear here once created.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className="w-full cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d7e0e5] bg-white px-4 py-3.5 transition-colors hover:border-[#1f78d1]/30 hover:bg-[#f0f7ff]">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f7ff]">
                          <ListChecks size={16} className="text-[#1f78d1]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{template.title}</p>
                          {template.description && (
                            <p className="mt-0.5 line-clamp-1 text-[12px] text-[#7a8e99]">{template.description.replace(/<[^>]*>/g, '')}</p>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#f0f7ff] px-3 py-1.5 text-[12px] font-semibold text-[#1f78d1]">
                        View
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && templates.length > 0 && (
            <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex items-center justify-between">
              <span className="text-[12px] text-[#7a8e99]">{totalCount} template{totalCount !== 1 ? 's' : ''}</span>
              {totalPages > 1 ? (
                <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
              ) : (
                <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
              )}
            </div>
          )}
        </div>
      </div>

      <CriteriaTemplateDetailModal
        templateId={selectedTemplateId}
        onClose={() => setSelectedTemplateId(null)}
      />
    </>
  )
}
