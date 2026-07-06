import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import SelectInput from '../../components/SelectInput'

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
    // TODO: call API
    setTimeout(() => {
      setSaving(false)
      navigate('/admin/hackathons')
    }, 600)
  }

  return (
    <div className="px-8 py-8">
      <Link
        to="/admin/hackathons"
        className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hackathons
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Create Hackathon</h1>
        <p className="mt-1 text-[15px] text-gray-500">Fill in the details to create a new hackathon program.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-5">
          <Field label="Hackathon Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. SEAL Hackathon 2027 - Spring"
              className="field-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Season" required>
              <input
                type="text"
                value={form.season}
                onChange={(e) => updateField('season', e.target.value)}
                placeholder="e.g. Spring 2027"
                className="field-input"
              />
            </Field>

            <Field label="Year" required>
              <SelectInput
                options={YEAR_OPTIONS}
                value={form.year}
                onChange={(v) => updateField('year', v)}
              />
            </Field>
          </div>

          <Field label="Date" required>
            <input
              type="text"
              value={form.date}
              onChange={(e) => updateField('date', e.target.value)}
              placeholder="e.g. Mar 15, 2027"
              className="field-input"
            />
          </Field>

          <Field label="Prize Pool" required>
            <input
              type="text"
              value={form.prize}
              onChange={(e) => updateField('prize', e.target.value)}
              placeholder="e.g. $50,000"
              className="field-input"
            />
          </Field>

          <Field label="Location" required>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. Ho Chi Minh City"
              className="field-input"
            />
          </Field>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <Field label="Status">
            <SelectInput
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(v) => updateField('status', v)}
            />
          </Field>

          <Field label="Visibility">
            <SelectInput
              options={VISIBILITY_OPTIONS}
              value={form.visibility}
              onChange={(v) => updateField('visibility', v)}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the hackathon, goals, and any special requirements..."
              rows={7}
              className="field-input resize-none"
            />
          </Field>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Create Hackathon'}
        </button>
        <Link
          to="/admin/hackathons"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}
