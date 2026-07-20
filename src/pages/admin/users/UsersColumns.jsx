import { Link } from 'react-router-dom'
import { Eye, Edit, User, Shield, UserCheck, GraduationCap, Calendar, MoreHorizontal, CircleCheck, Ban, Circle, AlertTriangle } from 'lucide-react'
import Badge from '../../../components/Badge'
import Avatar from '../../../components/Avatar'
import { roleBadge } from '../../../constants/commonOptions'
import { formatDateTime } from '../../../utils/format'

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const banBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fff3e0] px-3 py-1.5 text-[13px] font-semibold text-[#e65100] transition-colors hover:bg-[#ffe0b2] w-[84px]'
const unbanBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[84px]'

/**
 * Builds table columns for the UsersManagement list.
 * @returns {Array} column descriptors
 */
export function usersColumns(onBan, onUnban) {
  return [
    {
      key: 'user',
      header: 'User',
      headerIcon: User,
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
      headerIcon: Shield,
      render: (row) => (
        <Badge label={row.role} className={roleBadge[row.role] || ''} />
      ),
    },
    {
      key: 'college',
      header: 'College',
      headerIcon: GraduationCap,
      render: (row) => (
        <p className="text-[13px] text-[#1f2f3a]">{row.college || '—'}</p>
      ),
    },
    {
      key: 'verified',
      header: 'Verified',
      headerIcon: UserCheck,
      render: (row) =>
        row.isVerified ? (
          <Badge label="Yes" className="bg-[#e8f5e9] text-[#2e7d32]" />
        ) : (
          <Badge label="No" className="bg-[#fce4ec] text-[#c62828]" />
        ),
    },
    {
      key: 'banned',
      header: 'Banned',
      headerIcon: AlertTriangle,
      render: (row) =>
        row.bannedAt ? (
          <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" />
        ) : (
          <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />
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
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/users/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          <Link to={`/admin/users/${row.id}/edit`} className={actionBtnClass}>
            <Edit className="h-3.5 w-3.5" /> Edit
          </Link>
          {row.bannedAt ? (
            <button onClick={() => onUnban?.(row)} className={unbanBtnClass}>
              <Circle className="h-3.5 w-3.5" /> Unban
            </button>
          ) : (
            <button onClick={() => onBan?.(row)} className={banBtnClass}>
              <Ban className="h-3.5 w-3.5" /> Ban
            </button>
          )}
        </div>
      ),
    },
  ]
}
