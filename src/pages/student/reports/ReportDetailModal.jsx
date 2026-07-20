import { X, Flag, Calendar } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatDateTime } from '../../../utils/format'
import {
  reportStatusBadge,
  reportTypeBadge,
} from '../../../constants/commonOptions'

export default function ReportDetailModal({ report, open, onClose }) {
  if (!open || !report) return null

  const stCls = reportStatusBadge[report.status] || reportStatusBadge.Pending
  const tpCls = reportTypeBadge[report.typeReport] || reportTypeBadge.Other
  const stLabel = report.status === 'Reject' ? 'Rejected' : report.status

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[540px] rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Flag className="h-5 w-5 text-[#e65100]" />
            </div>
            <h3 className="truncate text-[16px] font-bold text-[#1f2f3a]">{report.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2">
            {report.typeReport && (
              <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', tpCls)}>
                {report.typeReport}
              </span>
            )}
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', stCls)}>
              {stLabel}
            </span>
          </div>

          {/* Description */}
          {report.description ? (
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#8a9ba6]">Description</p>
              <div className="rounded-xl bg-[#f6f9fb] p-4">
                <div
                  className="prose prose-sm max-w-none text-[14px] text-[#1f2f3a] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: report.description }}
                />
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#8a9ba6] italic">No description provided.</p>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 pt-1">
            <Calendar size={14} className="text-[#8a9ba6]" />
            <span className="text-[12px] text-[#8a9ba6]">
              Created {formatDateTime(report.createdAt)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#e8ecf0] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
