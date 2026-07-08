import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Flag, FileText, Send, CheckCircle } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { getRoundDetail, getEventDetail, updateRound } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'


function toLocalDatetime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toISOString().slice(0, 16)
}

export default function RoundEdit() {
  const { roundId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', startTime: '', endTime: '', startSubmission: '', endSubmission: '', limitTeam: '' })
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const round = await getRoundDetail(roundId)
        if (!cancelled) {
          setForm({
            name: round.name || '',
            description: round.description || '',
            startTime: toLocalDatetime(round.startTime),
            endTime: toLocalDatetime(round.endTime),
            startSubmission: toLocalDatetime(round.startSubmission),
            endSubmission: toLocalDatetime(round.endSubmission),
            limitTeam: round.limitTeam ?? '',
          })
          if (round.eventId) {
            try {
              const ev = await getEventDetail(round.eventId)
              if (!cancelled) setEvent(ev)
            } catch { /* ignore */ }
          }
        }
      } catch {
        if (!cancelled) toast.error('Failed to load round.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {}
      if (form.name.trim()) payload.name = form.name.trim()
      if (form.description !== undefined) payload.description = form.description || null
      if (form.startTime) payload.startTime = new Date(form.startTime).toISOString()
      if (form.endTime) payload.endTime = new Date(form.endTime).toISOString()
      if (form.startSubmission) payload.startSubmission = new Date(form.startSubmission).toISOString()
      if (form.endSubmission) payload.endSubmission = new Date(form.endSubmission).toISOString()
      if (form.limitTeam !== '') payload.limitTeam = Number(form.limitTeam)

      await updateRound(roundId, payload)
      toast.success('Round updated successfully')
      navigate(`/admin/hackathons/${event?.id || ''}?tab=Rounds`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update round.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><p className="text-gray-400">Loading...</p></div>

  const eventId = event?.id
  const canSave = form.name.trim() || form.startTime || form.endTime || form.limitTeam !== ''

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}?tab=Rounds`}
      backLabel="Back to Event"
      title="Edit Round"
      description=""
      saveLabel="Save Changes"
      savingLabel="Saving..."
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
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={form.description} onChange={(v) => updateField('description', v)} placeholder="Round description..." />
          </FormField>
        </div>
        <EventInfoCard event={event} />
      </div>
    </EntityFormPage>
  )
}
