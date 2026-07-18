import { useState, useEffect, useCallback } from 'react'
import BaseTable from '../../../../components/BaseTable'
import { getLecturerEventLeaderboard } from '../../../../api/lecturer'
import { Link } from 'react-router-dom'
import { Trophy, Medal, Hash, Users, Target, Eye, MoreHorizontal, X, FileText } from 'lucide-react'
import { cn } from '../../../../utils/cn'
import { getRankScoreColor } from '../../../../utils/rankScoreColor'

const PAGE_SIZE = 5

const rankBadge = {
  1: { bg: 'bg-[#e0f2fe]', border: 'border-[#0EA5E9]/30' },
  2: { bg: 'bg-[#fef9c3]', border: 'border-[#EAB308]/30' },
  3: { bg: 'bg-[#dcfce7]', border: 'border-[#22C55E]/30' },
}

const viewBtnClass = 'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-[#0EA5E9]" fill="#0EA5E9" />
  if (rank === 2) return <Trophy className="h-4 w-4 text-[#EAB308]" fill="#EAB308" />
  if (rank === 3) return <Medal className="h-4 w-4 text-[#22C55E]" />
  return <span className="text-[13px] font-bold text-[#5a6a73] w-4 text-center">#{rank}</span>
}

function DetailModal({ open, team, eventId, onClose }) {
  if (!open || !team) return null
  const roundScores = team.roundScores || []

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-[480px] max-h-[75vh] flex flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Trophy className="h-5 w-5 text-[#e65100]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">{team.teamName}</h3>
              <p className="text-[12px] text-gray-400">
                Rank #{team.rank} · Event Score: <span className="font-semibold text-[#064f5d]">{team.eventScore != null ? team.eventScore.toFixed(2) : '—'}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          {roundScores.length === 0 ? (
            <p className="text-[14px] text-gray-400 text-center py-8">No round scores available.</p>
          ) : (
            <div className="space-y-3">
              {roundScores.map((rs, i) => (
                <div key={rs.roundNo || i} className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-[#fafbfc] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e3f2fd] text-[12px] font-bold text-[#1565c0]">
                      {rs.roundNo}
                    </span>
                    <span className="text-[14px] font-medium text-[#1f2f3a]">{rs.roundName}</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#064f5d]">{rs.scopeScore != null ? rs.scopeScore.toFixed(2) : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[#f0f0f0] px-6 py-3.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Track:</span>
              <span className="font-semibold text-[#1f2f3a]">{team.trackTitle || '—'}</span>
            </div>
            {team.topicTitle && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Topic:</span>
                <span className="font-semibold text-[#1f2f3a]">{team.topicTitle}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LecturerEventLeaderboardTab({ eventId }) {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ totalCount: 0, pageIndex: 1, eventName: '', totalRounds: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detailTarget, setDetailTarget] = useState(null)

  const fetch = useCallback(async (page = 1) => {
    if (!eventId) return
    setLoading(true)
    setError('')
    try {
      const result = await getLecturerEventLeaderboard(eventId, { PageIndex: page, PageSize: PAGE_SIZE })
      setItems(result.items || [])
      setMeta({
        totalCount: result.totalCount || 0,
        pageIndex: result.pageIndex || 1,
        eventName: result.eventName || '',
        totalRounds: result.totalRounds || 0,
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leaderboard.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => { fetch(1) }, [fetch])

  const columns = [
    {
      key: 'rank', header: 'Rank', headerIcon: Hash,
      headerClassName: 'w-[72px]', className: 'w-[72px]',
      render: (row) => {
        const rb = rankBadge[row.rank] || null
        return (
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', rb ? `${rb.bg} border ${rb.border}` : 'bg-[#f4f6f8]')}>
            <RankIcon rank={row.rank} />
          </div>
        )
      },
    },
    {
      key: 'teamName', header: 'Team', headerIcon: Users,
      headerClassName: 'w-[160px]', className: 'w-[160px]',
      render: (row) => (
        row.registerTeamId ? (
          <Link to={`/lecture/register-teams/${row.registerTeamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline truncate block">{row.teamName}</Link>
        ) : (
          <p className="text-[14px] font-semibold text-[#1f2f3a] truncate">{row.teamName}</p>
        )
      ),
    },
    {
      key: 'trackTitle', header: 'Track', headerIcon: Target,
      headerClassName: 'w-[120px]', className: 'w-[120px]',
      render: (row) => (
        <span className="text-[13px] font-semibold text-[#1f2f3a]">{row.trackTitle || '—'}</span>
      ),
    },
    {
      key: 'topicTitle', header: 'Topic', headerIcon: FileText,
      headerClassName: 'w-[110px]', className: 'w-[110px]',
      render: (row) => (
        <span className="text-[13px] text-gray-400">{row.topicTitle || '—'}</span>
      ),
    },
    {
      key: 'eventScore', header: 'Event Score', headerIcon: Trophy,
      headerClassName: 'text-right w-[130px]', className: 'text-right w-[130px]',
      render: (row) => (
        <span className={cn('text-[16px] font-bold', getRankScoreColor(row.rank))}>
          {row.eventScore != null ? row.eventScore.toFixed(2) : '—'}
        </span>
      ),
    },
    {
      key: 'actions', header: 'Actions', headerIcon: MoreHorizontal,
      headerClassName: 'text-right w-[90px]', className: 'text-right w-[90px]',
      render: (row) => (
        <button onClick={() => setDetailTarget(row)} className={viewBtnClass}>
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ]

  return (
    <div>
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#e65100]" />
            <div>
              <h3 className="text-[15px] font-bold text-[#1f2f3a]">{meta.eventName || 'Event'} Leaderboard</h3>
              <p className="text-[12px] text-gray-400">
                {meta.totalRounds > 0 ? `Rankings across ${meta.totalRounds} round${meta.totalRounds > 1 ? 's' : ''} — weighted event score` : 'Overall event rankings'}
              </p>
            </div>
          </div>
        </div>
        <BaseTable
          borderless
          columns={columns}
          data={items}
          page={meta.pageIndex}
          pageSize={PAGE_SIZE}
          total={meta.totalCount}
          onPageChange={fetch}
          loading={loading}
          serverSide
          emptyText="No leaderboard data yet. Rankings will appear once judging is complete."
          keyExtractor={(row) => row.registerTeamId || row.teamId}
          minWidth="720px"
        />
      </div>

      <DetailModal
        open={!!detailTarget}
        team={detailTarget}
        eventId={eventId}
        onClose={() => setDetailTarget(null)}
      />
    </div>
  )
}
