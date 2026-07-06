import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">Hackathon not found.</p>
        <Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          ← Back to Hackathons
        </Link>
      </div>
    )
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
    <div className="px-8 py-8">
      <Link
        to={`/admin/hackathons/${id}`}
        className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hackathon
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Edit Hackathon</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update hackathon information and settings.</p>
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

      <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
        <button onClick={handleSave} disabled={!canSave || saving} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <Link to={`/admin/hackathons/${id}`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50">Cancel</Link>
      </div>
    </div>
  )
}
