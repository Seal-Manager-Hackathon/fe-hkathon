import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Trophy, DollarSign, Hash, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createAward, getEventDetail } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'


export default function AwardCreate() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [numberOfAward, setNumberOfAward] = useState('1')
  const [prize, setPrize] = useState('')
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    getEventDetail(eventId).then((data) => { if (!cancelled) setEvent(data) }).catch(() => {})
    return () => { cancelled = true }
  }, [eventId])

  const canSave = name.trim().length > 0 && prize !== '' && Number(prize) > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { name: name.trim(), prize: Number(prize) }
      if (description.trim()) payload.description = description.trim()
      if (numberOfAward !== '') payload.numberOfAward = Number(numberOfAward)
      await createAward(eventId, payload)
      toast.success('Award created successfully')
      navigate(`/admin/hackathons/${eventId}?tab=Awards`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create award.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}?tab=Awards`}
      backLabel="Back to Awards"
      title="Create Award"
      saveLabel="Create Award"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
      saveIcon={Trophy}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormField label="Award Name" required icon={Trophy}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. First Prize" maxLength={200} className="field-input" />
          </FormField>
          <FormField label="Prize (USD)" required icon={DollarSign}>
            <input type="number" min="1" value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="e.g. 1000" className="field-input" />
          </FormField>
          <FormField label="Number of Awards" icon={Hash}>
            <input type="number" min="1" value={numberOfAward} onChange={(e) => setNumberOfAward(e.target.value)} placeholder="1" className="field-input" />
          </FormField>
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Award description..." />
          </FormField>
        </div>
        <EventInfoCard event={event} />
      </div>
    </EntityFormPage>
  )
}
