import { Link } from 'react-router-dom'
import { Eye, Trophy, Play, Flag, CircleDot, Calendar } from 'lucide-react'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'

export function hackathonColumns() {
  return [
    {
      key: 'name',
      header: 'Name',
      headerIcon: Trophy,
      render: (row) => (
        <Link to={`/staff/hackathons/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'startTime',
      header: 'Start',
      headerIcon: Play,
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime',
      header: 'End',
      headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleDot,
      render: (row) => <Badge label={row.status} className={statusBadge[row.status] || 'bg-[#f5f5f5] text-[#757575]'} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/staff/hackathons/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]
}
