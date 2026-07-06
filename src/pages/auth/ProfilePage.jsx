import { Link } from 'react-router-dom'
import { Edit, Mail, Shield, Calendar, Hash, GraduationCap, BadgeCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'
import InfoRow from '../../components/InfoRow'
import Avatar from '../../components/Avatar'

export default function ProfilePage() {
  const { user } = useAuth()

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || 'User'

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8">
      <BackButton fallback="/" label="Back to Home" />

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-5">
          <Avatar src={user?.avatarUrl} name={displayName} size="h-20 w-20" textSize="text-[28px]" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold text-[#1f2f3a]">{displayName}</h1>
              <Badge label={user?.role || 'Student'} className="bg-[#e3f2fd] text-[#1565c0]" />
              {user?.status && (
                <Badge label={user.status} className="bg-[#e8f5e9] text-[#2e7d32]" />
              )}
            </div>
            {user?.bio && <p className="mt-2 text-[14px] text-gray-400">{user.bio}</p>}
          </div>
        </div>
        <Link
          to="/profile/edit"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
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
          <InfoRow label="Role" icon={Shield}><Badge label={user?.role || 'Student'} className="bg-[#e3f2fd] text-[#1565c0]" /></InfoRow>
          <InfoRow label="Status" icon={BadgeCheck}><Badge label={user?.status || 'Active'} className="bg-[#e8f5e9] text-[#2e7d32]" /></InfoRow>
          <InfoRow label="Verified" icon={Shield}>
            {user?.isVerified ? (
              <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" />
            ) : (
              <Badge label="Not verified" className="bg-[#fff3e0] text-[#e65100]" />
            )}
          </InfoRow>
          <InfoRow label="Member Since" icon={Calendar}>
            <p className="text-[14px] text-[#1f2f3a]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</p>
          </InfoRow>
        </div>
      </CardPanel>
    </div>
  )
}
