import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../components/BaseTable'
import { getLecturerChapterLeaderboard } from '../../../api/lecturer'
import { Trophy, Medal, Hash, Users, Eye, MoreHorizontal, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { getRankScoreColor } from '../../../utils/rankScoreColor'

const PAGE_SIZE = 10

const rankBadge = {
  1: { bg: 'bg-[#fef3c7]', border: 'border-[#d97706]/30' },
  2: { bg: 'bg-[#f1f5f9]', border: 'border-[#64748b]/25' },
  3: { bg: 'bg-[#ffedd5]', border: 'border-[#ea580c]/25' },
}

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-[#d97706]" fill="#d97706" />
  if (rank === 2) return <Trophy className="h-4 w-4 text-[#64748b]" fill="#64748b" />
  if (rank === 3) return <Medal className="h-4 w-4 text-[#ea580c]" />
  return <span className="text-[13px] font-bold text-[#5a6a73] w-4 text-center">#{rank}</span>
}

function DetailModal({ open, team, onClose }) {
  if (!open || !team) return null
  const eventScores = team.eventScores || []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-[480px] max-h-[75vh] flex flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]"><Trophy className="h-5 w-5 text-[#e65100]" /></div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">{team.teamName}</h3>
              <p className="text-[12px] text-gray-400">Rank #{team.rank} · Chapter Score: <span className="font-semibold text-[#064f5d]">{team.chapterScore != null ? team.chapterScore.toFixed(2) : '—'}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">
          {eventScores.length === 0 ? (
            <p className="text-[14px] text-gray-400 text-center py-8">No event scores available.</p>
          ) : (
            <div className="space-y-3">
              {eventScores.map((es, i) => (
                <div key={es.eventId || i} className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-[#fafbfc] px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9] text-[12px] font-bold text-[#2e7d32]">{i + 1}</span>
                    <Link to={`/lecture/hackathons/${es.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline truncate">{es.eventName}</Link>
                  </div>
                  <span className="text-[16px] font-bold text-[#064f5d] shrink-0 ml-3">{es.eventScore != null ? es.eventScore.toFixed(2) : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-[#f0f0f0] px-6 py-3.5">
          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-400">Events participated:</span>
              <span className="font-semibold text-[#1f2f3a]">{team.eventCount || eventScores.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LecturerChapterLeaderboardPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ totalCount: 0, pageIndex: 1, eventCount: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detailTarget, setDetailTarget] = useState(null)

  const fetch = useCallback(async (page = 1) => {
    setLoading(true); setError('')
    try {
      const result = await getLecturerChapterLeaderboard(year, { PageIndex: page, PageSize: PAGE_SIZE })
      setItems(result.items || [])
      setMeta({ totalCount: result.totalCount || 0, pageIndex: result.pageIndex || 1, eventCount: result.eventCount || 0 })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leaderboard.')
      setItems([])
    } finally { setLoading(false) }
  }, [year])

  useEffect(() => { fetch(1) }, [fetch])

  const columns = [
    { key: 'rank', header: 'Rank', headerIcon: Hash, headerClassName: 'w-[72px]', className: 'w-[72px]',
      render: (row) => { const rb = rankBadge[row.rank] || null; return (<div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', rb ? `${rb.bg} border ${rb.border}` : 'bg-[#f4f6f8]')}><RankIcon rank={row.rank} /></div>) },
    },
    { key: 'teamName', header: 'Team', headerIcon: Users, headerClassName: 'w-[200px]', className: 'w-[200px]',
      render: (row) => (
        row.teamId ? (
          <Link to={`/lecture/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline truncate block">{row.teamName}</Link>
        ) : (
          <p className="text-[14px] font-semibold text-[#1f2f3a] truncate">{row.teamName}</p>
        )
      ),
    },
    { key: 'eventCount', header: 'Events', headerIcon: Calendar, headerClassName: 'text-center w-[80px]', className: 'text-center w-[80px]',
      render: (row) => (<span className="inline-flex items-center justify-center rounded-full bg-[#f0f7ff] px-2.5 py-0.5 text-[13px] font-bold text-[#1565c0]">{row.eventCount || 0}</span>) },
    { key: 'chapterScore', header: 'Chapter Score', headerIcon: Trophy, headerClassName: 'text-right w-[140px]', className: 'text-right w-[140px]',
      render: (row) => (<span className={cn('text-[16px] font-bold', getRankScoreColor(row.rank))}>{row.chapterScore != null ? row.chapterScore.toFixed(2) : '—'}</span>) },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right w-[90px]', className: 'text-right w-[90px]',
      render: (row) => (<button onClick={() => setDetailTarget(row)} className={viewBtnClass}><Eye className="h-3.5 w-3.5" /> View</button>) },
  ]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">Chapter Leaderboard</h1>
          <p className="mt-1 text-[14px] text-[#5a6a73]">Team rankings accumulated across all events in the year</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setYear((y) => y - 1)} className="cursor-pointer rounded-lg p-2 text-[#5a6a73] transition-colors hover:bg-[#f4f6f8] hover:text-[#1f2f3a]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-[22px] font-bold text-[#1f2f3a] min-w-[60px] text-center">{year}</span>
          <button onClick={() => setYear((y) => y + 1)} className="cursor-pointer rounded-lg p-2 text-[#5a6a73] transition-colors hover:bg-[#f4f6f8] hover:text-[#1f2f3a]">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <BaseTable borderless columns={columns} data={items} page={meta.pageIndex} pageSize={PAGE_SIZE} total={meta.totalCount} onPageChange={fetch} loading={loading} serverSide
          emptyText="No leaderboard data yet." keyExtractor={(row) => row.teamId} minWidth="700px" />
      </div>

      <DetailModal open={!!detailTarget} team={detailTarget} onClose={() => setDetailTarget(null)} />
    </div>
  )
}
