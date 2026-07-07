import { useAuth } from '../../../context/AuthContext'
import { Link } from 'react-router-dom'
import ProfileInfo from '../../../components/ProfileInfo'

export default function AdminProfile() {
  const { user } = useAuth()

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
      <ProfileInfo user={user} editTo="/admin/profile/edit" />
    </div>
  )
}
