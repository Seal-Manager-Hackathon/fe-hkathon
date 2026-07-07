import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { allUsers, roleBadge, userStatusBadge } from '../../data/mockAdminData'
import DataManagementPage from '../../components/DataManagementPage'
import Badge from '../../components/Badge'
import TableActions from '../../components/TableActions'
import Avatar from '../../components/Avatar'

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const columns = [
  {
    key: 'user',
    header: 'User',
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatar} name={row.name} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <Link
            to={`/admin/users/${row.id}`}
            className="text-[14px] font-semibold text-[#064f5d] hover:underline"
          >
            {row.name}
          </Link>
          <p className="text-[12px] text-gray-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (row) => (
      <Badge label={row.role} className={roleBadge[row.role]} />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge label={row.status} className={userStatusBadge[row.status]} />
    ),
  },
  {
    key: 'submissions',
    header: 'Submissions',
    render: (row) => (
      <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.submissions}</p>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.joined}</p>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    headerClassName: 'text-right',
    className: 'text-right',
    render: (row) => (
      <TableActions viewTo={`/admin/users/${row.id}`} editTo={`/admin/users/${row.id}/edit`} />
    ),
  },
]

export default function UsersManagement() {
  return (
    <DataManagementPage
      entityName="Users"
      entityRouteBase="users"
      createLabel="Create User"
      createIcon={UserPlus}
      countLabel="user accounts."
      searchPlaceholder="Search by name or email..."
      searchKeys={['name', 'email']}
      filters={[
        { key: 'role', label: 'Role', options: ROLE_OPTIONS, className: 'w-full sm:w-[160px]' },
        { key: 'status', label: 'Status', options: STATUS_OPTIONS, className: 'w-full sm:w-[160px]' },
      ]}
      data={allUsers}
      columns={columns}
      pageSize={10}
      emptyText="No users match the current filters."
      emptyFallbackText="No users in the system yet."
      keyExtractor={(row) => row.id}
    />
  )
}
