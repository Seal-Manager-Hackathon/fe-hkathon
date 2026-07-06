import { Link } from 'react-router-dom'
import { Edit, Mail, Shield, Calendar, Hash, Clock, UserCheck, BadgeCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'
import InfoRow from '../../components/InfoRow'
import Avatar from '../../components/Avatar'

export default function AdminProfile() {
  const { user } = useAuth()

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'Admin'

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback="/admin" label="Back to Dashboard" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar src={user?.avatarUrl} name={displayName} size="h-16 w-16 sm:h-20 sm:w-20" textSize="text-[20px] sm:text-[28px]" />
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{displayName}</h1>
              <Badge label={user?.role || 'Admin'} className="bg-[#f3e5f5] text-[#7b1fa2]" />
              {user?.status && (
                <Badge label={user.status} className="bg-[#e8f5e9] text-[#2e7d32]" />
              )}
            </div>
            {user?.bio && <p className="mt-1 sm:mt-2 text-[13px] sm:text-[14px] text-gray-400">{user.bio}</p>}
          </div>
        </div>
        <Link
          to="/admin/profile/edit"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardPanel title="Account Information">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="User ID" icon={Hash}>
              <p className="text-[14px] font-mono text-[13px] text-gray-500">{user?.id?.slice(0, 8) || '—'}</p>
            </InfoRow>
            <InfoRow label="Full Name" icon={UserCheck}><p className="text-[14px] font-medium text-[#1f2f3a]">{displayName}</p></InfoRow>
            <InfoRow label="Email" icon={Mail}><p className="text-[14px] text-[#064f5d]">{user?.email || '—'}</p></InfoRow>
            <InfoRow label="Role" icon={Shield}><Badge label={user?.role || 'Admin'} className="bg-[#f3e5f5] text-[#7b1fa2]" /></InfoRow>
            <InfoRow label="Status" icon={BadgeCheck}><Badge label={user?.status || 'Active'} className="bg-[#e8f5e9] text-[#2e7d32]" /></InfoRow>
            <InfoRow label="Verified" icon={Shield}>
              {user?.isVerified ? (
                <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" />
              ) : (
                <Badge label="Not verified" className="bg-[#fff3e0] text-[#e65100]" />
              )}
            </InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Activity & Security">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Member Since" icon={Calendar}>
              <p className="text-[14px] text-[#1f2f3a]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</p>
            </InfoRow>
            <InfoRow label="Last Login" icon={Clock}>
              <p className="text-[14px] text-[#1f2f3a]">{user?.lastLogin || '—'}</p>
            </InfoRow>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}
