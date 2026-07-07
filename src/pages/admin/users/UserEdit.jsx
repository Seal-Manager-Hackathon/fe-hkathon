import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { getUserDetail, updateUser } from '../../../api/admin'
import SelectInput from '../../../components/SelectInput'
import FormField from '../../../components/FormField'
import FormActions from '../../../components/FormActions'
import Avatar from '../../../components/Avatar'
import { getErrorMessage } from '../../../utils/error'

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    address: '',
    dateOfBirth: '',
    studentId: '',
    college: '',
    status: 'Active',
    isDisable: false,
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  // Fetch user
  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getUserDetail(id)
        if (!cancelled) {
          setUser(data)
          setForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phoneNumber: data.phoneNumber || '',
            bio: data.bio || '',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
            studentId: data.studentId || '',
            college: data.college || '',
            status: data.isDisable ? 'Inactive' : 'Active',
            isDisable: data.isDisable || false,
          })
          setAvatarPreview(data.avatarUrl || '')
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function removeAvatar() {
    setAvatarFile(null)
    setAvatarPreview(user?.avatarUrl || '')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const fd = new FormData()

      // Chỉ gửi field đã thay đổi so với dữ liệu gốc
      if (form.firstName !== (user.firstName || '')) fd.append('FirstName', form.firstName)
      if (form.lastName !== (user.lastName || '')) fd.append('LastName', form.lastName)
      if (form.phoneNumber !== (user.phoneNumber || '')) fd.append('PhoneNumber', form.phoneNumber)
      if (form.bio !== (user.bio || '')) fd.append('Bio', form.bio)
      if (form.address !== (user.address || '')) fd.append('Address', form.address)
      if (form.studentId !== (user.studentId || '')) fd.append('StudentId', form.studentId)
      if (form.college !== (user.college || '')) fd.append('College', form.college)

      // DateOfBirth: gửi ISO nếu khác
      const origDob = user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ''
      if (form.dateOfBirth && form.dateOfBirth !== origDob) {
        fd.append('DateOfBirth', new Date(form.dateOfBirth).toISOString())
      }

      // Status → gửi Status string
      const origStatus = user.isDisable ? 'Inactive' : 'Active'
      if (form.status !== origStatus) {
        fd.append('Status', form.status)
        fd.append('IsDisable', form.status === 'Inactive')
      }

      // Avatar file
      if (avatarFile) fd.append('AvatarFile', avatarFile)

      await updateUser(id, fd)
      navigate(`/admin/users/${id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6">
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  // Error fetching
  if (error && !user) {
    const isNotFound = error === 'User Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Người dùng không tồn tại' : error}
        </p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    )
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || ''

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Back + Title */}
      <div className="mb-6">
        <Link
          to={`/admin/users/${id}`}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to User
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit User</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Update user account information and settings.
        </p>
      </div>

      {/* Save error banner */}
      {error && user && (
        <div className="mb-6 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Avatar sidebar */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <Avatar
            src={avatarPreview}
            name={displayName}
            size="h-24 w-24 sm:h-28 sm:w-28"
            textSize="text-[28px] sm:text-[32px]"
          />
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2 text-[13px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50">
            Upload Photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
          {avatarFile && (
            <button
              onClick={removeAvatar}
              className="text-[12px] text-gray-400 hover:text-[#c62828]"
            >
              Remove new photo
            </button>
          )}
          <p className="text-[12px] text-gray-400">
            Recommended: Square image, max 2MB
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First Name">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="e.g. John"
                className="field-input"
              />
            </FormField>
            <FormField label="Last Name">
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="e.g. Doe"
                className="field-input"
              />
            </FormField>
          </div>

          <FormField label="Phone Number">
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              placeholder="e.g. 0123456789"
              className="field-input"
            />
          </FormField>

          <FormField label="Bio">
            <textarea
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="A short introduction..."
              rows={3}
              className="field-input resize-y"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="College">
              <input
                type="text"
                value={form.college}
                onChange={(e) => updateField('college', e.target.value)}
                placeholder="e.g. FPT University"
                className="field-input"
              />
            </FormField>
            <FormField label="Student ID">
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => updateField('studentId', e.target.value)}
                placeholder="e.g. SE123456"
                className="field-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date of Birth">
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="field-input"
              />
            </FormField>
            <FormField label="Address">
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g. Ho Chi Minh City"
                className="field-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Status">
              <SelectInput
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={(v) => updateField('status', v)}
              />
            </FormField>
          </div>

          {form.status === 'Inactive' && (
            <div className="rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3 text-[13px] text-[#e65100]">
              Setting this account to inactive will prevent the user from logging in and participating in hackathons.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <FormActions
        onSave={handleSave}
        saving={saving}
        canSave={true}
        saveLabel="Save Changes"
        saveIcon={Save}
      />
    </div>
  )
}
