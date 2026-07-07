import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Hash, Flag, FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createTopic, getEventDetail, getTrackDetail } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function TopicCreate() {
  const { eventId, trackId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState(null)
  const [track, setTrack] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const [ev, tr] = await Promise.all([getEventDetail(eventId), getTrackDetail(eventId, trackId)])
        if (!cancelled) { setEvent(ev); setTrack(tr) }
      } catch {}
    }
    fetch()
    return () => { cancelled = true }
  }, [eventId, trackId])

  const canSave = title.trim().length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { title: title.trim() }
      if (description.trim()) payload.description = description.trim()
      await createTopic(trackId, payload)
      toast.success('Topic created successfully')
      navigate(`/admin/hackathons/${eventId}/tracks/${trackId}/topics`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create topic.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}/tracks/${trackId}/topics`}
      backLabel="Back to Topics"
      title="Create Topic"
      description=""
      saveLabel="Create Topic"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <FormField label="Topic Title" required icon={FileText}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chatbot hỗ trợ học tập" maxLength={200} className="field-input" />
          </FormField>
          <FormField label="Description" icon={FileText}>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Topic description..." />
          </FormField>
        </div>
        <ContextSidebar event={event} track={track} />
      </div>
    </EntityFormPage>
  )
}

function ContextSidebar({ event, track }) {
  return (
    <div className="space-y-4 self-start">
      {event && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#80deea]" /> Event
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
            <div className="space-y-2 px-5 py-3">
              <R icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season || '—'} cls="text-[#ef6c00]" />
              <R icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDateTime(event.startTime)} mono />
              <R icon={<Clock className="h-3.5 w-3.5 text-[#c62828]" />} label="End" value={formatDateTime(event.endTime)} mono />
            </div>
          </div>
        </div>
      )}
      {track && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#0a6e7d] to-[#0d8a96] px-5 py-4">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#80deea]" /> Track
            </h4>
          </div>
          <div className="space-y-2 px-5 py-3">
            <p className="text-[14px] font-bold text-[#064f5d] leading-snug">{track.title}</p>
            <R icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Max Teams" value={track.maxTeam != null ? String(track.maxTeam) : '—'} cls="text-[#2e7d32]" />
          </div>
        </div>
      )}
      {!event && !track && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
          <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#80deea]" /> Context
            </h4>
          </div>
          <div className="px-5 py-5 text-center text-[13px] text-gray-400">Loading info...</div>
        </div>
      )}
    </div>
  )
}

function R({ icon, label, value, cls = '', mono = false }) {
  return <p className="flex items-center gap-2 text-[13px]">{icon}<span className="text-gray-400">{label}</span><span className={`ml-auto font-semibold ${cls} ${mono ? 'text-[12px] font-medium' : ''}`}>{value}</span></p>
}
