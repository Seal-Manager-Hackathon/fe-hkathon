import { Link } from 'react-router-dom'
import { Edit, Mail, Shield, Calendar, Hash, Clock } from 'lucide-react'
import { mockAdminUser } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'
import InfoRow from '../../components/InfoRow'
import Avatar from '../../components/Avatar'

const profile = {
  ...mockAdminUser,
  fullName: 'Alexandra Grant',
  role: 'Administrator',
  status: 'Active',
  joined: 'Mar 15, 2025',
  lastLogin: 'Jul 07, 2026 at 09:32 AM',
  phone: '+1 (415) 555-0192',
  location: 'San Francisco, CA',
  bio: 'Platform administrator managing hackathon operations, user accounts, and system-wide notifications.',
}

export default function AdminProfile() {
  return (
    <div className="px-8 py-8">
      <BackButton fallback="/admin" label="Back to Dashboard" />

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-5">
          <Avatar name={profile.fullName} size="h-20 w-20" textSize="text-[28px]" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold text-[#1f2f3a]">{profile.fullName}</h1>
              <Badge label={profile.role} className="bg-[#f3e5f5] text-[#7b1fa2]" />
              <Badge label={profile.status} className="bg-[#e8f5e9] text-[#2e7d32]" />
            </div>
            <p className="mt-2 text-[14px] text-gray-400">{profile.bio}</p>
          </div>
        </div>
        <Link
          to="/admin/profile/edit"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CardPanel title="Account Information">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Full Name"><p className="text-[14px] font-medium text-[#1f2f3a]">{profile.fullName}</p></InfoRow>
            <InfoRow label="Email" icon={Mail}><p className="text-[14px] text-[#064f5d]">{profile.email}</p></InfoRow>
            <InfoRow label="Phone"><p className="text-[14px] text-[#1f2f3a]">{profile.phone}</p></InfoRow>
            <InfoRow label="Location"><p className="text-[14px] text-[#1f2f3a]">{profile.location}</p></InfoRow>
            <InfoRow label="Role" icon={Shield}><Badge label={profile.role} className="bg-[#f3e5f5] text-[#7b1fa2]" /></InfoRow>
            <InfoRow label="Status"><Badge label={profile.status} className="bg-[#e8f5e9] text-[#2e7d32]" /></InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Activity & Security">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Member Since" icon={Calendar} labelWidth="w-[140px]"><p className="text-[14px] text-[#1f2f3a]">{profile.joined}</p></InfoRow>
            <InfoRow label="Last Login" icon={Clock} labelWidth="w-[140px]"><p className="text-[14px] text-[#1f2f3a]">{profile.lastLogin}</p></InfoRow>
            <InfoRow label="Account ID" icon={Hash} labelWidth="w-[140px]"><p className="text-[14px] font-mono text-[13px] text-gray-500">ADM-2025-0042</p></InfoRow>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}
