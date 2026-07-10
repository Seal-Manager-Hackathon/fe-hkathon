import { Link } from 'react-router-dom'
import Avatar from '../../../components/Avatar'
import Badge from '../../../components/Badge'
import { roleBadge } from '../../../constants/commonOptions'

/**
 * User detail page header with avatar, name, and badges.
 * Receives user data via props — no API import.
 *
 * @param {{
 *   user: object,
 *   fullName: string,
 * }} props
 */
export default function UserDetailHeader({ user, fullName }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-5">
        <Avatar src={user.avatarUrl} name={fullName} size="h-20 w-20" textSize="text-[24px]" />
        <div>
          <h1 className="text-[24px] font-bold text-[#1f2f3a] leading-tight sm:text-[28px]">{fullName}</h1>
          <p className="mt-1 text-[14px] text-gray-400">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge label={user.role} className={roleBadge[user.role] || ''} />
            {user.isDisable && <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />}
            {user.isVerified ? (
              <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" />
            ) : (
              <Badge label="Not verified" className="bg-[#fce4ec] text-[#c62828]" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
