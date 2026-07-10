import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SelectInput from '../../../components/SelectInput'
import FormField from '../../../components/FormField'
import EntityFormPage from '../../../components/EntityFormPage'
import RichTextEditor from '../../../components/RichTextEditor'
import { createEvent } from '../../../api/staff'
import { SEASON_OPTIONS_SELECT } from '../../../constants/commonOptions'
import { toast } from '../../../utils/toast'

const INITIAL_FORM = {
  name: '',
  description: '',
  season: '',
  startTime: '',
  endTime: '',
  registerLimitTime: '',
  limitTeam: '15',
  minMember: '3',
  maxMember: '5',
}

export default function HackathonCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name.trim() && form.startTime && form.endTime

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      }
      if (form.description.trim()) payload.description = form.description.trim()
      if (form.season) payload.season = form.season
      if (form.registerLimitTime) payload.registerLimitTime = new Date(form.registerLimitTime).toISOString()
      if (form.limitTeam !== '') payload.limitTeam = Number(form.limitTeam)
      if (form.minMember !== '') payload.minMember = Number(form.minMember)
      if (form.maxMember !== '') payload.maxMember = Number(form.maxMember)

      await createEvent(payload)
      toast.success('Event created successfully')
      navigate('/staff/hackathons')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl="/staff/hackathons"
      backLabel="Back to Hackathons"
      title="Create Hackathon"
      description=""
      saveLabel="Create Hackathon"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
        <div className="space-y-5">
          <FormField label="Hackathon Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. SEAL Hackathon 2027 - Spring"
              className="field-input"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Season">
              <SelectInput
                options={SEASON_OPTIONS_SELECT}
                value={form.season}
                onChange={(v) => updateField('season', v)}
              />
            </FormField>

            <FormField label="Max Teams">
              <input
                type="number"
                min="0"
                value={form.limitTeam}
                onChange={(e) => updateField('limitTeam', e.target.value)}
                placeholder="e.g. 15"
                className="field-input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Min Members per Team">
              <input
                type="number"
                min="0"
                value={form.minMember}
                onChange={(e) => updateField('minMember', e.target.value)}
                placeholder="e.g. 3"
                className="field-input"
              />
            </FormField>

            <FormField label="Max Members per Team">
              <input
                type="number"
                min="0"
                value={form.maxMember}
                onChange={(e) => updateField('maxMember', e.target.value)}
                placeholder="e.g. 5"
                className="field-input"
              />
            </FormField>
          </div>
        </div>

        <div className="space-y-5">
          <FormField label="Start Time">
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => updateField('startTime', e.target.value)}
              className="field-input"
            />
          </FormField>

          <FormField label="Registration Deadline">
            <input
              type="datetime-local"
              value={form.registerLimitTime}
              onChange={(e) => updateField('registerLimitTime', e.target.value)}
              className="field-input"
            />
          </FormField>

          <FormField label="End Time">
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => updateField('endTime', e.target.value)}
              className="field-input"
            />
          </FormField>

        </div>

        <div className="lg:col-span-2">
          <FormField label="Description">
            <RichTextEditor value={form.description} onChange={(v) => updateField('description', v)} placeholder="Describe the hackathon..." />
          </FormField>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[#e3f2fd] bg-[#e8f4fd] px-4 py-3 text-[13px] text-[#1565c0]">
        Event will be created as <strong>Draft</strong> and <strong>disabled</strong> by default.
        You can publish it later from the event detail page.
      </div>
    </EntityFormPage>
  )
}

