import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, CircleCheck, BookOpen, Users, Flag } from 'lucide-react'
import { getTopicDetail, getTrackDetail } from '../../../../api/staff'
import Badge from '../../../../components/Badge'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import RichTextViewer from '../../../../components/RichTextViewer'
import { formatDateTime } from '../../../../utils/format'

export default function TopicDetail() {
  const { trackId, topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getTopicDetail(topicId)
        if (cancelled) return
        setTopic(data)
        if (trackId) {
          try {
            const tr = await getTrackDetail(trackId)
            if (!cancelled) setTrack(tr)
          } catch {}
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load topic.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [trackId, topicId])

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="h-7 w-96 animate-pulse rounded bg-gray-200 mb-2" /><div className="h-60 animate-pulse rounded-xl bg-gray-100" /></div>
  if (error || !topic) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-gray-500">{error || 'Topic not found.'}</p><Link to="/staff/tracks" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Tracks</Link></div>

  const backUrl = trackId
    ? `/staff/tracks/${trackId}/topics`
    : '/staff/tracks'

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link to={backUrl} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{topic.title}</h1>
            {topic.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
          </div>
          {track && <p className="mt-1 text-[14px] text-gray-400">Track: <Link to={`/staff/tracks/${trackId}`} className="font-medium text-[#064f5d] hover:underline">{track.title}</Link></p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Topic Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Status" icon={CircleCheck}>
                {topic.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
              <InfoRow label="Created At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(topic.createdAt)}</p></InfoRow>
              <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{topic.updatedAt ? formatDateTime(topic.updatedAt) : '—'}</p></InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Description">
            <div className="px-5 py-5">
              <RichTextViewer content={topic.description} />
            </div>
          </CardPanel>
        </div>

        <TrackSidebar track={track} trackId={trackId} />
      </div>
    </div>
  )
}

function TrackSidebar({ track, trackId }) {
  if (!track) {
    return (
      <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
        <div className="bg-gradient-to-r from-[#0a6e7d] to-[#0d8a96] px-5 py-4">
          <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#80deea]" /> Track
          </h4>
        </div>
        <div className="px-5 py-8 text-center text-[13px] text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#0a6e7d] to-[#0d8a96] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#80deea]" /> Track
        </h4>
      </div>
      <div className="divide-y divide-[#f5f5f5]">
        <div className="px-5 py-3.5">
          <Link to={`/staff/tracks/${trackId}`} className="text-[14px] font-bold text-[#064f5d] hover:underline">{track.title}</Link>
        </div>
        <div className="px-5 py-3 space-y-2">
          <R icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Max Teams" value={track.maxTeam != null ? String(track.maxTeam) : '—'} />
          <R icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Registered" value={track.registerTeamCount ?? '—'} />
          <R icon={<Calendar className="h-3.5 w-3.5 text-[#1565c0]" />} label="Created" value={formatDateTime(track.createdAt)} mono />
          <R icon={<Clock className="h-3.5 w-3.5 text-[#7b1fa2]" />} label="Updated" value={formatDateTime(track.updatedAt)} mono />
        </div>
      </div>
    </div>
  )
}

function R({ icon, label, value, mono = false }) {
  return <p className="flex items-center gap-2 text-[13px]">{icon}<span className="text-gray-400">{label}</span><span className={`ml-auto font-semibold ${mono ? 'text-[12px] font-medium' : ''}`}>{value}</span></p>
}
