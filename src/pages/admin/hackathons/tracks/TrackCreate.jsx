import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Flag, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createTrack, getEventDetail } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'


export default function TrackCreate() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxTeam, setMaxTeam] = useState('15')
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    getEventDetail(eventId).then((data) => { if (!cancelled) setEvent(data) }).catch(() => {})
    return () => { cancelled = true }
  }, [eventId])

  const canSave = title.trim().length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { title: title.trim() }
      if (description.trim()) payload.description = description.trim()
      if (maxTeam !== '') payload.maxTeam = Number(maxTeam)
      await createTrack(eventId, payload)
      toast.success('Track created successfully')
      navigate(`/admin/hackathons/${eventId}?tab=Tracks`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create track.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}?tab=Tracks`}
      backLabel="Back to Event"
      title="Create Track"
      description=""
      saveLabel="Create Track"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormField label="Track Title" required icon={FileText}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI - Artificial Intelligence" maxLength={200} className="field-input" />
          </FormField>
          <FormField label="Max Teams" icon={Users}>
            <input type="number" min="0" value={maxTeam} onChange={(e) => setMaxTeam(e.target.value)} placeholder="15" className="field-input" />
          </FormField>
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Track description..." />
          </FormField>
        </div>
        <EventInfoCard event={event} />
      </div>
    </EntityFormPage>
  )
}
