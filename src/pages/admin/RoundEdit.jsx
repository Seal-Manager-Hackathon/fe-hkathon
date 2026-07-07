import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Users, Hash, Flag } from 'lucide-react'
import FormField from '../../components/FormField'
import EntityFormPage from '../../components/EntityFormPage'
import { getRoundDetail, getEventDetail, updateRound } from '../../api/admin'
import { toast } from '../../utils/toast'
import { formatDateTime } from '../../utils/format'
import Badge from '../../components/Badge'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

function toLocalDatetime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toISOString().slice(0, 16)
}

export default function RoundEdit() {
  const { roundId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', startSubmission: '', endSubmission: '', limitTeam: '' })
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
          <FormField label="Round Name">
            <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Qualification Round" className="field-input" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Start Time">
              <input type="datetime-local" value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} className="field-input" />
            </FormField>
            <FormField label="End Time">
              <input type="datetime-local" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} className="field-input" />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Submission Start">
              <input type="datetime-local" value={form.startSubmission} onChange={(e) => updateField('startSubmission', e.target.value)} className="field-input" />
            </FormField>
            <FormField label="Submission End">
              <input type="datetime-local" value={form.endSubmission} onChange={(e) => updateField('endSubmission', e.target.value)} className="field-input" />
            </FormField>
          </div>
          <FormField label="Max Teams">
            <input type="number" min="1" value={form.limitTeam} onChange={(e) => updateField('limitTeam', e.target.value)} placeholder="e.g. 15" className="field-input" />
          </FormField>
        </div>
        {event && <EventInfoCard event={event} />}
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
          <p className="text-[14px] font-bold text-[#064f5d] leading-snug">{event.name}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
        </div>
        {event.season && <InfoRow icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season} valueClass="text-[#ef6c00]" />}
        <InfoRow icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDateTime(event.startTime)} mono />
        {event.registerLimitTime && <InfoRow icon={<Clock className="h-3.5 w-3.5 text-[#e65100]" />} label="Reg Deadline" value={formatDateTime(event.registerLimitTime)} mono />}
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
