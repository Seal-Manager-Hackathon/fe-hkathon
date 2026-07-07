import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar, Users } from 'lucide-react'
import { getEventDetail, getRounds } from '../../api/admin'
import Badge from '../../components/Badge'
import BaseTable from '../../components/BaseTable'
import { formatDate } from '../../utils/format'

const TABS = ['Overview', 'Rounds']

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const roundColumns = [
  { key: 'name', header: 'Round Name', render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span> },
  { key: 'roundNo', header: '#', render: (row) => <span className="text-[13px] text-gray-500">Round {row.roundNo}</span> },
  { key: 'startTime', header: 'Start', render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.startTime)}</p> },
  { key: 'endTime', header: 'End', render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.endTime)}</p> },
  { key: 'limitTeam', header: 'Max Teams', render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span> },
  { key: 'status', header: 'Status', render: (row) => row.isDisable ? <Badge label="Disabled" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
]

export default function HackathonDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('Overview')

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
          <button key={t} onClick={() => setTab(t)} className={`cursor-pointer shrink-0 px-4 py-3 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[14px] ${tab === t ? 'border-b-2 border-[#064f5d] text-[#064f5d]' : 'text-gray-400 hover:text-[#1f2f3a]'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab event={event} />}
      {tab === 'Rounds' && <RoundsTab eventId={id} />}
    </div>
  )
}

function OverviewTab({ event }) {
  const rows = [
    { label: 'Name', value: event.name },
    { label: 'Description', value: event.description || '—', full: true },
    { label: 'Season', value: event.season || '—' },
    { label: 'Status', badge: event.status, badgeClass: statusBadge[event.status] },
    { label: 'Active', badge: event.isDisable ? 'Disabled' : 'Active', badgeClass: event.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]' },
    { label: 'Start Time', value: formatDate(event.startTime) },
    { label: 'End Time', value: formatDate(event.endTime) },
    { label: 'Registration Deadline', value: event.registerLimitTime ? formatDate(event.registerLimitTime) : '—' },
    { label: 'Max Teams', value: event.limitTeam ?? '—' },
    { label: 'Min Members', value: event.minMember ?? '—' },
    { label: 'Max Members', value: event.maxMember ?? '—' },
    { label: 'Number of Rounds', value: event.numberRound ?? 0 },
    { label: 'Created', value: formatDate(event.createdAt) },
    { label: 'Last Updated', value: formatDate(event.updatedAt) },
  ]
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white">
      <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4"><h3 className="text-[15px] font-bold text-[#1f2f3a]">Event Information</h3></div>
      <div className="divide-y divide-[#f5f5f5]">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center px-5 ${row.full ? 'flex-col items-start py-3' : 'justify-between py-3'}`}>
            <span className={`text-[13px] text-gray-400 ${row.full ? 'mb-1 w-full' : ''}`}>{row.label}</span>
            {row.badge ? <Badge label={row.badge} className={row.badgeClass} /> : <span className={`text-[14px] font-medium text-[#1f2f3a] ${row.full ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{row.value}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

const PAGE_SIZE = 10

function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRounds = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const result = await getRounds(eventId, { PageIndex: pageIndex, PageSize: PAGE_SIZE })
      setRounds(result.rounds || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setRounds([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, pageIndex])

  useEffect(() => { fetchRounds() }, [fetchRounds])

  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds ({totalCount})</h3>
        <Link to={`/admin/hackathons/${eventId}/rounds/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">
          + Create Round
        </Link>
      </div>
      {error && <div className="mx-5 mt-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <div className="max-w-full overflow-x-auto">
        <BaseTable columns={roundColumns} data={rounds} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText="No rounds configured for this event." keyExtractor={(row) => row.id} minWidth="700px" />
      </div>
    </div>
  )
}
