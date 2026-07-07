import { Trash2, RotateCcw, ArrowLeftRight, Edit, Hash, Calendar, Play, Flag, Users, CircleCheck, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const dangerBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]'
const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]'
const swapBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#bbdefb]'

export function roundColumns(onSwap, onDelete, onRestore) {
  return [
    { key: 'roundNo', header: '#', headerIcon: Hash, render: (row) => <span className="text-[13px] text-gray-500">Round {row.roundNo}</span> },
    { key: 'name', header: 'Round Name', headerIcon: Calendar, render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span> },
    { key: 'startTime', header: 'Start', headerIcon: Play, render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startTime)}</p> },
    { key: 'endTime', header: 'End', headerIcon: Flag, render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endTime)}</p> },
    { key: 'limitTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isDisable && (
            <button onClick={() => onSwap?.(row)} className={swapBtnClass}>
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
            </button>
          )}
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <>
              <Link to={`/admin/rounds/${row.id}/edit`} className={actionBtnClass}>
                <Edit className="h-3.5 w-3.5" /> Edit
              </Link>
              <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ]
}
