import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Edit, Calendar, Users } from 'lucide-react'
import { getEventDetail } from '../../api/admin'
import Badge from '../../components/Badge'
import { formatDate } from '../../utils/format'
import { statusBadge } from './OverviewTab'
import OverviewTab from './OverviewTab'
import RoundsTab from './RoundsTab'

const TABS = ['Overview', 'Rounds']

export default function HackathonDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const tabParam = searchParams.get('tab')
  const [tab, setTab] = useState(() => TABS.includes(tabParam) ? tabParam : 'Overview')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getEventDetail(id)
        if (!cancelled) setEvent(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load event detail.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  function switchTab(t) {
    setTab(t)
    setSearchParams({ tab: t }, { replace: true })
  }

  if (loading) return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 space-y-3"><div className="h-8 w-64 animate-pulse rounded bg-gray-200" /><div className="h-4 w-96 animate-pulse rounded bg-gray-200" /></div>
      <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
    </div>
  )

  if (error) {
    const isNotFound = error === 'Event Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">{isNotFound ? 'Không tìm thấy sự kiện' : error}</p>
        <Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
    )
  }

  if (!event) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <p className="text-[18px] font-semibold text-gray-500">Event not found.</p>
      <Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
    </div>
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link to="/admin/hackathons" className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{event.name}</h1>
            <Badge label={event.status} className={statusBadge[event.status] || 'bg-[#f5f5f5] text-[#757575]'} />
            {event.isDisable && <Badge label="Disabled" className="bg-[#fce4ec] text-[#c62828]" />}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] sm:text-[13px] text-gray-400">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{event.season ? `${event.season} · ` : ''}{formatDate(event.startTime)} – {formatDate(event.endTime)}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event.limitTeam ?? '—'} teams</span>
          </div>
        </div>
        <Link to={`/admin/hackathons/${id}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Edit className="h-4 w-4" />Edit Hackathon
        </Link>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
        {TABS.map((t) => (
          <button key={t} onClick={() => switchTab(t)} className={`cursor-pointer shrink-0 px-4 py-3 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[14px] ${tab === t ? 'border-b-2 border-[#064f5d] text-[#064f5d]' : 'text-gray-400 hover:text-[#1f2f3a]'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab event={event} />}
      {tab === 'Rounds' && <RoundsTab eventId={id} />}
    </div>
  )
}
