import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Trophy, DollarSign, Hash, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { updateAward, getEventDetail, getAwards } from '../../../../api/staff'
import { toast } from '../../../../utils/toast'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'


export default function AwardEdit() {
  const { eventId, awardId } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [numberOfAward, setNumberOfAward] = useState('1')
  const [prize, setPrize] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getEventDetail(eventId), getAwards(eventId, { pageSize: 100 })]).then(([evt, awardsData]) => {
      if (cancelled) return
      setEvent(evt)
      const award = (awardsData.awards || []).find(a => a.id === awardId)
      if (award) {
        setName(award.name || '')
        setDescription(award.description || '')
        setNumberOfAward(String(award.numberOfAward || 1))
        setPrize(String(award.prize || ''))
      }
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [eventId, awardId])

  const canSave = name.trim().length > 0 && prize !== '' && Number(prize) > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { name: name.trim(), prize: Number(prize) }
      if (description.trim()) payload.description = description.trim()
      if (numberOfAward !== '') payload.numberOfAward = Number(numberOfAward)
      await updateAward(eventId, awardId, payload)
      toast.success('Award updated successfully')
      navigate(`/staff/hackathons/${eventId}?tab=Awards`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update award.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mb-6" />
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  return (
    <EntityFormPage
      backUrl={`/staff/hackathons/${eventId}?tab=Awards`}
      backLabel="Back to Awards"
      title="Edit Award"
      saveLabel="Save Changes"
      savingLabel="Saving..."
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
