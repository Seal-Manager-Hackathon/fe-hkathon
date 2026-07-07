import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Hash, Flag, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { getTrackDetail, getEventDetail, updateTrack } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

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

function EventInfoCard({ event }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#80deea]" />
          Event Info
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
        {event.season ? <InfoRow icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season} valueClass="text-[#ef6c00]" /> : <InfoRow icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value="—" valueClass="text-[#ef6c00]" />}
        <InfoRow icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDateTime(event.startTime)} mono />
        <InfoRow icon={<Clock className="h-3.5 w-3.5 text-[#e65100]" />} label="Reg Deadline" value={event.registerLimitTime ? formatDateTime(event.registerLimitTime) : '—'} mono />
        <InfoRow icon={<Clock className="h-3.5 w-3.5 text-[#c62828]" />} label="End" value={formatDateTime(event.endTime)} mono />
        <InfoRow icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Teams" value={event.limitTeam ?? '—'} valueClass="text-[#2e7d32]" />
        <InfoRow icon={<Users className="h-3.5 w-3.5 text-[#6a1b9a]" />} label="Members" value={`${event.minMember ?? '—'} – ${event.maxMember ?? '—'}`} valueClass="text-[#6a1b9a]" />
        <InfoRow icon={<Hash className="h-3.5 w-3.5 text-[#37474f]" />} label="Total Rounds" value={event.numberRound ?? 0} valueClass="text-[#37474f]" />
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, valueClass = '', mono = false }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 text-[13px]">
      {icon}
      <span className="text-gray-400">{label}</span>
      <span className={`ml-auto font-semibold ${valueClass} ${mono ? 'text-right text-[12px] leading-tight font-medium' : ''}`}>{value}</span>
    </div>
  )
}