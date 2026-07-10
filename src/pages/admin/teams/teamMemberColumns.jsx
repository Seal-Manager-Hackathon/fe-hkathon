import { Link } from 'react-router-dom'
import { User, Shield, Crown, CircleCheck, MoreHorizontal, Eye } from 'lucide-react'
import Avatar from '../../../components/Avatar'
import Badge from '../../../components/Badge'

/**
 * Table column definitions for team member list.
 */
export const teamMemberColumns = [
  { key: 'member', header: 'Member', headerIcon: User, render: (row) => (
    <div className="flex items-center gap-3">
      <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
      <div>
        <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p>
        <p className="text-[12px] text-gray-400">{row.email}</p>
      </div>
    </div>
  )},
  { key: 'role', header: 'Role', headerIcon: Shield, render: (row) => row.isLeader ? (
    <div className="inline-flex items-center gap-1.5"><Crown className="h-4 w-4 text-[#ffca28]" /><span className="text-[13px] font-semibold text-[#e65100]">Leader</span></div>
  ) : <span className="text-[13px] text-[#1f2f3a]">Member</span> },
  { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => row.status === 'Active' ? <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label={row.status} className="bg-[#f5f5f5] text-[#757575]" /> },
  { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
    <Link to={`/admin/users/${row.userId}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"><Eye className="h-3.5 w-3.5" />View</Link>
  )},
]
