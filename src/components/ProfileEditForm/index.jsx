import { useState } from 'react'
import { Lock, User, ShieldAlert, Mail, GraduationCap } from 'lucide-react'
import { cn } from '../../utils/cn'
import CardPanel from '../CardPanel'
import FormField from '../FormField'
import FormActions from '../FormActions'
import PasswordInput from '../PasswordInput'
import TextInput from '../TextInput'
import AlertMessage from '../AlertMessage'

const TABS = [
  { key: 'profile', label: 'Profile Info', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
]

export default function ProfileEditForm({ user, initialTab = 'profile' }) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
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
    if (!profileForm.firstName || !profileForm.lastName) return
    setProfileSaving(true)
    setTimeout(() => { setProfileSaving(false); setProfileSaved(true) }, 600)
  }

  function handleChangePassword() {
    const { currentPassword, newPassword, confirmPassword } = passwordForm
    if (!currentPassword) { setPasswordError('Current password is required.'); return }
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match.'); return }
    setPasswordSaving(true)
    setTimeout(() => {
      setPasswordSaving(false)
      setPasswordSuccess(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }, 800)
  }

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-xl bg-[#f4f6f8] p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPasswordError(''); setPasswordSuccess(false) }}
              className={cn(
                'inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-colors',
                activeTab === tab.key ? 'bg-white text-[#064f5d] shadow-sm' : 'text-gray-500 hover:text-[#1f2f3a]'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'profile' && (
        <ProfileTab user={user} profileForm={profileForm} updateProfile={updateProfile} profileSaved={profileSaved} profileSaving={profileSaving} onSave={handleSaveProfile} />
      )}
      {activeTab === 'password' && (
        <PasswordTab passwordForm={passwordForm} updatePassword={updatePassword} passwordError={passwordError} passwordSuccess={passwordSuccess} passwordSaving={passwordSaving} onSave={handleChangePassword} />
      )}
    </div>
  )
}

function ProfileTab({ user, profileForm, updateProfile, profileSaved, profileSaving, onSave }) {
  return (
    <>
      <CardPanel title="Personal Information">
        <div className="px-5 pt-2 pb-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput label="First Name" icon={User} value={profileForm.firstName} onChange={(e) => updateProfile('firstName', e.target.value)} placeholder="John" required />
            <TextInput label="Last Name" icon={User} value={profileForm.lastName} onChange={(e) => updateProfile('lastName', e.target.value)} placeholder="Doe" required />
          </div>
          <TextInput label="Email" icon={Mail} type="email" value={user?.email || ''} disabled />
          <TextInput label="College" icon={GraduationCap} value={user?.college || ''} disabled />
          <FormField label="Bio">
            <textarea value={profileForm.bio} onChange={(e) => updateProfile('bio', e.target.value)} rows={4} className="field-input resize-none" placeholder="A short description about yourself..." />
          </FormField>
        </div>
      </CardPanel>
      <AlertMessage type="success">{profileSaved && 'Profile updated successfully!'}</AlertMessage>
      <FormActions onSave={onSave} saving={profileSaving} canSave={!!(profileForm.firstName && profileForm.lastName)} saveLabel="Save Profile" savingLabel="Saving..." />
    </>
  )
}

function PasswordTab({ passwordForm, updatePassword, passwordError, passwordSuccess, passwordSaving, onSave }) {
  return (
    <>
      <CardPanel title="Change Password">
        <div className="px-5 pt-2 pb-5">
          <div className="mb-4 rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#e65100]" />
              <p className="text-[13px] text-[#e65100]">Choose a strong password with at least 6 characters, including letters, numbers, and special characters.</p>
            </div>
          </div>
          <div className="space-y-4">
            <PasswordInput label="Current Password" value={passwordForm.currentPassword} onChange={(e) => updatePassword('currentPassword', e.target.value)} placeholder="Enter current password" required />
            <PasswordInput label="New Password" value={passwordForm.newPassword} onChange={(e) => updatePassword('newPassword', e.target.value)} placeholder="Enter new password" required />
            <PasswordInput label="Confirm New Password" value={passwordForm.confirmPassword} onChange={(e) => updatePassword('confirmPassword', e.target.value)} placeholder="Re-enter new password" required />
          </div>
        </div>
      </CardPanel>
      <AlertMessage type="error">{passwordError}</AlertMessage>
      <AlertMessage type="success">{passwordSuccess && 'Password changed successfully!'}</AlertMessage>
      <FormActions onSave={onSave} saving={passwordSaving} canSave={!!(passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword)} saveLabel="Change Password" savingLabel="Changing..." saveIcon={Lock} />
    </>
  )
}