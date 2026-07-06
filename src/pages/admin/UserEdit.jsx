import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import FormActions from '../../components/FormActions'
import AlertMessage from '../../components/AlertMessage'
import { allUsers } from '../../data/mockAdminData'

const ROLE_OPTIONS = [
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = allUsers.find((u) => u.id === id)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Student',
    status: user?.status || 'Active',
  })
  const [saving, setSaving] = useState(false)

  if (!user) {
    return <NotFoundState entity="User" fallbackTo="/admin/users" />
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name && form.email && form.role

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate(`/admin/users/${id}`)
    }, 600)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback={`/admin/users/${id}`} label="Back to User" />

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit User</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update user account information and permissions.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <FormField label="Full Name" required>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. John Doe" className="field-input" />
          </FormField>
          <FormField label="Email" required>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="e.g. john@seal.dev" className="field-input" />
          </FormField>
        </div>

        <div className="space-y-5">
          <FormField label="Role">
            <SelectInput options={ROLE_OPTIONS} value={form.role} onChange={(v) => updateField('role', v)} />
          </FormField>
          <FormField label="Status">
            <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
          {form.status === 'Inactive' && (
            <div className="rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3 text-[13px] text-[#e65100]">
              Setting the account to inactive will prevent the user from logging in and participating in hackathons.
            </div>
          )}
        </div>
      </div>

      <FormActions onSave={handleSave} saving={saving} canSave={canSave} />
    </div>
  )
}
