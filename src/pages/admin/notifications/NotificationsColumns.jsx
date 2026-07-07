import { Link } from 'react-router-dom'
import Badge from '../../../components/Badge'
import NotificationTarget from '../../../components/NotificationTarget'
import { formatDate } from '../../../utils/format'
import { Eye, Edit, Trash2, RotateCcw } from 'lucide-react'

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]'

/**
 * Builds table columns for the NotificationsManagement list.
 * @param {Object}     targetDetails - resolved user/team map keyed by userId / "team:teamId"
 * @param {function}   onDelete      - (notification) => void
 * @param {function}   onRestore     - (notification) => void
 * @returns {Array} column descriptors for BaseTable
 */
export function notificationsColumns(targetDetails = {}, onDelete, onRestore) {
  return [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <Link
          to={`/admin/notifications/${row.id}`}
          className="block max-w-[280px] truncate text-[14px] font-semibold text-[#064f5d] hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    {
      key: 'targetType',
      header: 'Target',
      render: (row) => (
        <NotificationTarget
          targetType={row.targetType}
          userId={row.userId}
          teamId={row.teamId}
          details={targetDetails}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        if (row.isDisable) {
          return <Badge label="Disabled" className="bg-[#fce4ec] text-[#c62828]" />
        }
        if (row.status === 'Unread') {
          return <Badge label="Unread" className="bg-[#e3f2fd] text-[#1565c0]" />
        }
        if (row.status === 'Read') {
          return <Badge label="Read" className="bg-[#f5f5f5] text-[#757575]" />
        }
        return <Badge label={row.status} className="bg-[#f5f5f5] text-[#757575]" />
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{formatDate(row.createdAt)}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/notifications/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <>
              <Link to={`/admin/notifications/${row.id}/edit`} className={actionBtnClass}>
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
