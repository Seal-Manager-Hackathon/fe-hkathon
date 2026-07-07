import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, Clock, Users, Flag, Hash } from 'lucide-react'
import { getTrackDetail, getEventDetail } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import { formatDate } from '../../../../utils/format'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function TrackDetail() {
  const { eventId, trackId } = useParams()
  const [track, setTrack] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getTrackDetail(eventId, trackId)
        if (!cancelled) setTrack(data)
        if (data?.eventId) {
          try { const ev = await getEventDetail(data.eventId); if (!cancelled) setEvent(ev) } catch {}
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load track.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [eventId, trackId])

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="h-7 w-96 animate-pulse rounded bg-gray-200 mb-2" /><div className="h-60 animate-pulse rounded-xl bg-gray-100" /></div>
  if (error || !track) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-gray-500">{error || 'Track not found.'}</p><Link to={eventId ? `/admin/hackathons/${eventId}?tab=Tracks` : '/admin/hackathons'} className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Event</Link></div>

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6"><Link to={`/admin/hackathons/${eventId}?tab=Tracks`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Event</Link></div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{track.title}</h1>
            {track.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
          </div>
          {event && <p className="mt-1 text-[14px] text-gray-400">Event: <span className="font-medium text-[#064f5d]">{event.name}</span><Badge label={event.status} className={`ml-2 ${statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'}`} /></p>}
        </div>
        <Link to={`/admin/hackathons/${eventId}/tracks/${trackId}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"><Edit className="h-4 w-4" /> Edit Track</Link>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Details">
            <InfoRow label="Max Teams" icon={Users}><p className="text-[14px] font-semibold text-[#1f2f3a]">{track.maxTeam ?? 'Unlimited'}</p></InfoRow>
            <InfoRow label="Registered Teams" icon={Flag}><p className="text-[14px] font-semibold text-[#1f2f3a]">{track.registerTeamCount ?? 0}</p></InfoRow>
            <InfoRow label="Created At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDate(track.createdAt)}</p></InfoRow>
            {track.updatedAt && <InfoRow label="Updated At" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{formatDate(track.updatedAt)}</p></InfoRow>}
          </CardPanel>
          {track.description && <CardPanel title="Description"><p className="px-5 py-5 text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">{track.description}</p></CardPanel>}
        </div>
        {event && <EventInfoCard event={event} />}
      </div>
    </div>
  )
}

function EventInfoCard({ event }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4"><h4 className="text-[14px] font-bold text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-[#80deea]" /> Event Info</h4></div>
      <div className="divide-y divide-[#f5f5f5]">
        <div className="px-5 py-3.5">
          <p className="text-[14px] font-bold text-[#064f5d] leading-snug">{event.name}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
        </div>
        <div className="px-5 py-3 space-y-2">
          {event.season && <R icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season} cls="text-[#ef6c00]" />}
          <R icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDate(event.startTime)} mono />
          {event.registerLimitTime && <R icon={<Clock className="h-3.5 w-3.5 text-[#e65100]" />} label="Reg Deadline" value={formatDate(event.registerLimitTime)} mono />}
          <R icon={<Clock className="h-3.5 w-3.5 text-[#c62828]" />} label="End" value={formatDate(event.endTime)} mono />
          <R icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Teams" value={event.limitTeam ?? '—'} cls="text-[#2e7d32]" />
          <R icon={<Users className="h-3.5 w-3.5 text-[#6a1b9a]" />} label="Members" value={`${event.minMember ?? '—'} – ${event.maxMember ?? '—'}`} cls="text-[#6a1b9a]" />
          <R icon={<Hash className="h-3.5 w-3.5 text-[#37474f]" />} label="Rounds" value={event.numberRound ?? 0} cls="text-[#37474f]" />
        </div>
      </div>
    </div>
  )
}

function R({ icon, label, value, cls = '', mono = false }) {
  return <p className="flex items-center gap-2 text-[13px]">{icon}<span className="text-gray-400">{label}</span><span className={`ml-auto font-semibold ${cls} ${mono ? 'text-[12px] font-medium' : ''}`}>{value}</span></p>
}
