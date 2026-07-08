import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Flag, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { getTrackDetail, getEventDetail, updateTrack } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'


export default function TrackEdit() {
  const { eventId, trackId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', maxTeam: '' })
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const track = await getTrackDetail(eventId, trackId)
        if (!cancelled) {
          setForm({
            title: track.title || '',
            description: track.description || '',
            maxTeam: track.maxTeam != null ? String(track.maxTeam) : '',
          })
          if (track.eventId) {
            try { const ev = await getEventDetail(track.eventId); if (!cancelled) setEvent(ev) } catch {}
          }
        }
      } catch {
        if (!cancelled) toast.error('Failed to load track.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [eventId, trackId])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {}
      if (form.title.trim()) payload.title = form.title.trim()
      if (form.description !== undefined) payload.description = form.description.trim() || null
      if (form.maxTeam !== '') payload.maxTeam = Number(form.maxTeam)

      await updateTrack(event.id, trackId, payload)
      toast.success('Track updated successfully')
      navigate(`/admin/hackathons/${event?.id || ''}?tab=Tracks`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update track.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><p className="text-gray-400">Loading...</p></div>

  const canSave = form.title.trim()

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${event?.id || ''}?tab=Tracks`}
      backLabel="Back to Event"
      title="Edit Track"
      description=""
      saveLabel="Save Changes"
      savingLabel="Saving..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormField label="Track Title" required icon={FileText}>
            <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. AI - Artificial Intelligence" maxLength={200} className="field-input" />
          </FormField>
          <FormField label="Max Teams" icon={Users}>
            <input type="number" min="0" value={form.maxTeam} onChange={(e) => updateField('maxTeam', e.target.value)} placeholder="15" className="field-input" />
          </FormField>
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={form.description} onChange={(v) => updateField('description', v)} placeholder="Track description..." />
          </FormField>
        </div>
        <EventInfoCard event={event} />
      </div>
    </EntityFormPage>
  )
}
