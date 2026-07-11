import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Users, Hash, Flag, CircleCheck } from 'lucide-react'
import { getLecturerRoundDetail } from '../../../api/lecturer'
import Badge from '../../../components/Badge'
import RichTextViewer from '../../../components/RichTextViewer'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import { formatDateTime } from '../../../utils/format'

export default function LecturerRoundDetail() {
  const { roundId } = useParams()
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getLecturerRoundDetail(roundId)
        if (!cancelled) setRound(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load round.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error || !round) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">{error || 'Round not found.'}</p>
        <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={round?.eventId ? `/lecture/hackathons/${round.eventId}` : '/lecture/hackathons'} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Event
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
              <span className="text-gray-400 font-normal">Round {round.roundNo}:</span> {round.name}
            </h1>
            <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Round Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Round Number" icon={Hash}>
                <p className="text-[14px] font-semibold text-[#1f2f3a]">Round {round.roundNo}</p>
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
      </div>
    </div>
  )
}
