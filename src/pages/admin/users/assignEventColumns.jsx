import { Link } from 'react-router-dom'
import { Trophy, Shield, CircleCheck, Calendar, Layers, Clock, Ban, MoreHorizontal, Eye } from 'lucide-react'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const eventRoleBadge = {
  Mentor: 'bg-[#e3f2fd] text-[#1565c0] border border-blue-200',
  Judge: 'bg-[#f3e5f5] text-[#6a1b9a] border border-purple-200',
  Staff: 'bg-[#fff3e0] text-[#e65100] border border-orange-200',
}

const eventStatusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

export const assignEventColumns = [
  { key: 'name', header: 'Event', headerIcon: Trophy, render: (row) => (
    <Link to={`/admin/hackathons/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.name}</Link>
  )},
  { key: 'eventRoleName', header: 'Event Role', headerIcon: Shield, render: (row) => (
    <Badge label={row.eventRoleName} className={eventRoleBadge[row.eventRoleName] || 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => (
    <Badge label={row.status} className={eventStatusBadge[row.status] || 'bg-gray-50 text-gray-600'} />
  )},
  { key: 'season', header: 'Season', headerIcon: Calendar, render: (row) => (
    <span className="text-[13px] text-[#1f2f3a]">{row.season || '—'}</span>
  )},
  { key: 'numberRound', header: 'Rounds', headerIcon: Layers, render: (row) => (
    <span className="text-[13px] text-[#1f2f3a]">{row.numberRound ?? '—'}</span>
  )},
  { key: 'startTime', header: 'Start', headerIcon: Clock, render: (row) => (
    <span className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.startTime)}</span>
  )},
  { key: 'endTime', header: 'End', headerIcon: Clock, render: (row) => (
    <span className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.endTime)}</span>
  )},
  { key: 'isDisable', header: 'Event State', headerIcon: Ban, render: (row) => (
    row.isDisable
      ? <Badge label="Disabled" className="bg-[#fce4ec] text-[#c62828]" />
      : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
  )},
  { key: 'createdAt', header: 'Assigned', headerIcon: Calendar, render: (row) => (
    <span className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</span>
  )},
  { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
    <Link to={`/admin/hackathons/${row.id}`} className={viewBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
  )},
]
