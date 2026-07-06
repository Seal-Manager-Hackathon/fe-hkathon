import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import ProfileInfo from '../../components/ProfileInfo'

export default function AdminProfile() {
  const { user } = useAuth()

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback="/admin" label="Back to Dashboard" />
      <ProfileInfo user={user} editTo="/admin/profile/edit" />
    </div>
  )
}
