import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Users, GraduationCap, Briefcase, Shield } from 'lucide-react'
import { createUser, getUsersCount } from '../../../api/staff'
import { ROLE_OPTIONS_SELECT_NO_ADMIN } from '../../../constants/adminOptions'
import SelectInput from '../../../components/SelectInput'
import FormField from '../../../components/FormField'
import FormActions from '../../../components/FormActions'
import { parseError } from '../../../utils/error'

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

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  let pwd = ''
  for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  return pwd
}

const ROLE_META = {
  Student: { icon: GraduationCap, color: 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]', iconColor: 'text-[#1565c0]' },
  Lecturer: { icon: Briefcase, color: 'bg-[#f3e5f5] text-[#7b1fa2] border-[#e1bee7]', iconColor: 'text-[#7b1fa2]' },
  Staff: { icon: Shield, color: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]', iconColor: 'text-[#2e7d32]' },
  Admin: { icon: Users, color: 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]', iconColor: 'text-[#e65100]' },
}

export default function UsersCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [counts, setCounts] = useState({})

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
      await createUser({
        email: form.email.trim(),
        password: generatePassword(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role,
      })
      navigate('/staff/users')
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

  const isFormComplete =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.role

  const totalUsers = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/staff/users"
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

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
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
              options={ROLE_OPTIONS_SELECT_NO_ADMIN}
              value={form.role}
              onChange={(v) => updateField('role', v)}
            />
          </FormField>

          <FormActions
            onSave={handleSave}
            saving={saving}
            canSave={isFormComplete}
            saveLabel="Create User"
            saveIcon={UserPlus}
          />
        </div>

        {/* Sidebar — User counts by role */}
        <div className="self-start space-y-4">
          <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-[#80deea]" /> Users in System
              </h4>
            </div>
            <div className="divide-y divide-[#f5f5f5]">
              <div className="px-5 py-3">
                <p className="text-[13px] text-gray-400">Total</p>
                <p className="text-[22px] font-bold text-[#1f2f3a]">{totalUsers}</p>
              </div>
              {Object.entries(ROLE_META).map(([role, meta]) => {
                const Icon = meta.icon
                return (
                  <div key={role} className="flex items-center gap-3 px-5 py-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.color.replace(/text-\S+/, '')}`}>
                      <Icon className={`h-4 w-4 ${meta.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400">{role}</p>
                      <p className="text-[14px] font-semibold text-[#1f2f3a]">{counts[role] ?? '—'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
