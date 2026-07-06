import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">User not found.</p>
        <Link to="/admin/users" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          ← Back to Users
        </Link>
      </div>
    )
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
    <div className="px-8 py-8">
      <Link
        to={`/admin/users/${id}`}
        className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Edit User</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update user account information and permissions.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. John Doe"
              className="field-input"
            />
          </FormField>
          <FormField label="Email" required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="e.g. john@seal.dev"
              className="field-input"
            />
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

      <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <Link
          to={`/admin/users/${id}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}