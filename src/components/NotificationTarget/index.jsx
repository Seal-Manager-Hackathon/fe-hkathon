import { Link } from 'react-router-dom'
import { Users, Monitor } from 'lucide-react'
import Avatar from '../Avatar'

/**
 * Renders notification target as a pill: avatar/icon + name, optionally linked.
 *
 * @param {Object} props
 * @param {string} props.targetType - 'Personal' | 'Team' | 'System'
 * @param {string} [props.userId]
 * @param {string} [props.teamId]
 * @param {Object}  [props.details] - resolved map { userId: userObj, 'team:teamId': teamObj }
 */
export default function NotificationTarget({ targetType, userId, teamId, details = {} }) {
  // Personal → user avatar + name, link to user detail
  if (targetType === 'Personal' && userId) {
    const user = details[userId]
    const name = user ? `${user.firstName} ${user.lastName}`.trim() : userId
    return (
      <Link
        to={`/admin/users/${userId}`}
        className="inline-flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-[#e3f2fd]/60"
      >
        <Avatar src={user?.avatarUrl} name={name} size="h-7 w-7" textSize="text-[10px]" />
        <span className="text-[13px] font-medium text-[#064f5d] hover:underline">
          {name}
        </span>
      </Link>
    )
  }

  // Team → icon + name, link to team detail
  if (targetType === 'Team' && teamId) {
    const team = details[`team:${teamId}`]
    const name = team ? team.name : teamId
    return (
      <Link
        to={`/admin/teams/${teamId}`}
        className="inline-flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-[#e8f5e9]/60"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9]">
          <Users className="h-3.5 w-3.5 text-[#2e7d32]" />
        </div>
        <span className="text-[13px] font-medium text-[#064f5d] hover:underline">
          {name}
        </span>
      </Link>
    )
  }

  // System → badge with icon, non-clickable
  return (
    <div className="inline-flex items-center gap-2 rounded-md px-1 py-0.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f3e5f5]">
        <Monitor className="h-3.5 w-3.5 text-[#7b1fa2]" />
      </div>
      <span className="text-[13px] font-medium text-[#7b1fa2]">System</span>
    </div>
  )
}
