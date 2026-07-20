import { useState, useEffect } from 'react'
import {
  Search, Calendar, Plus, Inbox, Flag, Eye,
  Clock, CheckCircle, XCircle,
} from 'lucide-react'
import { getStudentReports } from '../../../api/student'
import Pagination from '../../../components/Pagination'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import { toast } from '../../../utils/toast'
import {
  REPORT_STATUS_OPTIONS_ALL,
  REPORT_TYPE_OPTIONS_ALL,
  reportStatusBadge,
  reportTypeBadge,
} from '../../../constants/commonOptions'
import CreateReportModal from './CreateReportModal'
import ReportDetailModal from './ReportDetailModal'

const PAGE_SIZE = 10

const STATUS_ICONS = {
  Pending: Clock,
  Resolved: CheckCircle,
  Reject: XCircle,
}

const STATUS_LINE_COLORS = {
  Pending: 'bg-[#e65100]',
  Resolved: 'bg-[#2e7d32]',
  Reject: 'bg-[#c62828]',
}

export default function MyReportsPage() {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewingReport, setViewingReport] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
        if (searchTerm.trim()) params.keyword = searchTerm.trim()
        if (statusFilter) params.status = statusFilter
        if (typeFilter) params.typeReport = typeFilter
        if (fromDate) params.fromDate = fromDate
        if (toDate) params.toDate = toDate
        const result = await getStudentReports(params)
        if (!cancelled) {
          setItems(result.items || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Cannot load reports.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [pageIndex, searchTerm, statusFilter, typeFilter, fromDate, toDate, refreshKey])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
    setPageIndex(1)
  }

  function handleStatusChange(e) {
    setStatusFilter(e.target.value)
    setPageIndex(1)
  }

  function handleTypeChange(e) {
    setTypeFilter(e.target.value)
    setPageIndex(1)
  }

  function handleFromDateChange(e) {
    setFromDate(e.target.value)
    setPageIndex(1)
  }

  function handleToDateChange(e) {
    setToDate(e.target.value)
    setPageIndex(1)
  }

  function handleCreated() {
    setRefreshKey((k) => k + 1)
  }

  const hasActive = searchTerm || statusFilter || typeFilter || fromDate || toDate

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1f2f3a]">My Reports</h1>
            <p className="mt-1 text-[14px] text-[#5a6a73]">Manage support requests you have submitted</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1565c0] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
          >
            <Plus size={18} />
            Create Report
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6]" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2 pl-9 pr-3 text-[13px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full sm:w-[150px] rounded-lg border border-[#d7e0e5] bg-white py-2 px-3 text-[13px] text-[#1f2f3a] outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
          >
            {REPORT_STATUS_OPTIONS_ALL.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={handleTypeChange}
            className="w-full sm:w-[150px] rounded-lg border border-[#d7e0e5] bg-white py-2 px-3 text-[13px] text-[#1f2f3a] outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
          >
            {REPORT_TYPE_OPTIONS_ALL.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* From date */}
          <div className="relative w-full sm:w-[160px]">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6] pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2 pl-9 pr-3 text-[13px] text-[#1f2f3a] outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
            />
          </div>

          {/* To date */}
          <div className="relative w-full sm:w-[160px]">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6] pointer-events-none" />
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2 pl-9 pr-3 text-[13px] text-[#1f2f3a] outline-none focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[92px] animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af]">
              <Inbox size={28} />
            </div>
            <h3 className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">No reports</h3>
            <p className="max-w-xs text-center text-[14px] text-[#5a6a73]">
              {hasActive
                ? 'No reports match your filters.'
                : 'You haven\'t submitted any reports yet. Click "Create Report" to get started.'}
            </p>
          </div>
        ) : (
          /* Report list */
          <div className="space-y-3">
            {items.map((report) => {
              const stCls = reportStatusBadge[report.status] || reportStatusBadge.Pending
              const tpCls = reportTypeBadge[report.typeReport] || reportTypeBadge.Other
              const stLabel = report.status === 'Reject' ? 'Rejected' : report.status
              const StatusIcon = STATUS_ICONS[report.status] || Clock
              const lineColor = STATUS_LINE_COLORS[report.status] || 'bg-[#e65100]'

              return (
                <div
                  key={report.id}
                  className="group relative flex items-stretch gap-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#d7e0e5] transition-all hover:shadow-md hover:ring-[#1565c0]/30"
                >
                  {/* Left accent bar */}
                  <div className={cn('w-[4px] shrink-0 self-stretch', lineColor)} />

                  <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
                    {/* Left: icon + info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f8] group-hover:bg-[#e8edf1] transition-colors">
                        <Flag size={18} className="text-[#064f5d]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{report.title}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {report.typeReport && (
                            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', tpCls)}>
                              {report.typeReport}
                            </span>
                          )}
                          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', stCls)}>
                            <StatusIcon size={10} />
                            {stLabel}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-[#8a9ba6]">
                            <Clock size={11} />
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: View button */}
                    <button
                      type="button"
                      onClick={() => setViewingReport(report)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#064f5d] transition-all hover:border-[#064f5d]/40 hover:bg-[#f0f7f8] active:scale-[0.97]"
                    >
                      <Eye size={15} />
                      View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
          </div>
        )}
      </div>

      <CreateReportModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />

      <ReportDetailModal
        report={viewingReport}
        open={!!viewingReport}
        onClose={() => setViewingReport(null)}
      />
    </div>
  )
}
