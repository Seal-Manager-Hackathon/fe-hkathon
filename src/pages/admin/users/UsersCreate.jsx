import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUser, getUsersCount } from '../../../api/admin'
import { parseError } from '../../../utils/error'
import UsersCreateForm from './UsersCreateForm'
import UsersCreateSidebar from './UsersCreateSidebar'
import UserCreatedModal from './UserCreatedModal'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
}

const FIELD_LABELS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  role: 'Role',
}

function validate(form) {
  const errors = {}
  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  else if (form.firstName.length > 50) errors.firstName = 'First name must not exceed 50 characters'

  if (!form.lastName.trim()) errors.lastName = 'Last name is required'
  else if (form.lastName.length > 50) errors.lastName = 'Last name must not exceed 50 characters'

  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format'

  if (!form.role) errors.role = 'Please select a role'

  return errors
}

export default function UsersCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [counts, setCounts] = useState({})
  const [createdUser, setCreatedUser] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const [student, lecturer, staff, admin] = await Promise.all([
          getUsersCount('Student'),
          getUsersCount('Lecturer'),
          getUsersCount('Staff'),
          getUsersCount('Admin'),
        ])
        setCounts({
          Student: student?.total ?? 0,
          Lecturer: lecturer?.total ?? 0,
          Staff: staff?.total ?? 0,
          Admin: admin?.total ?? 0,
        })
      } catch {}
    }
    fetch()
  }, [])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    setSaveError('')
  }

  async function handleSave() {
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      const result = await createUser({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      })
      setCreatedUser(result)
    } catch (err) {
      const { message, errors: apiErrors } = parseError(err)
      if (apiErrors && Object.keys(apiErrors).length > 0) {
        const mapped = {}
        for (const [key, msg] of Object.entries(apiErrors)) {
          const camelKey = key.charAt(0).toLowerCase() + key.slice(1)
          mapped[camelKey] = FIELD_LABELS[camelKey]
            ? `${FIELD_LABELS[camelKey]}: ${msg}`
            : msg
        }
        setFieldErrors((prev) => ({ ...prev, ...mapped }))
      } else {
        if (message.includes('Email Already Exists') || message.includes('already exists')) {
          setFieldErrors({ email: 'Email already in use' })
        } else if (message.includes('Invalid Role')) {
          setFieldErrors({ role: 'Invalid role' })
        } else {
          setSaveError(message)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  function handleCloseModal() {
    setCreatedUser(null)
    navigate('/admin/users')
  }

  const isFormComplete =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.role

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Users
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Create User</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Add a new user to the system. A random password will be auto-generated.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_280px]">
        <UsersCreateForm
          form={form}
          fieldErrors={fieldErrors}
          saveError={saveError}
          saving={saving}
          canSave={isFormComplete}
          onFieldChange={updateField}
          onSave={handleSave}
        />
        <UsersCreateSidebar counts={counts} />
      </div>

      <UserCreatedModal createdUser={createdUser} onClose={handleCloseModal} />
    </div>
  )
}
