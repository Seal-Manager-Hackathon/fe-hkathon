import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import EntityFormPage from '../../components/EntityFormPage'

const ROLE_OPTIONS = [
  { value: '', label: 'Select role...' },
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Select status...' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function UsersCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
  })
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name && form.email && form.role && form.status

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/admin/users')
    }, 600)
  }

  return (
    <EntityFormPage
      backUrl="/admin/users"
      backLabel="Back to Users"
      title="Create User"
      description="Add a new user to the system."
      saveLabel="Create User"
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="w-full max-w-[560px] space-y-5">
        <FormField label="Full Name" required>
          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. John Doe" className="field-input" />
        </FormField>
        <FormField label="Email" required>
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="e.g. john@seal.dev" className="field-input" />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Role" required>
            <SelectInput options={ROLE_OPTIONS} value={form.role} onChange={(v) => updateField('role', v)} />
          </FormField>
          <FormField label="Status" required>
            <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
        </div>
      </div>
    </EntityFormPage>
  )
}
