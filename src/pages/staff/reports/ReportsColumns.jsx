import { Link } from 'react-router-dom'
import { Eye, FileText, User, Flag, Calendar, CheckCircle, XCircle } from 'lucide-react'
import Badge from '../../../components/Badge'
import StaffNotificationTarget from '../../../components/StaffNotificationTarget'
import { reportStatusBadge, reportTypeBadge } from '../../../constants/commonOptions'
import { formatDateTime } from '../../../utils/format'

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'

/**
 * Builds table columns for the ReportsManagement list.
 * @param {Object} userDetails - resolved user map keyed by userId
 * @param {Object} [callbacks] - action callbacks
 * @param {(id: string) => void} [callbacks.onResolve] - resolve report callback
 * @param {(id: string) => void} [callbacks.onReject] - reject report callback
 * @returns {Array} column descriptors for BaseTable
 */
export function reportsColumns(userDetails = {}, callbacks = {}) {
  return [
    {
      key: 'title',
      header: 'Report',
      headerIcon: FileText,
      render: (row) => (
        <div>
          <Link
            to={`/staff/reports/${row.id}`}
            className="block max-w-[280px] truncate text-[14px] font-semibold text-[#064f5d] hover:underline"
          >
            {row.title}
          </Link>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Reported By',
      headerIcon: User,
      render: (row) => (
        <StaffNotificationTarget
          targetType="Personal"
          userId={row.userId}
          details={userDetails}
        />
      ),
    },
    {
      key: 'typeReport',
      header: 'Type',
      headerIcon: FileText,
      render: (row) => (
        <Badge label={row.typeReport} className={reportTypeBadge[row.typeReport] || 'bg-[#f5f5f5] text-[#757575]'} />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: Flag,
      render: (row) => (
        <Badge label={row.status === 'Reject' ? 'Rejected' : row.status} className={reportStatusBadge[row.status] || ''} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => (
        <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => {
        const isPending = row.status === 'Pending'
        return (
          <div className="flex items-center justify-end gap-2">
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => callbacks.onResolve?.(row.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.97]"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Resolve
                </button>
                <button
                  type="button"
                  onClick={() => callbacks.onReject?.(row.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-rose-600 transition-colors hover:bg-rose-50 active:scale-[0.97]"
                >
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </button>
              </>
            )}
            <Link to={`/staff/reports/${row.id}`} className={actionBtnClass}>
              <Eye className="h-3.5 w-3.5" /> View
            </Link>
          </div>
        )
      },
    },
  ]
}