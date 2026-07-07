import { Trash2, RotateCcw } from 'lucide-react'
import Badge from '../../../../components/Badge'
import { formatDate } from '../../../../utils/format'

const dangerBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]'

export function trackColumns(onDelete, onRestore) {
  return [
    { key: 'title', header: 'Track Title', render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.title}</span> },
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
