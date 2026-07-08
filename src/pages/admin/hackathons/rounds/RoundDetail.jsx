import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, Clock, Users, Hash, Flag, CircleCheck } from 'lucide-react'
import { getRoundDetail, getEventDetail } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import RichTextViewer from '../../../../components/RichTextViewer'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import EventInfoCard from '../../../../components/EventInfoCard'
import { formatDateTime } from '../../../../utils/format'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function RoundDetail() {
  const { roundId } = useParams()
  const [round, setRound] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getRoundDetail(roundId)
        if (!cancelled) {
          setRound(data)
          if (data?.eventId) {
            try { const ev = await getEventDetail(data.eventId); if (!cancelled) setEvent(ev) } catch {}
          }
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load round.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId])

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="h-7 w-96 animate-pulse rounded bg-gray-200 mb-2" /><div className="h-60 animate-pulse rounded-xl bg-gray-100" /></div>
  if (error || !round) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-gray-500">{error || 'Round not found.'}</p><Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link></div>

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={event ? `/admin/hackathons/${event.id}?tab=Rounds` : '/admin/hackathons'} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">&larr; Back to Event</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
              <span className="text-gray-400 font-normal">Round {round.roundNo}:</span> {round.name}
            </h1>
            {round.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
          </div>
          {event ? (
            <p className="mt-1 text-[14px] text-gray-400">
              Event: <Link to={`/admin/hackathons/${event.id}`} className="font-medium text-[#064f5d] hover:underline">{event.name}</Link>
              <Badge label={event.status} className={`ml-2 ${statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'}`} />
            </p>
          ) : (
            <p className="mt-1 text-[14px] text-gray-400">Event: —</p>
          )}
        </div>
        <Link to={`/admin/rounds/${roundId}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Edit className="h-4 w-4" />Edit Round
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Round Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Round Number" icon={Hash}>
                <p className="text-[14px] font-semibold text-[#1f2f3a]">Round {round.roundNo} of {event?.numberRound ?? '—'}</p>
              </InfoRow>
              <InfoRow label="Start Time" icon={Calendar}>
                <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(round.startTime)}</p>
              </InfoRow>
              <InfoRow label="End Time" icon={Clock}>
                <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(round.endTime)}</p>
              </InfoRow>
              <InfoRow label="Submission Start" icon={Flag}>
                <p className="text-[14px] text-[#1f2f3a]">{round.startSubmission ? formatDateTime(round.startSubmission) : '—'}</p>
              </InfoRow>
              <InfoRow label="Submission End" icon={CircleCheck}>
                <p className="text-[14px] text-[#1f2f3a]">{round.endSubmission ? formatDateTime(round.endSubmission) : '—'}</p>
              </InfoRow>
              <InfoRow label="Max Teams" icon={Users}>
                <p className="text-[14px] font-semibold text-[#1f2f3a]">{round.limitTeam ?? 'Unlimited'}</p>
              </InfoRow>
              <InfoRow label="Status" icon={CircleCheck}>
                {round.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
              <InfoRow label="Created At" icon={Calendar}>
                <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(round.createdAt)}</p>
              </InfoRow>
              <InfoRow label="Last Updated" icon={Clock}>
                <p className="text-[14px] text-[#1f2f3a]">{round.updatedAt ? formatDateTime(round.updatedAt) : '—'}</p>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Description">
            <div className="px-5 py-5">
              <RichTextViewer content={round.description} />
            </div>
          </CardPanel>
        </div>
        <EventInfoCard event={event} />
      </div>
    </div>
  )
}
