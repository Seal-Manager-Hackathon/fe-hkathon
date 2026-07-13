import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, FileText, Search, Calendar, Users,
  Clock, XCircle, AlertTriangle, CheckCircle, Eye,
} from 'lucide-react'
import {
  getStudentTeamAllRegisterTeams,
} from '../../../api/student'
import Pagination from '../../../components/Pagination'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'

const PAGE_SIZE = 10

const STATUS_FILTERS = [
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

export default function TeamRegistrationsPage() {
  const { teamId } = useParams()
  const [statusFilter, setStatusFilter] = useState('Approved')

  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
        if (statusFilter) params.status = statusFilter
        const result = await getStudentTeamAllRegisterTeams(teamId, params)
        if (!cancelled) {
          setItems(result.registerTeams || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Không thể tải danh sách đăng ký.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [teamId, pageIndex, statusFilter])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link to={`/teams/${teamId}`} className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
          <ArrowLeft size={16} /> Back to Team
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1f2f3a]">Registration History</h1>
            <p className="mt-1 text-[14px] text-[#5a6a73]">All your team's event registrations</p>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => { setStatusFilter(f.key); setPageIndex(1) }}
              className={cn(
                'rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all cursor-pointer',
                statusFilter === f.key
                  ? 'bg-[#1565c0] text-white shadow-[0_2px_8px_rgba(21,101,192,0.25)]'
                  : 'bg-white text-[#5a6a73] border border-[#d7e0e5] hover:border-[#1565c0]/30 hover:text-[#1565c0]',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-[76px] animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af]">
              <FileText size={28} />
            </div>
            <h3 className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">No registrations found</h3>
            <p className="max-w-xs text-center text-[14px] text-[#5a6a73]">
              {statusFilter ? `No ${statusFilter.toLowerCase()} registrations.` : 'Your team has not registered for any events yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((reg) => {
              const st = REG_STATUSES[reg.status] || REG_STATUSES.Pending
              const Icon = st.icon
              return (
                <div
                  key={reg.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1565c0] to-[#42a5f5] text-white shadow-sm">
                      <FileText size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{reg.eventName}</h4>
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <Icon size={10} />
                          {st.label}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                        {(reg.trackName || reg.topicName) && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} className="text-[#8a9ba6]" />
                            {[reg.trackName, reg.topicName].filter(Boolean).join(' · ')}
                          </span>
                        )}
                        {reg.roundName && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} className="text-[#8a9ba6]" />
                            Round {reg.roundNo}: {reg.roundName}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <FileText size={12} className="text-[#8a9ba6]" />
                          {formatDate(reg.createdAt)}
                        </span>
                      </div>
                      {reg.rejectionReason && (
                        <p className="mt-1 text-[11px] text-[#c62828]">Reason: {reg.rejectionReason}</p>
                      )}
                      {(reg.isBanned || reg.isDisable) && (
                        <p className="mt-1 text-[11px] text-[#dc2626]">{reg.isBanned ? 'Banned' : ''} {reg.isDisable ? 'Disabled' : ''}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/teams/registrations/${reg.id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
                  >
                    <Eye size={15} />
                    View
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
        )}
      </div>
    </div>
  )
}
