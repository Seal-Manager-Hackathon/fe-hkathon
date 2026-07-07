import { Link } from 'react-router-dom'
import Badge from '../../../components/Badge'
import NotificationTarget from '../../../components/NotificationTarget'
import { formatDateTime } from '../../../utils/format'
import { Eye, Edit, Trash2, RotateCcw, Bell, Target, Calendar, CircleCheck, MoreHorizontal } from 'lucide-react'

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'

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
      header: <span className="inline-flex items-center gap-1.5"><Bell className="h-3.5 w-3.5" />Title</span>,
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
      header: <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5" />Target</span>,
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
      key: 'createdAt',
      header: <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Created</span>,
      render: (row) => (
        <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => {
        if (row.isDisable) {
          return <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        }
        return <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
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
