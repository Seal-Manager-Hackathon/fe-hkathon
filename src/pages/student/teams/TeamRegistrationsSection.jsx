import { useState, useEffect } from 'react'
import { FileText, Clock, XCircle, AlertTriangle, CheckCircle } from 'lucide-react'
import { getStudentTeamAllRegisterTeams } from '../../../api/student'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import Pagination from '../../../components/Pagination'

const PAGE_SIZE = 10

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Rejected', label: 'Rejected' },
  { key: 'Banned', label: 'Banned' },
]

const REG_STATUSES = {
  Pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60', icon: Clock },
  Approved: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60', icon: CheckCircle },
  Rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 ring-1 ring-red-200/60', icon: XCircle },
  Banned: { label: 'Banned', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60', icon: AlertTriangle },
}

export default function TeamRegistrationsSection({ teamId }) {
  const [statusFilter, setStatusFilter] = useState('Approved')
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetchData() {
      setLoading(true)
      try {
        const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
        if (statusFilter) params.status = statusFilter
        const result = await getStudentTeamAllRegisterTeams(teamId, params)
        if (!cancelled) {
          setItems(result.registerTeams || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [teamId, pageIndex, statusFilter])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div>
      {/* Status filter pills — always visible */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => { setStatusFilter(f.key); setPageIndex(1) }}
            className={cn(
              'rounded-full px-3.5 py-1 text-[11px] font-semibold transition-all cursor-pointer',
              statusFilter === f.key
                ? 'bg-[#1565c0] text-white shadow-[0_2px_8px_rgba(21,101,192,0.25)]'
                : 'bg-white text-[#5a6a73] border border-[#d7e0e5] hover:border-[#1565c0]/30 hover:text-[#1565c0]',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-lg bg-gray-100" />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FileText size={24} className="mb-2 text-[#8a9ba6]" />
          <p className="text-[13px] text-[#7a8e99]">
            {statusFilter ? `No ${statusFilter.toLowerCase()} registrations.` : 'No registrations yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((reg) => {
              const st = REG_STATUSES[reg.status] || REG_STATUSES.Pending
              const Icon = st.icon
              return (
                <div
                  key={reg.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1565c0] to-[#42a5f5] text-white shadow-sm">
                      <FileText size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-[14px] font-semibold text-[#1f2f3a]">{reg.eventName}</h4>
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <Icon size={10} />
                          {st.label}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#5a6a73]">
                        {reg.roundName && (
                          <span>Round {reg.roundNo}: {reg.roundName}</span>
                        )}
                        <span>{formatDate(reg.createdAt)}</span>
                      </div>
                      {reg.rejectionReason && (
                        <p className="mt-0.5 text-[11px] text-[#c62828]">Reason: {reg.rejectionReason}</p>
                      )}
                      {(reg.isBanned || reg.isDisable) && (
                        <p className="mt-0.5 text-[11px] text-[#dc2626]">
                          {reg.isBanned ? 'Banned' : ''}{reg.isBanned && reg.isDisable ? ' · ' : ''}{reg.isDisable ? 'Disabled' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-3">
              <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
