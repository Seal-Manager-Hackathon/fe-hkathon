import { Link } from 'react-router-dom'
import { Edit, Mail, Shield, Calendar, Hash, GraduationCap, BadgeCheck, UserCheck } from 'lucide-react'
import Badge from '../Badge'
import CardPanel from '../CardPanel'
import InfoRow from '../InfoRow'
import Avatar from '../Avatar'
import { formatDate } from '../../utils/format'

export default function ProfileInfo({ user, editTo, children }) {
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.role === 'Admin' ? 'Admin' : 'User'

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar src={user?.avatarUrl} name={displayName} size="h-16 w-16 sm:h-20 sm:w-20" textSize="text-[20px] sm:text-[28px]" />
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{displayName}</h1>
              <Badge
                label={user?.role || 'Student'}
                className={user?.role === 'Admin' ? 'bg-[#f3e5f5] text-[#7b1fa2]' : 'bg-[#e3f2fd] text-[#1565c0]'}
              />
              {user?.status && (
                <Badge label={user.status} className="bg-[#e8f5e9] text-[#2e7d32]" />
              )}
            </div>
            {user?.bio && <p className="mt-1 sm:mt-2 text-[13px] sm:text-[14px] text-gray-400">{user.bio}</p>}
          </div>
        </div>
        <Link
          to={editTo}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      <CardPanel title="Account Information">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="User ID" icon={Hash}>
            <p className="text-[14px] font-mono text-[13px] text-gray-500">{user?.id?.slice(0, 8) || '—'}</p>
          </InfoRow>
          <InfoRow label="Full Name" icon={UserCheck}><p className="text-[14px] font-medium text-[#1f2f3a]">{displayName}</p></InfoRow>
          <InfoRow label="Email" icon={Mail}><p className="text-[14px] text-[#064f5d]">{user?.email || '—'}</p></InfoRow>
          <InfoRow label="College" icon={GraduationCap}><p className="text-[14px] text-[#1f2f3a]">{user?.college || '—'}</p></InfoRow>
          <InfoRow label="Role" icon={Shield}>
            <Badge
              label={user?.role || 'Student'}
              className={user?.role === 'Admin' ? 'bg-[#f3e5f5] text-[#7b1fa2]' : 'bg-[#e3f2fd] text-[#1565c0]'}
            />
          </InfoRow>
          <InfoRow label="Status" icon={BadgeCheck}><Badge label={user?.status || 'Active'} className="bg-[#e8f5e9] text-[#2e7d32]" /></InfoRow>
          <InfoRow label="Verified" icon={Shield}>
            {user?.isVerified ? (
              <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" />
            ) : (
              <Badge label="Not verified" className="bg-[#fff3e0] text-[#e65100]" />
            )}
          </InfoRow>
          <InfoRow label="Member Since" icon={Calendar}>
            <p className="text-[14px] text-[#1f2f3a]">{formatDate(user?.createdAt)}</p>
          </InfoRow>
        </div>
      </CardPanel>

      {children}
    </>
  )
}