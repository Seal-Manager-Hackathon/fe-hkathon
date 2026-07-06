import { useParams, Link } from 'react-router-dom'
import { Edit, Mail, Calendar, Hash, UserCheck } from 'lucide-react'
import { allUsers, roleBadge, userStatusBadge } from '../../data/mockAdminData'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import InfoRow from '../../components/InfoRow'
import Avatar from '../../components/Avatar'

export default function UserDetail() {
  const { id } = useParams()
  const user = allUsers.find((u) => u.id === id)

  if (!user) {
    return <NotFoundState entity="User" fallbackTo="/admin/users" />
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback="/admin/users" label="Back to Users" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <Avatar src={user.avatar} name={user.name} size="h-14 w-14 sm:h-16 sm:w-16" textSize="text-[20px] sm:text-[24px]" />
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{user.name}</h1>
              <Badge label={user.role} className={roleBadge[user.role]} />
              <Badge label={user.status} className={userStatusBadge[user.status]} />
            </div>
            <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-3 text-[12px] sm:text-[13px] text-gray-400">
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
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit User
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardPanel title="Account Information">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Full Name" icon={UserCheck}><p className="text-[14px] font-medium text-[#1f2f3a]">{user.name}</p></InfoRow>
            <InfoRow label="Email" icon={Mail}><p className="text-[14px] text-[#064f5d]">{user.email}</p></InfoRow>
            <InfoRow label="User ID" icon={Hash}><p className="text-[14px] text-gray-500 font-mono text-[13px]">{user.id}</p></InfoRow>
            <InfoRow label="Role"><Badge label={user.role} className={roleBadge[user.role]} /></InfoRow>
            <InfoRow label="Status"><Badge label={user.status} className={userStatusBadge[user.status]} /></InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Activity">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Submissions" icon={Hash}><p className="text-[20px] font-bold text-[#064f5d]">{user.submissions}</p></InfoRow>
            <InfoRow label="Joined" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{user.joined}</p></InfoRow>
            <InfoRow label="Account Status" icon={UserCheck}>
              {user.status === 'Active' ? (
                <p className="text-[14px] text-[#2e7d32]">This account is active and has full access to the platform.</p>
              ) : (
                <p className="text-[14px] text-[#757575]">This account is currently inactive.</p>
              )}
            </InfoRow>
          </div>
        </CardPanel>
      </div>
    </div>
  )
}
