import { Trash2, RotateCcw, Pencil, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../../components/Badge'
import { formatDate } from '../../../../utils/format'

const editBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#bbdefb]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]'

export function trackColumns(onDelete, onRestore) {
  return [
    { key: 'title', header: 'Track Title', render: (row) => <Link to={`/admin/hackathons/${row.eventId}/tracks/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.title}</Link> },
    { key: 'description', header: 'Description', render: (row) => <p className="text-[13px] text-gray-500 max-w-[300px] truncate">{row.description || '—'}</p> },
    { key: 'maxTeam', header: 'Max Teams', render: (row) => <span className="text-[13px] text-gray-500">{row.maxTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.createdAt)}</p> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
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
