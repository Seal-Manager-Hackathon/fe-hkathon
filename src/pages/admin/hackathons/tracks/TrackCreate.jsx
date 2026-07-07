import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Hash, Flag, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createTrack, getEventDetail } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

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

function EventInfoCard({ event }) {
  if (!event) {
    return (
      <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
          <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#80deea]" /> Event Info
          </h4>
        </div>
        <div className="px-5 py-8 text-center text-[13px] text-gray-400">Event info unavailable</div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#80deea]" /> Event Info
        </h4>
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
            <Flag className="h-3.5 w-3.5 text-[#ef6c00] shrink-0" />
            <span className="text-gray-400">Season</span>
            <span className="ml-auto font-semibold text-[#ef6c00]">{event.season || '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Clock className="h-3.5 w-3.5 text-[#1565c0] shrink-0" />
            <span className="text-gray-400">Start</span>
            <span className="ml-auto font-medium text-[#1f2f3a] text-right text-[12px] leading-tight">{formatDateTime(event.startTime)}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Clock className="h-3.5 w-3.5 text-[#e65100] shrink-0" />
            <span className="text-gray-400">Reg Deadline</span>
            <span className="ml-auto font-medium text-[#1f2f3a] text-right text-[12px] leading-tight">{event.registerLimitTime ? formatDateTime(event.registerLimitTime) : '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Clock className="h-3.5 w-3.5 text-[#c62828] shrink-0" />
            <span className="text-gray-400">End</span>
            <span className="ml-auto font-medium text-[#1f2f3a] text-right text-[12px] leading-tight">{formatDateTime(event.endTime)}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Users className="h-3.5 w-3.5 text-[#2e7d32] shrink-0" />
            <span className="text-gray-400">Teams</span>
            <span className="ml-auto font-semibold text-[#2e7d32]">{event.limitTeam ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Users className="h-3.5 w-3.5 text-[#6a1b9a] shrink-0" />
            <span className="text-gray-400">Members</span>
            <span className="ml-auto font-semibold text-[#6a1b9a]">{event.minMember ?? '—'} – {event.maxMember ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
            <Hash className="h-3.5 w-3.5 text-[#37474f] shrink-0" />
            <span className="text-gray-400">Total Rounds</span>
            <span className="ml-auto font-semibold text-[#37474f]">{event.numberRound ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
