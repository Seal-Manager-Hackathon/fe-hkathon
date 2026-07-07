import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { createUser } from '../../api/admin'
import { ROLE_OPTIONS_SELECT } from '../../constants/adminOptions'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import FormActions from '../../components/FormActions'
import { parseError } from '../../utils/error'

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

/** Generate a default secure password for admin-created users */
function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  let pwd = ''
  for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  return pwd
}

export default function UsersCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

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
      await createUser({
        email: form.email.trim(),
        password: generatePassword(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      })
      navigate('/admin/users')
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
          setFieldErrors({ email: 'Email đã được sử dụng' })
        } else if (message.includes('Invalid Role')) {
          setFieldErrors({ role: 'Vai trò không hợp lệ' })
        } else {
          setSaveError(message)
        }
      }
    } finally {
      setSaving(false)
    }
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

      {saveError && (
        <div className="mb-6 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {saveError}
        </div>
      )}

      <div className="w-full max-w-[560px] space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First Name" required error={fieldErrors.firstName}>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="e.g. John"
              className={`field-input ${fieldErrors.firstName ? 'input-error' : ''}`}
            />
          </FormField>
          <FormField label="Last Name" required error={fieldErrors.lastName}>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="e.g. Doe"
              className={`field-input ${fieldErrors.lastName ? 'input-error' : ''}`}
            />
          </FormField>
        </div>

        <FormField label="Email" required error={fieldErrors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="e.g. staff@fpt.edu.vn"
            className={`field-input ${fieldErrors.email ? 'input-error' : ''}`}
          />
        </FormField>

        <FormField label="Role" required error={fieldErrors.role}>
          <SelectInput
            options={ROLE_OPTIONS_SELECT}
            value={form.role}
            onChange={(v) => updateField('role', v)}
          />
        </FormField>
      </div>

      <FormActions
        onSave={handleSave}
        saving={saving}
        canSave={isFormComplete}
        saveLabel="Create User"
        saveIcon={UserPlus}
      />
    </div>
  )
}
