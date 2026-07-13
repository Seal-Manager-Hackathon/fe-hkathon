import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react'
import { getStudentTeamInvitations } from '../../../api/student'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import Avatar from '../../../components/Avatar'
import Pagination from '../../../components/Pagination'

const INVITE_STATUS = {
  Pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60', icon: Clock },
  Accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60', icon: CheckCircle },
  Rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 ring-1 ring-red-200/60', icon: XCircle },
  Expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60', icon: AlertTriangle },
}

export default function TeamInvitationsSection({ teamId }) {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 10

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const result = await getStudentTeamInvitations(teamId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) {
          setItems(result.items || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [teamId, pageIndex, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)
  if (loading) return <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-[56px] animate-pulse rounded-lg bg-gray-100" />)}</div>

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8">
      <Send size={24} className="mb-2 text-[#8a9ba6]" /><p className="text-[13px] text-[#7a8e99]">No invitations sent yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-2">
        {items.map((inv) => {
          const cfg = INVITE_STATUS[inv.status] || INVITE_STATUS.Pending
          const Icon = cfg.icon
          return (
            <div key={inv.id} className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar src={inv.invitedUserAvatarUrl} name={`${inv.invitedUserFirstName} ${inv.invitedUserLastName}`} size="h-9 w-9" textSize="text-[13px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{inv.invitedUserFirstName} {inv.invitedUserLastName}</p>
                  <p className="truncate text-[12px] text-[#8a9ba6]">{inv.invitedUserEmail}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold', cfg.cls)}><Icon size={12} />{cfg.label}</span>
                {inv.limitTime && <span className="text-[11px] text-[#8a9ba6]">Expires {formatDate(inv.limitTime)}</span>}
              </div>
            </div>
          )
        })}
      </div>
      {totalPages > 1 && <div className="mt-3"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
    </div>
  )
}
