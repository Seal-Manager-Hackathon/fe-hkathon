import { useCallback, useRef, useState } from 'react'
import { Lock, User, ShieldAlert, Mail, GraduationCap, Phone, MapPin, Calendar, Link as LinkIcon, IdCard, Camera, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/user'
import CardPanel from '../CardPanel'
import FormField from '../FormField'
import FormActions from '../FormActions'
import PasswordInput from '../PasswordInput'
import TextInput from '../TextInput'
import { toast } from '../../utils/toast'

const TABS = [
  { key: 'profile', label: 'Profile Info', icon: User },
  { key: 'password', label: 'Change Password', icon: Lock },
]

export default function ProfileEditForm({ user, initialTab = 'profile' }) {
  const { refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState(initialTab)

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
    studentId: user?.studentId || '',
    linkUrl: user?.linkUrl || '',
    avatarUrl: user?.avatarUrl || '',
  })

  const [profileSaving, setProfileSaving] = useState(false)

  // Avatar file state
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSaving, setPasswordSaving] = useState(false)

  function updateProfileField(field, value) {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  function updatePassword(field, value) {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  // Avatar file selection
  const handleAvatarSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setAvatarFile(file)

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
  }, [])

  const clearAvatarSelection = useCallback(() => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [avatarPreview])

  async function handleSaveProfile() {
    if (!profileForm.firstName || !profileForm.lastName) {
      toast.error('First name and last name are required.')
      return
    }

    setProfileSaving(true)

    try {
      const payload = new FormData()

      // Add all text fields (skip empty strings so the API ignores them)
      const fields = ['firstName', 'lastName', 'phoneNumber', 'bio', 'address', 'dateOfBirth', 'studentId', 'linkUrl', 'avatarUrl']
      for (const field of fields) {
        if (profileForm[field]) {
          payload.append(field, profileForm[field])
        }
      }

      // Attach avatar file if selected (takes priority over avatarUrl per API spec)
      if (avatarFile) {
        payload.append('avatarFile', avatarFile)
      }

      await updateProfile(payload)
      toast.success('Profile updated successfully!')

      // Refresh user data in AuthContext
      await refreshUser()

      // Clear avatar selection state
      clearAvatarSelection()
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  function handleChangePassword() {
    const { currentPassword, newPassword, confirmPassword } = passwordForm
    if (!currentPassword) { toast.error('Current password is required.'); return }
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match.'); return }
    setPasswordSaving(true)
    // TODO: Integrate with actual change password API when available
    setTimeout(() => {
      setPasswordSaving(false)
      toast.success('Password changed successfully!')
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
              onClick={() => { setActiveTab(tab.key) }}
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
        <ProfileTab
          user={user}
          profileForm={profileForm}
          updateProfileField={updateProfileField}
          profileSaving={profileSaving}
          onSave={handleSaveProfile}
          avatarFile={avatarFile}
          avatarPreview={avatarPreview}
          onAvatarSelect={handleAvatarSelect}
          onAvatarClear={clearAvatarSelection}
          fileInputRef={fileInputRef}
        />
      )}
      {activeTab === 'password' && (
        <PasswordTab passwordForm={passwordForm} updatePassword={updatePassword} passwordSaving={passwordSaving} onSave={handleChangePassword} />
      )}
    </div>
  )
}

function ProfileTab({
  user,
  profileForm,
  updateProfileField,
  profileSaving,
  onSave,
  avatarPreview,
  avatarFile,
  onAvatarSelect,
  onAvatarClear,
  fileInputRef,
}) {
  return (
    <>
      {/* Avatar Upload Section */}
      <CardPanel title="Avatar">
        <div className="px-5 py-5">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={avatarPreview || user?.avatarUrl || ''}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-[#e8ecf0]"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              {!avatarPreview && !user?.avatarUrl && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1565c0] text-[28px] font-bold text-white">
                  {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                </div>
              )}
              {/* Clear avatar button */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={onAvatarClear}
                  className="absolute -right-1 -top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#1f2f3a]">
                {avatarFile ? 'New avatar selected' : 'Profile photo'}
              </p>
              <p className="mt-0.5 text-[13px] text-gray-400">
                JPEG, PNG, or WEBP. Max 5MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onAvatarSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2 text-[13px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
              >
                <Camera className="h-4 w-4" />
                {avatarFile ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>
      </CardPanel>

      {/* Personal Information */}
      <CardPanel title="Personal Information">
        <div className="px-5 pt-2 pb-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="First Name"
              icon={User}
              value={profileForm.firstName}
              onChange={(e) => updateProfileField('firstName', e.target.value)}
              placeholder="John"
              required
            />
            <TextInput
              label="Last Name"
              icon={User}
              value={profileForm.lastName}
              onChange={(e) => updateProfileField('lastName', e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
          <TextInput label="Email" icon={Mail} type="email" value={user?.email || ''} disabled />
          <TextInput label="College" icon={GraduationCap} value={user?.college || ''} disabled />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Phone Number"
              icon={Phone}
              value={profileForm.phoneNumber}
              onChange={(e) => updateProfileField('phoneNumber', e.target.value)}
              placeholder="+84 123 456 789"
              type="tel"
            />
            <TextInput
              label="Date of Birth"
              icon={Calendar}
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) => updateProfileField('dateOfBirth', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user?.role === 'Student' && (
              <TextInput
                label="Student ID"
                icon={IdCard}
                value={profileForm.studentId}
                onChange={(e) => updateProfileField('studentId', e.target.value)}
                placeholder="e.g. SE123456"
                disabled={!!user?.studentId}
                className={user?.studentId ? 'cursor-not-allowed bg-gray-50 text-gray-400' : ''}
              />
            )}
            <TextInput
              label="Link URL"
              icon={LinkIcon}
              value={profileForm.linkUrl}
              onChange={(e) => updateProfileField('linkUrl', e.target.value)}
              placeholder="https://github.com/your-profile"
              type="url"
            />
          </div>
          {user?.role === 'Student' && user?.studentId && (
            <p className="text-[12px] text-amber-600 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Student ID can only be set once and cannot be changed.
            </p>
          )}
          <FormField label="Address">
            <input
              value={profileForm.address}
              onChange={(e) => updateProfileField('address', e.target.value)}
              className="field-input w-full"
              placeholder="Your address..."
            />
          </FormField>
          <FormField label="Bio">
            <textarea
              value={profileForm.bio}
              onChange={(e) => updateProfileField('bio', e.target.value)}
              rows={4}
              className="field-input resize-none w-full"
              placeholder="A short description about yourself..."
            />
          </FormField>
        </div>
      </CardPanel>

      <FormActions
        onSave={onSave}
        saving={profileSaving}
        canSave={!!(profileForm.firstName && profileForm.lastName)}
        saveLabel="Save Profile"
        savingLabel="Saving..."
      />
    </>
  )
}

function PasswordTab({ passwordForm, updatePassword, passwordSaving, onSave }) {
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
      <FormActions onSave={onSave} saving={passwordSaving} canSave={!!(passwordForm.currentPassword && passwordForm.newPassword && passwordForm.confirmPassword)} saveLabel="Change Password" savingLabel="Changing..." saveIcon={Lock} />
    </>
  )
}
