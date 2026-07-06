import { Link } from 'react-router-dom'
import { Edit, Mail, Shield, Calendar, Hash, Clock } from 'lucide-react'
import { mockAdminUser } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'

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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e3f2fd] text-[28px] font-bold text-[#1565c0]">
            {profile.avatarLetter}
          </div>
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
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Full Name</span>
              <p className="text-[14px] font-medium text-[#1f2f3a]">{profile.fullName}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Mail className="inline h-3.5 w-3.5 mr-1" />
                Email
              </span>
              <p className="text-[14px] text-[#064f5d]">{profile.email}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Phone</span>
              <p className="text-[14px] text-[#1f2f3a]">{profile.phone}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Location</span>
              <p className="text-[14px] text-[#1f2f3a]">{profile.location}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Shield className="inline h-3.5 w-3.5 mr-1" />
                Role
              </span>
              <Badge label={profile.role} className="bg-[#f3e5f5] text-[#7b1fa2]" />
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Status</span>
              <Badge label={profile.status} className="bg-[#e8f5e9] text-[#2e7d32]" />
            </div>
          </div>
        </CardPanel>

        <CardPanel title="Activity & Security">
          <div className="divide-y divide-[#f5f5f5]">
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[140px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Calendar className="inline h-3.5 w-3.5 mr-1" />
                Member Since
              </span>
              <p className="text-[14px] text-[#1f2f3a]">{profile.joined}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[140px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Clock className="inline h-3.5 w-3.5 mr-1" />
                Last Login
              </span>
              <p className="text-[14px] text-[#1f2f3a]">{profile.lastLogin}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[140px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Hash className="inline h-3.5 w-3.5 mr-1" />
                Account ID
              </span>
              <p className="text-[14px] font-mono text-[13px] text-gray-500">ADM-2025-0042</p>
            </div>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}
