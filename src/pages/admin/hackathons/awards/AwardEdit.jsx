import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Trophy, DollarSign, Hash, FileText, Calendar, Clock, Users, Flag } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { updateAward, getEventDetail, getAwards } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

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
      navigate(`/admin/hackathons/${eventId}?tab=Awards`)
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
      backUrl={`/admin/hackathons/${eventId}?tab=Awards`}
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

function EventInfoCard({ event }) {
  if (!event) {
    return (
      <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
          <h4 className="text-[14px] font-bold text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-[#80deea]" />Event Info</h4>
        </div>
        <div className="px-5 py-8 text-center text-[13px] text-gray-400">Event info unavailable</div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-[#80deea]" />Event Info</h4>
      </div>
      <div className="divide-y divide-[#f5f5f5]">
        <div className="px-5 py-3.5">
          <Link to={`/admin/hackathons/${event.id}`} className="text-[14px] font-bold text-[#064f5d] leading-snug hover:underline">{event.name}</Link>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
        </div>
        <div className="divide-y divide-[#f5f5f5]">
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Flag className="h-3.5 w-3.5 text-[#ef6c00] shrink-0" /> <span className="text-gray-400">Season</span>
            <span className="ml-auto font-semibold text-[#ef6c00]">{event.season || '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Clock className="h-3.5 w-3.5 text-[#1565c0] shrink-0" /> <span className="text-gray-400">Start</span>
            <span className="ml-auto font-medium text-[#1f2f3a] text-right text-[12px] leading-tight">{formatDateTime(event.startTime)}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Clock className="h-3.5 w-3.5 text-[#c62828] shrink-0" /> <span className="text-gray-400">End</span>
            <span className="ml-auto font-medium text-[#1f2f3a] text-right text-[12px] leading-tight">{formatDateTime(event.endTime)}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Users className="h-3.5 w-3.5 text-[#2e7d32] shrink-0" /> <span className="text-gray-400">Teams</span>
            <span className="ml-auto font-semibold text-[#2e7d32]">{event.limitTeam ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Hash className="h-3.5 w-3.5 text-[#37474f] shrink-0" /> <span className="text-gray-400">Total Rounds</span>
            <span className="ml-auto font-semibold text-[#37474f]">{event.numberRound ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

