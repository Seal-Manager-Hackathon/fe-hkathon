import { useState, useEffect } from 'react'
import { X, Flag, Calendar, MessageSquare, AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatDateTime } from '../../../utils/format'
import {
  reportStatusBadge,
  reportTypeBadge,
} from '../../../constants/commonOptions'
import { getStudentReportDetail } from '../../../api/student'
import RichTextViewer from '../../../components/RichTextViewer'

export default function ReportDetailModal({ reportId, open, onClose }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (!open || !reportId) return
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError('')
      setActiveTab('description')
      try {
        const data = await getStudentReportDetail(reportId)
        if (!cancelled) {
          setReport(data)
          if (data?.description) setActiveTab('description')
          else if (data?.reason) setActiveTab('reason')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load report detail.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [open, reportId])

  function handleClose() {
    setReport(null)
    setError('')
    setActiveTab('description')
    onClose()
  }

  if (!open) return null

  const hasTabs = report?.description || report?.reason

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[600px] rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Flag className="h-5 w-5 text-[#e65100]" />
            </div>
            <h3 className="truncate text-[16px] font-bold text-[#1f2f3a]">
              {loading ? 'Loading...' : report?.title || 'Report Detail'}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center">
              <p className="text-[14px] text-[#c62828]">{error}</p>
            </div>
          ) : report ? (
            <>
              {/* Tabs */}
              {hasTabs ? (
                <div>
                  {/* Tab bar */}
                  <div className="flex border-b border-[#e8ecf0] bg-[#fafbfc]">
                    <TabButton
                      active={activeTab === 'description'}
                      onClick={() => setActiveTab('description')}
                      icon={MessageSquare}
                      label="Report Content"
                      visible={!!report.description}
                    />
                    <TabButton
                      active={activeTab === 'reason'}
                      onClick={() => setActiveTab('reason')}
                      icon={AlertCircle}
                      label="Reply from Admin"
                      visible={!!report.reason}
                    />
                  </div>

                  {/* Description tab */}
                  {activeTab === 'description' && (
                    <div className="px-6 py-5 space-y-4">
                      {/* Badges + date inline */}
                      <div className="flex flex-wrap items-center gap-2">
                        {report.typeReport && (
                          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', reportTypeBadge[report.typeReport])}>
                            {report.typeReport}
                          </span>
                        )}
                        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', reportStatusBadge[report.status])}>
                          {report.status === 'Reject' ? 'Rejected' : report.status}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-[#8a9ba6] ml-1">
                          <Calendar size={12} />
                          Created {formatDateTime(report.createdAt)}
                        </span>
                      </div>

                      {/* Description with gray bg */}
                      {report.description ? (
                        <div className="rounded-xl bg-[#f6f9fb] p-4">
                          <RichTextViewer content={report.description} />
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#8a9ba6] italic">No description provided.</p>
                      )}
                    </div>
                  )}

                  {/* Reason / Admin reply tab */}
                  {activeTab === 'reason' && (
                    <div className="px-6 py-5">
                      {report.reason ? (
                        <div>
                          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#8a9ba6]">
                            Admin Response
                          </p>
                          <div className="rounded-xl bg-[#f6f9fb] p-4">
                            <RichTextViewer content={report.reason} />
                          </div>
                        </div>
                      ) : (
                        <p className="text-[14px] text-[#8a9ba6] italic">No reply from admin yet.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-[14px] text-[#8a9ba6] italic">No additional content.</p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#e8ecf0] px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label, visible }) {
  if (!visible) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 cursor-pointer px-4 py-3 text-[13px] font-semibold transition-colors',
        active
          ? 'border-b-2 border-[#1565c0] text-[#1565c0] bg-white'
          : 'text-[#8a9ba6] hover:text-[#1f2f3a] hover:bg-white/50',
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Icon className="h-4 w-4" />
        {label}
      </span>
    </button>
  )
}
