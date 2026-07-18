import { Link } from 'react-router-dom'
import { Users, Monitor, User } from 'lucide-react'
import Avatar from '../Avatar'

/**
 * Renders notification target as a pill for the Staff role — links go to /staff/...
 *
 * @param {Object} props
 * @param {string} props.targetType - 'Personal' | 'Team' | 'System'
 * @param {string} [props.userId]
 * @param {string} [props.teamId]
 * @param {Object}  [props.details] - resolved map { userId: userObj, 'team:teamId': teamObj }
 */
export default function StaffNotificationTarget({ targetType, userId, teamId, details = {} }) {
  const typeLabel = {
    Personal: 'User',
    Team: 'Team',
    System: 'System',
  }[targetType] || targetType

  const typeColors = {
    User: 'bg-[#e3f2fd] text-[#0d47a1]',
    Team: 'bg-[#e8f5e9] text-[#1b5e20]',
    System: 'bg-[#f3e5f5] text-[#4a148c]',
  }

  const pillCls = 'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold'

  // Personal → user avatar + name, link to user detail
  if (targetType === 'Personal' && userId) {
    const loaded = userId in details
    const user = details[userId]
    const name = loaded ? (user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown') : '-'
    if (!loaded) {
      return (
        <div className="inline-flex items-center gap-2 rounded-md px-1 py-0.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceff1]">
            <User className="h-3.5 w-3.5 text-[#bdbdbd]" />
          </div>
          <span className="text-[13px] text-gray-300">-</span>
          <span className={`${pillCls} ${typeColors.User}`}>User</span>
        </div>
      )
    }
    return (
      <Link
        to={`/staff/users/${userId}`}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-[#e3f2fd]/60"
      >
        <Avatar src={user?.avatarUrl} name={name} size="h-7 w-7" textSize="text-[10px]" />
        <span className="text-[13px] font-medium text-[#064f5d] hover:underline">
          {name}
        </span>
        <span className={`${pillCls} ${typeColors.User}`}>User</span>
      </Link>
    )
  }

  // Team → icon + name, link to team detail
  if (targetType === 'Team' && teamId) {
    const key = `team:${teamId}`
    const loaded = key in details
    const team = details[key]
    const name = loaded ? (team ? team.name : 'Unknown') : '-'
    if (!loaded) {
      return (
        <div className="inline-flex items-center gap-2 rounded-md px-1 py-0.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceff1]">
            <Users className="h-3.5 w-3.5 text-[#bdbdbd]" />
          </div>
          <span className="text-[13px] text-gray-300">-</span>
          <span className={`${pillCls} ${typeColors.Team}`}>Team</span>
        </div>
      )
    }
    return (
      <Link
        to={`/staff/teams/${teamId}`}
        className="inline-flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-[#e8f5e9]/60"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceff1]">
          <Users className="h-3.5 w-3.5 text-[#78909c]" />
        </div>
        <span className="text-[13px] font-medium text-[#064f5d] hover:underline">
          {name}
        </span>
        <span className={`${pillCls} ${typeColors.Team}`}>Team</span>
      </Link>
    )
  }

  // System → badge with icon, non-clickable
  return (
    <div className="inline-flex items-center gap-2 rounded-md px-1 py-0.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceff1]">
        <Monitor className="h-3.5 w-3.5 text-[#78909c]" />
      </div>
      <span className="text-[13px] font-medium text-[#1f2f3a]">System Notification</span>
      <span className={`${pillCls} ${typeColors.System}`}>System</span>
    </div>
  )
}
