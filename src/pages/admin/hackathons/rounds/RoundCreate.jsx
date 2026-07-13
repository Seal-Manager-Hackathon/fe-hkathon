import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Flag, FileText, Send, CheckCircle } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import { createRound, getEventDetail, getMaxRoundNo } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'

const INITIAL_FORM = {
  name: '',
  startTime: '',
  endTime: '',
  startSubmission: '',
  endSubmission: '',
  limitTeam: '15',
}


export default function RoundCreate() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)
  const [maxRoundNo, setMaxRoundNo] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const data = await getEventDetail(eventId)
        if (!cancelled) setEvent(data)
      } catch { /* ignore */ }
    }
    fetch()
    return () => { cancelled = true }
  }, [eventId])

  useEffect(() => {
    getMaxRoundNo(eventId).then(setMaxRoundNo).catch(() => setMaxRoundNo(null))
  }, [eventId])

  const nextRound = maxRoundNo != null ? maxRoundNo + 1 : 1

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
        startTime: form.startTime + ':00.000Z',
        endTime: form.endTime + ':00.000Z',
      }
      if (form.startSubmission) payload.startSubmission = form.startSubmission + ':00.000Z'
      if (form.endSubmission) payload.endSubmission = form.endSubmission + ':00.000Z'
      if (form.limitTeam !== '') payload.limitTeam = Number(form.limitTeam)
      await createRound(eventId, payload)
      toast.success('Round created successfully')
      navigate(`/admin/hackathons/${eventId}?tab=Rounds`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create round.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}?tab=Rounds`}
      backLabel="Back to Event"
      title={`Create Round #${nextRound}`}
      description=""
      saveLabel="Create Round"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormField label="Round Name" icon={FileText}>
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Qualification Round" className="field-input" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Start Time" icon={Calendar}>
              <input type="datetime-local" value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} className="field-input" />
            </FormField>
            <FormField label="End Time" icon={Clock}>
              <input type="datetime-local" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} className="field-input" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Submission Start" icon={Send}>
              <input type="datetime-local" value={form.startSubmission} onChange={(e) => updateField('startSubmission', e.target.value)} className="field-input" />
            </FormField>
            <FormField label="Submission End" icon={CheckCircle}>
              <input type="datetime-local" value={form.endSubmission} onChange={(e) => updateField('endSubmission', e.target.value)} className="field-input" />
            </FormField>
          </div>
          <FormField label="Max Teams" icon={Users}>
            <input type="number" min="1" value={form.limitTeam} onChange={(e) => updateField('limitTeam', e.target.value)} placeholder="e.g. 15" className="field-input" />
          </FormField>
        </div>
        <EventInfoCard event={event} />
      </div>
    </EntityFormPage>
  )
}
