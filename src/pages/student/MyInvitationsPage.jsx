import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Send, Search, Clock, CheckCircle, XCircle, AlertTriangle,
  Check, X, Users, Inbox,
} from 'lucide-react'
import {
  getStudentReceivedInvitations,
  acceptStudentInvitation,
  rejectStudentInvitation,
} from '../../api/student'
import Pagination from '../../components/Pagination'
import Avatar from '../../components/Avatar'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'
import { toast, confirm } from '../../utils/toast'

const PAGE_SIZE = 10

const STATUS_FILTERS = [
  { key: '', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Accepted', label: 'Accepted' },
  { key: 'Rejected', label: 'Rejected' },
  { key: 'Expired', label: 'Expired' },
]

const INV_STATUS = {
  Pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60', icon: Clock },
  Accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60', icon: CheckCircle },
  Rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 ring-1 ring-red-200/60', icon: XCircle },
  Expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60', icon: AlertTriangle },
}

export default function MyInvitationsPage() {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actingId, setActingId] = useState(null)
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
        const result = await getStudentReceivedInvitations(params)
        if (!cancelled) {
          setItems(result.items || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Cannot load invitations.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [pageIndex, searchTerm, statusFilter, refreshKey])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  async function handleAccept(invitation) {
    const ok = await confirm('Accept Invitation', `Accept invitation to join "${invitation.teamName}"?`)
    if (!ok) return
    setActingId(invitation.id)
    try {
      await acceptStudentInvitation(invitation.id)
      toast.success(`Accepted invitation from ${invitation.teamName}`)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      const msg = err?.response?.data?.message
      if (msg?.toLowerCase().includes('complete your profile')) {
        toast.error('Please complete your profile first.')
        // Could redirect to profile edit page
      } else {
        toast.error(msg || 'Cannot accept invitation.')
      }
    } finally {
      setActingId(null)
    }
  }

  async function handleReject(invitation) {
    const ok = await confirm('Reject Invitation', `Reject invitation to join "${invitation.teamName}"?`)
    if (!ok) return
    setActingId(invitation.id)
    try {
      await rejectStudentInvitation(invitation.id)
      toast.success(`Rejected invitation from ${invitation.teamName}`)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot reject invitation.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1f2f3a]">My Invitations</h1>
            <p className="mt-1 text-[14px] text-[#5a6a73]">Invitations to join teams from other members</p>
          </div>
          <div className="relative w-full sm:w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6]" />
            <input
              type="text"
              placeholder="Search by team name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(1) }}
              className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2 pl-9 pr-3 text-[13px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
            />
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
              <Inbox size={28} />
            </div>
            <h3 className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">No invitations</h3>
            <p className="max-w-xs text-center text-[14px] text-[#5a6a73]">
              {searchTerm || statusFilter ? 'No invitations match your filters.' : 'You haven\'t received any team invitations yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((inv) => {
              const st = INV_STATUS[inv.status] || INV_STATUS.Pending
              const Icon = st.icon
              const isPending = inv.status === 'Pending'
              const acting = actingId === inv.id

              return (
                <div
                  key={inv.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <Avatar
                      src={inv.sentByAvatarUrl}
                      name={`${inv.sentByFirstName} ${inv.sentByLastName}`}
                      size="h-10 w-10"
                      textSize="text-[14px]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{inv.teamName}</h4>
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', st.cls)}>
                          <Icon size={10} />
                          {st.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-[#5a6a73]">
                        Invited by {inv.sentByFirstName} {inv.sentByLastName} &middot; {formatDate(inv.createdAt)}
                      </p>
                      {inv.limitTime && (
                        <p className="text-[11px] text-[#8a9ba6]">Expires {formatDate(inv.limitTime)}</p>
                      )}
                    </div>
                  </div>
                  {isPending && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => handleAccept(inv)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#10b981] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#059669] disabled:opacity-50"
                      >
                        <Check size={14} />
                        {acting ? '...' : 'Accept'}
                      </button>
                      <button
                        type="button"
                        disabled={acting}
                        onClick={() => handleReject(inv)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[12px] font-semibold text-[#dc2626] transition-colors hover:bg-[#fee2e2] disabled:opacity-50"
                      >
                        <X size={14} />
                        {acting ? '...' : 'Reject'}
                      </button>
                    </div>
                  )}
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