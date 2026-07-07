import { Link } from 'react-router-dom'
import { BellPlus } from 'lucide-react'
import { allNotifications, notificationTypeBadge, notificationStatusBadge } from '../../data/mockAdminData'
import DataManagementPage from '../../components/DataManagementPage'
import Badge from '../../components/Badge'
import TableActions from '../../components/TableActions'
import {
  NOTIFICATION_TYPE_OPTIONS_ALL as TYPE_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS_ALL as STATUS_OPTIONS,
  AUDIENCE_OPTIONS_ALL,
} from '../../constants/adminOptions'

const columns = [
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
    key: 'type',
    header: 'Type',
    render: (row) => (
      <Badge label={row.type} className={notificationTypeBadge[row.type]} />
    ),
  },
  {
    key: 'audience',
    header: 'Audience',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.audience}</p>
    ),
  },
  {
    key: 'sentBy',
    header: 'Sent By',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.sentBy}</p>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge label={row.status} className={notificationStatusBadge[row.status]} />
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.date}</p>
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

export default function NotificationsManagement() {
  return (
    <DataManagementPage
      entityName="Notifications"
      entityRouteBase="notifications"
      createLabel="Create Notification"
      createIcon={BellPlus}
      countLabel="system-wide notifications for all users."
      searchPlaceholder="Search by title..."
      searchKeys={['title']}
      filters={[
        { key: 'type', label: 'Type', options: TYPE_OPTIONS, className: 'w-full sm:w-[180px]' },
        { key: 'status', label: 'Status', options: STATUS_OPTIONS, className: 'w-full sm:w-[160px]' },
        { key: 'audience', label: 'Audience', options: AUDIENCE_OPTIONS_ALL, className: 'w-full sm:w-[180px]' },
      ]}
      data={allNotifications}
      columns={columns}
      pageSize={10}
      emptyText="No notifications match the current filters."
      emptyFallbackText="No notifications in the system yet."
      keyExtractor={(row) => row.id}
    />
  )
}
