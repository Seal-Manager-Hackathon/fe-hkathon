import { useState } from 'react'
import { Save, Lock, Eye, EyeOff, User, ShieldAlert } from 'lucide-react'
import { cn } from '../../utils/cn'
import BackButton from '../../components/BackButton'
import CardPanel from '../../components/CardPanel'
import FormField from '../../components/FormField'
import FormActions from '../../components/FormActions'

const TABS = [
  { key: 'profile', label: 'Profile Info', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
]

export default function AdminProfileEdit() {
  const [activeTab, setActiveTab] = useState('profile')

  const [profileForm, setProfileForm] = useState({
    name: 'Alexandra Grant',
    email: 'admin@seal.dev',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    bio: 'Platform administrator managing hackathon operations, user accounts, and system-wide notifications.',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
    <div className="px-8 py-8">
      <BackButton fallback="/admin/profile" label="Back to Profile" />

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
          <div className="grid grid-cols-2 gap-6">
            <CardPanel title="Personal Information">
              <div className="px-5 pt-2 pb-5 space-y-4">
                <FormField label="Full Name" required>
                  <input type="text" value={profileForm.name} onChange={(e) => updateProfile('name', e.target.value)} className="field-input" />
                </FormField>
                <FormField label="Email" required>
                  <input type="email" value={profileForm.email} onChange={(e) => updateProfile('email', e.target.value)} className="field-input" />
                </FormField>
                <FormField label="Phone">
                  <input type="text" value={profileForm.phone} onChange={(e) => updateProfile('phone', e.target.value)} className="field-input" />
                </FormField>
                <FormField label="Location">
                  <input type="text" value={profileForm.location} onChange={(e) => updateProfile('location', e.target.value)} className="field-input" />
                </FormField>
              </div>
            </CardPanel>

            <CardPanel title="Bio">
              <div className="px-5 pt-2 pb-5">
                <FormField label="About Me">
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    rows={5}
                    className="field-input resize-none"
                    placeholder="A short description about yourself..."
                  />
                </FormField>
              </div>
            </CardPanel>
          </div>

          {profileSaved && (
            <div className="mt-5 rounded-lg border border-[#e8f5e9] bg-[#e8f5e9] px-4 py-3 text-[14px] font-medium text-[#2e7d32]">
              Profile updated successfully!
            </div>
          )}

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

              <div className="space-y-4 max-w-[480px]">
                <FormField label="Current Password" required>
                  <div className="relative">
                    <input type={showCurrent ? 'text' : 'password'} value={passwordForm.currentPassword} onChange={(e) => updatePassword('currentPassword', e.target.value)} className="field-input pr-10" placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                <FormField label="New Password" required>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => updatePassword('newPassword', e.target.value)} className="field-input pr-10" placeholder="Enter new password" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm New Password" required>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={passwordForm.confirmPassword} onChange={(e) => updatePassword('confirmPassword', e.target.value)} className="field-input pr-10" placeholder="Re-enter new password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormField>
              </div>
            </div>
          </CardPanel>

          {passwordError && (
            <div className="mt-4 rounded-lg border border-[#fce4ec] bg-[#fce4ec] px-4 py-3 text-[14px] font-medium text-[#c62828]">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="mt-4 rounded-lg border border-[#e8f5e9] bg-[#e8f5e9] px-4 py-3 text-[14px] font-medium text-[#2e7d32]">
              Password changed successfully!
            </div>
          )}

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
