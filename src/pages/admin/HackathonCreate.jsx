import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import BackButton from '../../components/BackButton'
import FormActions from '../../components/FormActions'

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Upcoming', label: 'Upcoming' },
]

const VISIBILITY_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

const YEAR_OPTIONS = [
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
]

export default function HackathonCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    season: '',
    year: '2026',
    date: '',
    prize: '',
    location: '',
    description: '',
    status: 'Draft',
    visibility: 'Private',
  })
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name && form.season && form.date && form.prize && form.location

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/admin/hackathons')
    }, 600)
  }

  return (
    <div className="px-8 py-8">
      <BackButton fallback="/admin/hackathons" label="Back to Hackathons" />

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Create Hackathon</h1>
        <p className="mt-1 text-[15px] text-gray-500">Fill in the details to create a new hackathon program.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <FormField label="Hackathon Name" required>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. SEAL Hackathon 2027 - Spring" className="field-input" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Season" required>
              <input type="text" value={form.season} onChange={(e) => updateField('season', e.target.value)} placeholder="e.g. Spring 2027" className="field-input" />
            </FormField>
            <FormField label="Year" required>
              <SelectInput options={YEAR_OPTIONS} value={form.year} onChange={(v) => updateField('year', v)} />
            </FormField>
          </div>
          <FormField label="Date" required>
            <input type="text" value={form.date} onChange={(e) => updateField('date', e.target.value)} placeholder="e.g. Mar 15, 2027" className="field-input" />
          </FormField>
          <FormField label="Prize Pool" required>
            <input type="text" value={form.prize} onChange={(e) => updateField('prize', e.target.value)} placeholder="e.g. $50,000" className="field-input" />
          </FormField>
          <FormField label="Location" required>
            <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. Ho Chi Minh City" className="field-input" />
          </FormField>
        </div>

        <div className="space-y-5">
          <FormField label="Status">
            <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
          <FormField label="Visibility">
            <SelectInput options={VISIBILITY_OPTIONS} value={form.visibility} onChange={(v) => updateField('visibility', v)} />
          </FormField>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Describe the hackathon..." rows={7} className="field-input resize-none" />
          </FormField>
        </div>
      </div>

      <FormActions onSave={handleSave} saving={saving} canSave={canSave} saveLabel="Create Hackathon" />
    </div>
  )
}
