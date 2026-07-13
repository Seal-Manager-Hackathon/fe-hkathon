import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Trophy, Leaf, Users, UserCheck, UserPlus, CircleDot, EyeOff, Play, Clock, Flag, FileText } from 'lucide-react'
import SelectInput from '../../../components/SelectInput'
import FormField from '../../../components/FormField'
import EntityFormPage from '../../../components/EntityFormPage'
import RichTextEditor from '../../../components/RichTextEditor'
import { getEventDetail, updateEvent } from '../../../api/admin'
import { SEASON_OPTIONS_SELECT } from '../../../constants/commonOptions'
import { toast } from '../../../utils/toast'
import { formatDate, toUTCISO, toLocalDatetimeInput } from '../../../utils/format'

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Closed', label: 'Closed' },
]

export default function HackathonEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    season: '',
    startTime: '',
    endTime: '',
    registerLimitTime: '',
    limitTeam: '',
    minMember: '',
    maxMember: '',
    status: 'Draft',
    isDisable: false,
  })

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getEventDetail(id)
        if (!cancelled) {
          setEvent(data)
          setForm({
            name: data.name || '',
            description: data.description || '',
            season: data.season || '',
            startTime: toUtcDatetime(data.startTime),
            endTime: toUtcDatetime(data.endTime),
            registerLimitTime: toUtcDatetime(data.registerLimitTime),
            limitTeam: data.limitTeam != null ? String(data.limitTeam) : '',
            minMember: data.minMember != null ? String(data.minMember) : '',
            maxMember: data.maxMember != null ? String(data.maxMember) : '',
            status: data.status || 'Draft',
            isDisable: data.isDisable ?? false,
          })
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load event.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  function toUtcDatetime(iso) {
    if (!iso) return ''
    return toLocalDatetimeInput(iso)
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.name.trim() && form.startTime && form.endTime

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {}
      if (event && form.name.trim() !== event.name) payload.name = form.name.trim()
      if (event && form.description !== (event.description || '')) payload.description = form.description
      if (event && form.season !== (event.season || '')) payload.season = form.season || null
      if (form.startTime) {
        const st = toUTCISO(form.startTime)
        if (event && st !== event.startTime) payload.startTime = st
      }
      if (form.endTime) {
        const et = toUTCISO(form.endTime)
        if (event && et !== event.endTime) payload.endTime = et
      }
      if (form.registerLimitTime) {
        const rt = toUTCISO(form.registerLimitTime)
        if (event && rt !== event.registerLimitTime) payload.registerLimitTime = rt
      } else if (event?.registerLimitTime) {
        payload.registerLimitTime = null
      }
      const lt = form.limitTeam !== '' ? Number(form.limitTeam) : null
      if (event && lt !== (event.limitTeam ?? null)) payload.limitTeam = lt
      const mm = form.minMember !== '' ? Number(form.minMember) : null
      if (event && mm !== (event.minMember ?? null)) payload.minMember = mm
      const mx = form.maxMember !== '' ? Number(form.maxMember) : null
      if (event && mx !== (event.maxMember ?? null)) payload.maxMember = mx
      if (event && form.status !== event.status) payload.status = form.status
      if (event && form.isDisable !== !!event.isDisable) payload.isDisable = form.isDisable

      if (Object.keys(payload).length > 0) {
        await updateEvent(id, payload)
      }
      toast.success('Event updated successfully')
      navigate(`/admin/hackathons/${id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update event.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">{error}</p>
        <Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Hackathons
        </Link>
      </div>
    )
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${id}`}
      backLabel="Back to Event"
      title="Edit Hackathon"
      description=""
      saveLabel="Save Changes"
      savingLabel="Saving..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
        <div className="space-y-5">
          <FormField label="Hackathon Name" icon={Trophy}>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. SEAL Hackathon 2027 - Spring" className="field-input" />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Season" icon={Leaf}>
              <SelectInput options={SEASON_OPTIONS_SELECT} value={form.season} onChange={(v) => updateField('season', v)} />
            </FormField>
            <FormField label="Max Teams" icon={Users}>
              <input type="number" min="0" value={form.limitTeam} onChange={(e) => updateField('limitTeam', e.target.value)} placeholder="e.g. 15" className="field-input" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Min Members per Team" icon={UserCheck}>
              <input type="number" min="0" value={form.minMember} onChange={(e) => updateField('minMember', e.target.value)} placeholder="e.g. 3" className="field-input" />
            </FormField>
            <FormField label="Max Members per Team" icon={UserPlus}>
              <input type="number" min="0" value={form.maxMember} onChange={(e) => updateField('maxMember', e.target.value)} placeholder="e.g. 5" className="field-input" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Status" icon={CircleDot}>
              <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
            </FormField>
            <FormField label="Visibility" icon={EyeOff}>
              <SelectInput
                options={[{ value: 'false', label: 'Enabled (visible)' }, { value: 'true', label: 'Disabled (hidden)' }]}
                value={form.isDisable ? 'true' : 'false'}
                onChange={(v) => updateField('isDisable', v === 'true')}
              />
            </FormField>
          </div>
        </div>

        <div className="space-y-5">
          <FormField label="Start Time" icon={Play}>
            <input type="datetime-local" value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} className="field-input" />
          </FormField>
          <FormField label="Registration Deadline" icon={Clock}>
            <input type="datetime-local" value={form.registerLimitTime} onChange={(e) => updateField('registerLimitTime', e.target.value)} className="field-input" />
          </FormField>
          <FormField label="End Time" icon={Flag}>
            <input type="datetime-local" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} className="field-input" />
          </FormField>
        </div>

        <div className="lg:col-span-2">
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={form.description} onChange={(v) => updateField('description', v)} placeholder="Describe the hackathon..." />
          </FormField>
        </div>
      </div>

      </EntityFormPage>
  )
}
