import { Link } from 'react-router-dom'
import { Eye, FileText, User, Flag, Calendar } from 'lucide-react'
import Badge from '../../../components/Badge'
import NotificationTarget from '../../../components/NotificationTarget'
import { reportStatusBadge, reportTypeBadge } from '../../../constants/adminOptions'
import { formatDateTime } from '../../../utils/format'

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'

/**
 * Builds table columns for the ReportsManagement list.
 * @param {Object} userDetails - resolved user map keyed by userId
 * @returns {Array} column descriptors for BaseTable
 */
export function reportsColumns(userDetails = {}) {
  return [
    {
      key: 'title',
      header: 'Report',
      headerIcon: FileText,
      render: (row) => (
        <div>
          <Link
            to={`/admin/reports/${row.id}`}
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
        <NotificationTarget
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
        <Badge label={row.status} className={reportStatusBadge[row.status] || ''} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => (
        <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/reports/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]
}