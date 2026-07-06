import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import ProfileEditForm from '../../components/ProfileEditForm'

export default function AdminProfileEdit() {
  const { user } = useAuth()

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback="/admin/profile" label="Back to Profile" />

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit Profile</h1>
        <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">Update your personal information and security settings.</p>
      </div>

      <ProfileEditForm user={user} />
    </div>
  )
}
