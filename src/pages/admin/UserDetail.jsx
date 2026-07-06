import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, Mail, Hash, UserCheck } from 'lucide-react'
import { allUsers, roleBadge, userStatusBadge } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'

export default function UserDetail() {
  const { id } = useParams()
  const user = allUsers.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">User not found.</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          ← Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-8">
      <Link
        to="/admin/users"
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e3f2fd] text-[24px] font-bold text-[#1565c0]">
            {user.avatar || user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold text-[#1f2f3a]">{user.name}</h1>
              <Badge label={user.role} className={roleBadge[user.role]} />
              <Badge label={user.status} className={userStatusBadge[user.status]} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Joined {user.joined}
              </span>
            </div>
          </div>
        </div>
        <Link
          to={`/admin/users/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <Edit className="h-4 w-4" />
          Edit User
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CardPanel title="Account Information">
          <div className="divide-y divide-[#f5f5f5]">
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Full Name</span>
              <p className="text-[14px] font-medium text-[#1f2f3a]">{user.name}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Email</span>
              <p className="text-[14px] text-[#064f5d]">{user.email}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">User ID</span>
              <p className="text-[14px] text-gray-500 font-mono text-[13px]">{user.id}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Role</span>
              <Badge label={user.role} className={roleBadge[user.role]} />
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">Status</span>
              <Badge label={user.status} className={userStatusBadge[user.status]} />
            </div>
          </div>
        </CardPanel>

        <CardPanel title="Activity">
          <div className="divide-y divide-[#f5f5f5]">
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Hash className="inline h-3.5 w-3.5 mr-1" />
                Submissions
              </span>
              <p className="text-[20px] font-bold text-[#064f5d]">{user.submissions}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">
                <Calendar className="inline h-3.5 w-3.5 mr-1" />
                Joined
              </span>
              <p className="text-[14px] text-[#1f2f3a]">{user.joined}</p>
            </div>
            <div className="flex items-start gap-6 px-5 py-4">
              <span className="w-[120px] shrink-0 text-[13px] font-semibold text-gray-400">
                <UserCheck className="inline h-3.5 w-3.5 mr-1" />
                Account Status
              </span>
              <div>
                {user.status === 'Active' ? (
                  <p className="text-[14px] text-[#2e7d32]">This account is active and has full access to the platform.</p>
                ) : (
                  <p className="text-[14px] text-[#757575]">This account is currently inactive.</p>
                )}
              </div>
            </div>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}