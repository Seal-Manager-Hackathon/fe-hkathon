import { Link } from 'react-router-dom'
import { Trophy, FileText, BadgeCheck, Clock4, MoreHorizontal, Eye } from 'lucide-react'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

export const registerStatusBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
}

/**
 * Returns table column definitions for team registration history.
 */
export function teamRegisterColumns(routePrefix = '/admin') {
  return [
    { key: 'eventName', header: 'Hackathon', headerIcon: Trophy, render: (row) => row.eventId ? <Link to={`${routePrefix}/hackathons/${row.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.eventName || '—'}</Link> : <span className="text-[14px] text-gray-400">—</span> },
    { key: 'trackName', header: 'Track', headerIcon: FileText, render: (row) => row.trackId ? <Link to={`${routePrefix}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackName || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span> },
    { key: 'topicName', header: 'Topic', headerIcon: FileText, render: (row) => row.topicId ? <Link to={`${routePrefix}/tracks/${row.trackId}/topics/${row.topicId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.topicName || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span> },
    { key: 'status', header: 'Status', headerIcon: BadgeCheck, render: (row) => <Badge label={row.status} className={registerStatusBadge[row.status] || 'bg-gray-50 text-gray-600'} /> },
    { key: 'createdAt', header: 'Created', headerIcon: Clock4, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <Link to={`${routePrefix}/register-teams/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"><Eye className="h-3.5 w-3.5" />View</Link>
    ) },
  ]
}

export const teamSubmissionColumns = [
  { key: 'round', header: 'Round', headerIcon: Trophy, render: (row) => (
    <div>
      <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.roundName}</p>
      <p className="text-[12px] text-gray-400">{row.trackTitle}{row.topicTitle ? ` / ${row.topicTitle}` : ''}</p>
    </div>
  )},
  { key: 'lastSubmission', header: 'Last Submission', headerIcon: Trophy, render: (row) => {
    const sub = row.lastSubmission
    if (!sub) return <span className="text-[13px] text-gray-400">—</span>
    return (
      <div>
        <Link to={`/admin/submissions/${sub.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{sub.description || sub.url || 'View'}</Link>
        <p className="text-[12px] text-gray-400">{formatDateTime(sub.submittedAt)}</p>
      </div>
    )
  }},
  { key: 'recordCount', header: 'Records', headerIcon: Clock4, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.records?.length || 0} submission(s)</span> },
  { key: 'submittedBy', header: 'Submitted By', headerIcon: Trophy, render: (row) => {
    const by = row.submittedBy
    if (!by) return <span className="text-[13px] text-gray-400">—</span>
    return <span className="text-[13px] text-[#1f2f3a]">{by.firstName} {by.lastName}</span>
  }},
]
