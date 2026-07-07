import { Link } from 'react-router-dom'
import Badge from '../../components/Badge'
import TableActions from '../../components/TableActions'
import Avatar from '../../components/Avatar'
import { roleBadge } from '../../constants/adminOptions'
import { formatDate } from '../../utils/format'

export const usersColumns = [
  {
    key: 'user',
    header: 'User',
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <Link
            to={`/admin/users/${row.id}`}
            className="text-[14px] font-semibold text-[#064f5d] hover:underline"
          >
            {row.firstName} {row.lastName}
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
      <Badge label={row.role} className={roleBadge[row.role] || ''} />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      if (row.isDisable) {
        return <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
      }
      return <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
    },
  },
  {
    key: 'verified',
    header: 'Verified',
    render: (row) =>
      row.isVerified ? (
        <Badge label="Yes" className="bg-[#e8f5e9] text-[#2e7d32]" />
      ) : (
        <Badge label="No" className="bg-[#fce4ec] text-[#c62828]" />
      ),
  },
  {
    key: 'college',
    header: 'College',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.college || '—'}</p>
    ),
  },
  {
    key: 'createdAt',
    header: 'Joined',
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
      <TableActions viewTo={`/admin/users/${row.id}`} editTo={`/admin/users/${row.id}/edit`} />
    ),
  },
]
