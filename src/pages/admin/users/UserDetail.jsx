import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Edit, Mail, Shield, Calendar, Hash, GraduationCap, BadgeCheck,
  Phone, MapPin, AlertTriangle, Clock, FileText,
} from 'lucide-react'
import { getUserDetail } from '../../../api/admin'
import { roleBadge } from '../../../constants/adminOptions'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getUserDetail(id)
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message || 'Failed to load user detail.'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  // Error
  if (error) {
    const isNotFound = error === 'User Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'User not found' : error}
        </p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">User not found.</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    )
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
  const isDisabled = user.isDisable

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Users
        </Link>
      </div>

      {/* === Profile-style header === */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            src={user.avatarUrl}
            name={fullName}
            size="h-16 w-16 sm:h-20 sm:w-20"
            textSize="text-[20px] sm:text-[28px]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
                {fullName}
              </h1>
              <Badge label={user.role} className={roleBadge[user.role] || ''} />
              {isDisabled ? (
                <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
              ) : (
                <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
              )}
            </div>
            {user.bio && (
              <p className="mt-1 sm:mt-2 text-[13px] sm:text-[14px] text-gray-400">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <Link
          to={`/admin/users/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit User
        </Link>
      </div>

      {/* === Section cards === */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CardPanel title="Personal Information">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Full Name" icon={BadgeCheck}>
              <p className="text-[14px] font-medium text-[#1f2f3a]">{fullName}</p>
            </InfoRow>
            <InfoRow label="Email" icon={Mail}>
              <p className="text-[14px] text-[#064f5d]">{user.email}</p>
            </InfoRow>
            <InfoRow label="Phone" icon={Phone}>
              <p className="text-[14px] text-[#1f2f3a]">{user.phoneNumber || '—'}</p>
            </InfoRow>
            <InfoRow label="Date of Birth" icon={Calendar}>
              <p className="text-[14px] text-[#1f2f3a]">{user.dateOfBirth ? formatDateTime(user.dateOfBirth) : '—'}</p>
            </InfoRow>
            <InfoRow label="Address" icon={MapPin}>
              <p className="text-[14px] text-[#1f2f3a]">{user.address || '—'}</p>
            </InfoRow>
            <InfoRow label="Bio" icon={FileText}>
              <p className="text-[14px] text-[#1f2f3a] whitespace-pre-wrap">{user.bio || '—'}</p>
            </InfoRow>
            <InfoRow label="College" icon={GraduationCap}>
              <p className="text-[14px] text-[#1f2f3a]">{user.college || '—'}</p>
            </InfoRow>
            <InfoRow label="Student ID" icon={Hash}>
              <p className="text-[14px] font-mono text-[13px] text-gray-500">{user.studentId || '—'}</p>
            </InfoRow>
            <InfoRow label="Role" icon={Shield}>
              <Badge label={user.role} className={roleBadge[user.role] || ''} />
            </InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Account Status">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Status" icon={BadgeCheck}>
              {isDisabled ? (
                <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
              ) : (
                <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
              )}
            </InfoRow>
            <InfoRow label="Verified" icon={Shield}>
              {user.isVerified ? (
                <Badge label="Verified" className="bg-[#e8f5e9] text-[#2e7d32]" />
              ) : (
                <Badge label="Not verified" className="bg-[#fce4ec] text-[#c62828]" />
              )}
            </InfoRow>
            <InfoRow label="Verified At" icon={Clock}>
                <p className="text-[14px] text-[#1f2f3a]">{user.verifyEmailAt ? formatDateTime(user.verifyEmailAt) : '—'}</p>
              </InfoRow>
            <InfoRow label="Ban Reason" icon={AlertTriangle}>
              <p className="text-[14px] text-[#c62828]">{user.banReason || '—'}</p>
            </InfoRow>
            <InfoRow label="Banned At" icon={AlertTriangle}>
              <p className="text-[14px] text-[#1f2f3a]">{user.bannedAt ? formatDateTime(user.bannedAt) : '—'}</p>
            </InfoRow>
            <InfoRow label="Created" icon={Calendar}>
              <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(user.createdAt)}</p>
            </InfoRow>
            <InfoRow label="Last Updated" icon={Clock}>
              <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(user.updatedAt)}</p>
            </InfoRow>
          </div>
        </CardPanel>

      </div>
    </div>
  )
}
