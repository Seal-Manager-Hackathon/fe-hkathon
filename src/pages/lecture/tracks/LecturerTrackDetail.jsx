import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Flag, FileText } from 'lucide-react'
import { getLecturerTrackDetail } from '../../../api/lecturer'
import Badge from '../../../components/Badge'
import RichTextViewer from '../../../components/RichTextViewer'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import { formatDateTime } from '../../../utils/format'

const roleColors = {
  Judge: 'bg-[#e8f5e9] text-[#2e7d32]',
  Mentor: 'bg-[#e3f2fd] text-[#1565c0]',
}

export default function LecturerTrackDetail() {
  const { trackId } = useParams()
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getLecturerTrackDetail(trackId)
        if (!cancelled) setTrack(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load track.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [trackId])

  if (loading) return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="h-7 w-96 animate-pulse rounded bg-gray-200 mb-2" />
      <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
    </div>
  )

  if (error || !track) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <p className="text-[18px] font-semibold text-gray-500">{error || 'Track not found.'}</p>
      <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
    </div>
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={track.eventId ? `/lecture/hackathons/${track.eventId}?tab=Tracks` : '/lecture/hackathons'} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Event
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{track.title}</h1>
            <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
            {track.eventRoleName && (
              <Badge label={track.eventRoleName} className={roleColors[track.eventRoleName] || 'bg-[#f5f5f5] text-[#757575]'} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Track Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Max Teams" icon={Users}>
                <p className="text-[14px] font-semibold text-[#1f2f3a]">{track.maxTeam ?? 'Unlimited'}</p>
              </InfoRow>
              <InfoRow label="Registered Teams" icon={Flag}>
                <p className="text-[14px] font-semibold text-[#1f2f3a]">{track.registerTeamCount ?? 0}</p>
              </InfoRow>
              <InfoRow label="Your Role" icon={FileText}>
                <Badge label={track.eventRoleName || '—'} className={track.eventRoleName ? (roleColors[track.eventRoleName] || 'bg-[#f5f5f5] text-[#757575]') : 'bg-[#f5f5f5] text-[#757575]'} />
              </InfoRow>
              <InfoRow label="Created At" icon={Calendar}>
                <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(track.createdAt)}</p>
              </InfoRow>
              <InfoRow label="Last Updated" icon={Clock}>
                <p className="text-[14px] text-[#1f2f3a]">{track.updatedAt ? formatDateTime(track.updatedAt) : '—'}</p>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Description">
            <div className="px-5 py-5">
              <RichTextViewer content={track.description} />
            </div>
          </CardPanel>
        </div>
      </div>
    </div>
  )
}
