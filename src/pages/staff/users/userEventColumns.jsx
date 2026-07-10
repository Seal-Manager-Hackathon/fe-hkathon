import { Link } from 'react-router-dom'
import { Trophy, Users, FileText, Ban, CircleCheck, Shield, Calendar, MoreHorizontal, Eye } from 'lucide-react'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const eventStatusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

/**
 * Table column definitions for user event history.
 */
export const userEventColumns = [
  { key: 'eventName', header: 'Event', headerIcon: Trophy, render: (row) => (
    <Link to={`/staff/hackathons/${row.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.eventName}</Link>
  )},
  { key: 'teamName', header: 'Team', headerIcon: Users, render: (row) => (
    row.teamId ? <Link to={`/staff/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.teamName}</Link> : <span className="text-[14px] text-gray-400">—</span>
  )},
  { key: 'trackTitle', header: 'Track', headerIcon: FileText, render: (row) => (
    row.trackId ? <Link to={`/staff/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackTitle || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span>
  )},
  { key: 'topicTitle', header: 'Topic', headerIcon: FileText, render: (row) => (
    row.topicId && row.trackId ? <Link to={`/staff/tracks/${row.trackId}/topics`} className="text-[13px] font-medium text-[#1f2f3a] hover:underline">{row.topicTitle || '—'}</Link> : <span className="text-[13px] text-gray-400">—</span>
  )},
  { key: 'isBanned', header: 'Banned', headerIcon: Ban, render: (row) => (
    row.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />
  )},
  { key: 'eventStatus', header: 'Status', headerIcon: CircleCheck, render: (row) => (
    <Badge label={row.eventStatus} className={eventStatusBadge[row.eventStatus] || 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'status', header: 'Registration', headerIcon: Shield, render: (row) => (
    <Badge label={row.status} className={row.status === 'Approved' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => (
    <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>
  )},
  { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
    <Link to={`/staff/register-teams/${row.registerTeamId}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
  )},
]
