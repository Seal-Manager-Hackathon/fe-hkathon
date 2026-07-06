import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import FormActions from '../../components/FormActions'
import { allHackathons } from '../../data/mockAdminData'

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Closed', label: 'Closed' },
]

const VISIBILITY_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

const YEAR_OPTIONS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
]

export default function HackathonEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const hackathon = allHackathons.find((h) => h.id === id)

  const [form, setForm] = useState({
    name: hackathon?.name || '',
    season: hackathon?.season || '',
    year: hackathon?.year || '2026',
    date: hackathon?.date || '',
    prize: hackathon?.prize || '',
    location: hackathon?.location || '',
    description: hackathon?.description || '',
    status: hackathon?.status || 'Draft',
    visibility: hackathon?.visibility || 'Private',
  })
  const [saving, setSaving] = useState(false)

  if (!hackathon) {
    return <NotFoundState entity="Hackathon" fallbackTo="/admin/hackathons" />
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name && form.season && form.date && form.prize && form.location

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate(`/admin/hackathons/${id}`)
    }, 600)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback={`/admin/hackathons/${id}`} label="Back to Hackathon" />

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit Hackathon</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update hackathon information and settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <FormField label="Hackathon Name" required>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. SEAL Hackathon 2027 - Spring" className="field-input" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <FormActions onSave={handleSave} saving={saving} canSave={canSave} />
    </div>
  )
}
