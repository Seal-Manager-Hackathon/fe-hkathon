import { Eye, FileText, Users, CircleCheck, Calendar, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const viewBtnClass =
  'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'
const topicBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-[13px] font-semibold text-[#7b1fa2] transition-colors hover:bg-[#e1bee7]'

export function trackColumns() {
  return [
    { key: 'title', header: 'Track Title', headerIcon: FileText, render: (row) => <Link to={`/staff/hackathons/${row.eventId}/tracks/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.title}</Link> },
    { key: 'maxTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.maxTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isDisable && (
            <Link to={`/staff/hackathons/${row.eventId}/tracks/${row.id}/topics`} className={topicBtnClass}>
              <BookOpen className="h-3.5 w-3.5" /> Topics
            </Link>
          )}
          <Link to={`/staff/hackathons/${row.eventId}/tracks/${row.id}`} className={viewBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]
}
