import { Link } from 'react-router-dom'
import Badge from '../../components/Badge'
import TableActions from '../../components/TableActions'
import NotificationTarget from '../../components/NotificationTarget'
import { formatDate } from '../../utils/format'

/**
 * Builds table columns for the NotificationsManagement list.
 * @param {Object} targetDetails - resolved user/team map keyed by userId / "team:teamId"
 * @returns {Array} column descriptors for BaseTable
 */
export function notificationsColumns(targetDetails = {}) {
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
        <TableActions viewTo={`/admin/notifications/${row.id}`} editTo={`/admin/notifications/${row.id}/edit`} />
      ),
    },
  ]
}
