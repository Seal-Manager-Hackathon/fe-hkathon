import { useState, useEffect, useCallback } from 'react'
import { X, Trophy, Hash, Users, Target } from 'lucide-react'
import BaseTable from '../BaseTable'
import RankIcon from './RankIcon'
import { cn } from '../../utils/cn'
import { getRankScoreColor } from '../../utils/rankScoreColor'

const PAGE_SIZE = 5

const rankBadge = {
  1: { bg: 'bg-[#e0f2fe]', border: 'border-[#0EA5E9]/30' },
  2: { bg: 'bg-[#fef9c3]', border: 'border-[#EAB308]/30' },
  3: { bg: 'bg-[#dcfce7]', border: 'border-[#22C55E]/30' },
}

/**
 * Round leaderboard modal.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   roundId: string,
 *   roundName: string,
 *   fetchLeaderboard: (roundId: string, params: object) => Promise<{ items: Array, totalCount: number, pageIndex: number, roundName?: string, eventName?: string }>,
 * }} props
 */
export default function RoundLeaderboardModal({ open, onClose, roundId, roundName, fetchLeaderboard }) {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ totalCount: 0, pageIndex: 1, roundName: '', eventName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetch = useCallback(async (page = 1) => {
    if (!roundId) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchLeaderboard(roundId, { PageIndex: page, PageSize: PAGE_SIZE })
      setItems(result.items || [])
      setMeta({
        totalCount: result.totalCount || 0,
        pageIndex: result.pageIndex || 1,
        roundName: result.roundName || roundName || '',
        eventName: result.eventName || '',
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load leaderboard.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [roundId, roundName, fetchLeaderboard])

  useEffect(() => {
    if (open) fetch(1)
  }, [open, fetch])

  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      headerIcon: Hash,
      headerClassName: 'w-[90px]',
      className: 'w-[90px]',
      render: (row) => {
        const rb = rankBadge[row.rank] || null
        return (
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            rb ? `${rb.bg} border ${rb.border}` : 'bg-[#f4f6f8]'
          )}>
            <RankIcon rank={row.rank} />
          </div>
        )
      },
    },
    {
      key: 'teamName',
      header: 'Team',
      headerIcon: Users,
      render: (row) => (
        <div>
          <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.teamName}</p>
        </div>
      ),
    },
    {
      key: 'track',
      header: 'Track / Topic',
      headerIcon: Target,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-[#1f2f3a]">{row.trackTitle || '—'}</p>
          {row.topicTitle && <p className="text-[12px] text-gray-400">{row.topicTitle}</p>}
        </div>
      ),
    },
    {
      key: 'totalScore',
      header: 'Score',
      headerIcon: Trophy,
      headerClassName: 'text-right w-[100px]',
      className: 'text-right w-[100px]',
      render: (row) => (
        <span className={cn(
          'text-[16px] font-bold',
          getRankScoreColor(row.rank)
        )}>
          {row.totalScore != null ? row.totalScore.toFixed(2) : '—'}
        </span>
      ),
    },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[92%] sm:max-w-[860px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Trophy className="h-5 w-5 text-[#e65100]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">Leaderboard</h3>
              <p className="text-[12px] text-gray-400 truncate">
                {meta.roundName || roundName}{meta.eventName ? ` · ${meta.eventName}` : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-auto">
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
            emptyText="No leaderboard data yet. Teams will appear once judging scores are submitted."
            keyExtractor={(row) => row.registerTeamId || row.teamId}
            minWidth="520px"
          />
        </div>
      </div>
    </div>
  )
}
