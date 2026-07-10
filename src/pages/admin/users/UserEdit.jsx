import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Save } from 'lucide-react'
import { getUserDetail, updateUser } from '../../../api/admin'
import FormActions from '../../../components/FormActions'
import { getErrorMessage } from '../../../utils/error'
import { toast } from '../../../utils/toast'
import UserEditAvatar from './UserEditAvatar'
import UserEditForm from './UserEditForm'

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

  function handleAvatarChange(file) {
    setAvatarFile(file)
    setAvatarPreview(file ? URL.createObjectURL(file) : user?.avatarUrl || '')
  }

  function removeAvatar() {
    setAvatarFile(null)
    setAvatarPreview(user?.avatarUrl || '')
  }

  async function handleSave() {
    setSaving(true)
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
      toast.success('User updated')
      navigate(`/admin/users/${id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

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

  if (error && !user) {
    const isNotFound = error === 'User Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'User not found' : error}
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
      <div className="mb-4 flex items-center gap-1.5 text-[13px] text-gray-400">
        <Link to="/admin/users" className="hover:text-[#064f5d] hover:underline">
          Users
        </Link>
        <span>/</span>
        <span className="font-medium text-[#1f2f3a]">Edit {displayName}</span>
      </div>

      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[26px]">Edit User</h2>
        <p className="mt-1 text-[14px] text-gray-500">Update profile information for {displayName}</p>
      </div>

      <UserEditAvatar
        src={avatarPreview}
        name={displayName}
        hasFile={!!avatarFile}
        onFileChange={handleAvatarChange}
        onRemove={removeAvatar}
      />

      <UserEditForm form={form} onChange={updateField} />

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
