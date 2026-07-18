import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, DollarSign, Hash, Trophy, CircleCheck } from 'lucide-react'
import { getAwardDetail, getEventDetail } from '../../../../api/staff'
import Badge from '../../../../components/Badge'
import RichTextViewer from '../../../../components/RichTextViewer'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import StaffEventInfoCard from '../../../../components/StaffEventInfoCard'
import { formatDateTime } from '../../../../utils/format'

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function AwardDetail() {
  const { awardId } = useParams()
  const [award, setAward] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getAwardDetail(awardId)
        if (!cancelled) setAward(data)
        if (data?.eventId) {
          try { const ev = await getEventDetail(data.eventId); if (!cancelled) setEvent(ev) } catch {}
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load award.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [awardId])

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="h-7 w-96 animate-pulse rounded bg-gray-200 mb-2" /><div className="h-60 animate-pulse rounded-xl bg-gray-100" /></div>
  if (error || !award) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-gray-500">{error || 'Award not found.'}</p><Link to="/staff/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link></div>

  const usd = Number(award.prize || 0)

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link to={award.eventId ? `/staff/hackathons/${award.eventId}?tab=Awards` : '/staff/hackathons'} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Event</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{award.name}</h1>
            {award.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
          </div>
          {event && (
            <p className="mt-1 text-[14px] text-gray-400">
              Event: <Link to={award.eventId ? `/staff/hackathons/${award.eventId}` : '#'} className="font-medium text-[#064f5d] hover:underline">{event.name}</Link>
              <Badge label={event.status} className={`ml-2 ${statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'}`} />
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <CardPanel title="Award Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Level" icon={Trophy}>
                {(() => {
                  const ordinals = { 1: '1st', 2: '2nd', 3: '3rd' }
                  const label = ordinals[award.levelAward] || `${award.levelAward}th`
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f2fd] px-2.5 py-0.5 text-[12px] font-semibold text-[#1565c0]">
                      <Trophy className="h-3 w-3" />{label} Place
                    </span>
                  )
                })()}
              </InfoRow>
              <InfoRow label="Quantity" icon={Hash}><p className="text-[14px] font-semibold text-slate-600">{award.numberOfAward}</p></InfoRow>
              <InfoRow label="Prize" icon={DollarSign}><p className="text-[14px] font-semibold text-emerald-600">${usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p></InfoRow>
              <InfoRow label="Status" icon={CircleCheck}>
                {award.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
              <InfoRow label="Created At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(award.createdAt)}</p></InfoRow>
              <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{award.updatedAt ? formatDateTime(award.updatedAt) : '—'}</p></InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Description">
            <div className="px-5 py-5">
              {award.description
                ? <RichTextViewer content={award.description} />
                : <p className="text-[14px] text-gray-400">No description provided.</p>
              }
            </div>
          </CardPanel>
        </div>

        <StaffEventInfoCard event={event} />
      </div>
    </div>
  )
}
