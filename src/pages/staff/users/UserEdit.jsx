import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save, User, Phone, FileText, GraduationCap, Calendar, MapPin, IdCard } from 'lucide-react'
import { getUserDetail, updateUser } from '../../../api/staff'
import FormField from '../../../components/FormField'
import FormActions from '../../../components/FormActions'
import Avatar from '../../../components/Avatar'
import { getErrorMessage } from '../../../utils/error'

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

      if (form.firstName !== (user.firstName || '')) fd.append('FirstName', form.firstName)
      if (form.lastName !== (user.lastName || '')) fd.append('LastName', form.lastName)
      if (form.phoneNumber !== (user.phoneNumber || '')) fd.append('PhoneNumber', form.phoneNumber)
      if (form.bio !== (user.bio || '')) fd.append('Bio', form.bio)
      if (form.address !== (user.address || '')) fd.append('Address', form.address)
      if (form.studentId !== (user.studentId || '')) fd.append('StudentId', form.studentId)
      if (form.college !== (user.college || '')) fd.append('College', form.college)

      const origDob = user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ''
      if (form.dateOfBirth && form.dateOfBirth !== origDob) {
        fd.append('DateOfBirth', new Date(form.dateOfBirth).toISOString())
      }

      if (avatarFile) fd.append('AvatarFile', avatarFile)

      await updateUser(id, fd)
      navigate(`/staff/users/${id}`)
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
          {isNotFound ? 'User not found' : error}
        </p>
        <Link to="/staff/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Users
        </Link>
      </div>
    )
  }

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || ''

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-[13px] text-gray-400">
        <Link to="/staff/users" className="hover:text-[#064f5d] hover:underline">
          Users
        </Link>
        <span>/</span>
        <span className="font-medium text-[#1f2f3a]">Edit {displayName}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[26px]">Edit User</h2>
        <p className="mt-1 text-[14px] text-gray-500">Update profile information for {displayName}</p>
      </div>

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar
          src={avatarPreview}
          name={displayName}
          size="h-16 w-16"
          textSize="text-[18px]"
        />
        <div className="flex items-center gap-2">
          <label className="cursor-pointer rounded-lg bg-[#f4f6f8] px-3 py-2 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]">
            Change Photo
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
          {avatarFile && (
            <button
              onClick={removeAvatar}
              className="cursor-pointer rounded-lg bg-[#fce4ec] px-3 py-2 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2]"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First Name" icon={User}>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="e.g. John"
                className="field-input"
              />
            </FormField>
            <FormField label="Last Name" icon={User}>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="e.g. Doe"
                className="field-input"
              />
            </FormField>
          </div>

          <FormField label="Phone Number" icon={Phone}>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              placeholder="e.g. 0123456789"
              className="field-input"
            />
          </FormField>

          <FormField label="Bio" icon={FileText}>
            <textarea
              value={form.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="A short introduction..."
              rows={3}
              className="field-input resize-y"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="College" icon={GraduationCap}>
              <input
                type="text"
                value={form.college}
                onChange={(e) => updateField('college', e.target.value)}
                placeholder="e.g. FPT University"
                className="field-input"
              />
            </FormField>
            <FormField label="Student ID" icon={IdCard}>
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
            <FormField label="Date of Birth" icon={Calendar}>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                className="field-input"
              />
            </FormField>
            <FormField label="Address" icon={MapPin}>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g. Ho Chi Minh City"
                className="field-input"
              />
            </FormField>
          </div>
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
