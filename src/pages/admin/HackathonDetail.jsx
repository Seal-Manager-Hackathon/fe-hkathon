import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Info, FileText, Layers, FolderKanban } from 'lucide-react'
import { getEventDetail } from '../../api/admin'
import OverviewTab from './OverviewTab'
import DescriptionTab from './DescriptionTab'
import RoundsTab from './RoundsTab'
import TracksTab from './TracksTab'

const TABS = [
  { key: 'Overview', icon: <Info className="h-4 w-4" /> },
  { key: 'Description', icon: <FileText className="h-4 w-4" /> },
  { key: 'Rounds', icon: <Layers className="h-4 w-4" /> },
  { key: 'Tracks', icon: <FolderKanban className="h-4 w-4" /> },
]

export default function HackathonDetail() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const tabParam = searchParams.get('tab')
  const validKeys = TABS.map((t) => t.key)
  const [tab, setTab] = useState(() => validKeys.includes(tabParam) ? tabParam : 'Overview')

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

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => switchTab(t.key)} className={`cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[14px] ${tab === t.key ? 'border-b-2 border-[#064f5d] text-[#064f5d]' : 'text-gray-400 hover:text-[#1f2f3a]'}`}>
            {t.icon}
            {t.key}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab event={event} />}
      {tab === 'Description' && <DescriptionTab eventId={id} description={event.description} />}
      {tab === 'Rounds' && <RoundsTab eventId={id} />}
      {tab === 'Tracks' && <TracksTab eventId={id} />}
    </div>
  )
}
