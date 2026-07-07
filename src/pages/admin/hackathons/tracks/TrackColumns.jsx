import { Trash2, RotateCcw, Pencil, Eye, FileText, Users, CircleCheck, Calendar, MoreHorizontal, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const editBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#bbdefb]'
const topicBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-[13px] font-semibold text-[#7b1fa2] transition-colors hover:bg-[#e1bee7]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'

export function trackColumns(onDelete, onRestore) {
  return [
    { key: 'title', header: 'Track Title', headerIcon: FileText, render: (row) => <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.title}</Link> },
    { key: 'maxTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] text-gray-500">{row.maxTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isDisable && (
            <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.id}/topics`} className={topicBtnClass}>
              <BookOpen className="h-3.5 w-3.5" /> Topics
            </Link>
          )}
          <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]">
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.id}/edit`} className={editBtnClass}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]
}
