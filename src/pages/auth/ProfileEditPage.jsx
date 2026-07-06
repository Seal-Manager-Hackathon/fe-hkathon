import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Lock, User, ShieldAlert, Mail, Phone, GraduationCap } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import CardPanel from '../../components/CardPanel'
import FormField from '../../components/FormField'
import FormActions from '../../components/FormActions'
import PasswordInput from '../../components/PasswordInput'
import TextInput from '../../components/TextInput'
import AlertMessage from '../../components/AlertMessage'

const TABS = [
  { key: 'profile', label: 'Profile Info', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
]

export default function ProfileEditPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'password' ? 'password' : 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.name || ''

  const [profileForm, setProfileForm] = useState({
    name: displayName,
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || '',
    bio: user?.bio || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  function updateProfile(field, value) {
    setProfileSaved(false)
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  function updatePassword(field, value) {
    setPasswordError('')
    setPasswordSuccess(false)
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSaveProfile() {
    if (!profileForm.name || !profileForm.email) return
    setProfileSaving(true)
    setTimeout(() => {
      setProfileSaving(false)
      setProfileSaved(true)
    }, 600)
  }

  function handleChangePassword() {
    const { currentPassword, newPassword, confirmPassword } = passwordForm
    if (!currentPassword) {
      setPasswordError('Current password is required.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    setPasswordSaving(true)
    setTimeout(() => {
      setPasswordSaving(false)
      setPasswordSuccess(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }, 800)
  }

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8">
      <BackButton fallback="/profile" label="Back to Profile" />

      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Edit Profile</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update your personal information and security settings.</p>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-[#f4f6f8] p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setPasswordError('')
                setPasswordSuccess(false)
              }}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors',
                activeTab === tab.key
                  ? 'bg-white text-[#064f5d] shadow-sm'
                  : 'text-gray-500 hover:text-[#1f2f3a]'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'profile' && (
        <>
          <CardPanel title="Personal Information">
            <div className="px-5 pt-2 pb-5 space-y-4">
              <TextInput
                label="Full Name"
                icon={User}
                value={profileForm.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                required
              />
              <TextInput
                label="Email"
                icon={Mail}
                type="email"
                value={profileForm.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                required
              />
              <TextInput
                label="Phone"
                icon={Phone}
                value={profileForm.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
              />
              <TextInput
                label="College"
                icon={GraduationCap}
                value={profileForm.college}
                onChange={(e) => updateProfile('college', e.target.value)}
              />
              <FormField label="Bio">
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  rows={4}
                  className="field-input resize-none"
                  placeholder="A short description about yourself..."
                />
              </FormField>
            </div>
          </CardPanel>

          <AlertMessage type="success">{profileSaved && 'Profile updated successfully!'}</AlertMessage>

          <FormActions
            onSave={handleSaveProfile}
            saving={profileSaving}
            canSave={!!(profileForm.name && profileForm.email)}
            saveLabel="Save Profile"
            savingLabel="Saving..."
          />
        </>
      )}

      {activeTab === 'password' && (
        <>
          <CardPanel title="Change Password">
            <div className="px-5 pt-2 pb-5">
              <div className="mb-4 rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#e65100]" />
                  <p className="text-[13px] text-[#e65100]">
                    Choose a strong password with at least 6 characters, including letters, numbers, and special characters.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <PasswordInput
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => updatePassword('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  required
                />
                <PasswordInput
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => updatePassword('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <PasswordInput
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => updatePassword('confirmPassword', e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </div>
          </CardPanel>

          <AlertMessage type="error">{passwordError}</AlertMessage>
          <AlertMessage type="success">{passwordSuccess && 'Password changed successfully!'}</AlertMessage>

          <FormActions
            onSave={handleChangePassword}
            saving={passwordSaving}
            canSave={!!(passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword)}
            saveLabel="Change Password"
            savingLabel="Changing..."
            saveIcon={Lock}
          />
        </>
      )}
    </div>
  )
}
