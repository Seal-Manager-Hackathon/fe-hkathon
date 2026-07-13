import { useState, useEffect } from 'react'
import { MapPin, Trophy, Award } from 'lucide-react'
import { getStudentEventLeaderboard } from '../../../api/student'
import Pagination from '../../../components/Pagination'
import { cn } from '../../../utils/cn'
import { getLbInitials, getLbColor } from './eventDetailHelpers'

/* ------------------------------------------------------------------ */
/*  RankIcon                                                          */
/* ------------------------------------------------------------------ */

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy size={20} className="text-[#d97706]" fill="#d97706" />
  if (rank === 2) return <Trophy size={20} className="text-[#64748b]" fill="#64748b" />
  if (rank === 3) return <Award size={20} className="text-[#ea580c]" />
  return <span className="w-5 text-center text-[14px] font-bold text-[#5a6a73]">#{rank}</span>
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Error banner                                                       */
/* ------------------------------------------------------------------ */

function ErrorBanner({ message }) {
  return (
    <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
      {message}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
        <MapPin size={22} />
      </div>
      <p className="text-[15px] font-medium text-[#1f2f3a]">No leaderboard data</p>
      <p className="mt-1 text-[13px] text-[#7a8e99]">
        Leaderboard will appear once scores are published.
      </p>
    </div>
  )
}

/* ================================================================== */
/*  TabEventLeaderboard                                                */
/* ================================================================== */

export default function TabEventLeaderboard({ eventId }) {
  const [data, setData] = useState(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedTeam, setExpandedTeam] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false

    async function fetchLb() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentEventLeaderboard(eventId, {
          PageIndex: pageIndex,
          PageSize: pageSize,
        })
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Cannot load leaderboard.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLb()
    return () => {
      cancelled = true
    }
  }, [eventId, pageIndex, pageSize])

  const items = data?.items || []
  const totalPages = data ? Math.ceil((data.totalCount || 0) / pageSize) : 0

  if (loading) return <LoadingSkeleton />

  if (error) return <ErrorBanner message={error} />

  if (items.length === 0) return <EmptyState />

  return (
    <div>
      <div className="space-y-2.5">
        {items.map((team) => {
          const isExpanded = expandedTeam === team.registerTeamId
          const rankScoreColor =
            team.rank === 1
              ? 'text-[#b45309]'
              : team.rank === 2
                ? 'text-[#475569]'
                : team.rank === 3
                  ? 'text-[#c2410c]'
                  : 'text-[#064f5d]'

          return (
            <div
              key={team.registerTeamId}
              className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white transition-all"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedTeam(isExpanded ? null : team.registerTeamId)
                }
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#fafbfc]"
              >
                {/* Rank icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8]">
                  <RankIcon rank={team.rank} />
                </div>

                {/* Color avatar with initials */}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white',
                    getLbColor(team.teamId),
                  )}
                >
                  {getLbInitials(team.teamName)}
                </div>

                {/* Team name + track/topic */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">
                    {team.teamName}
                  </p>
                  {team.trackTitle && (
                    <p className="truncate text-[11px] text-[#8a9ba6]">
                      {team.trackTitle}
                      {team.topicTitle ? ` · ${team.topicTitle}` : ''}
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="ml-2 flex shrink-0 flex-col items-end">
                  <span
                    className={cn(
                      'text-[20px] font-bold leading-none',
                      rankScoreColor,
                    )}
                  >
                    {team.eventScore?.toFixed(1)}
                  </span>
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                    PTS
                  </span>
                </div>
              </button>

              {/* Expanded round scores breakdown */}
              {isExpanded && team.roundScores && team.roundScores.length > 0 && (
                <div className="border-t border-[#f0f4f8] bg-[#fafbfc] px-4 py-3">
                  <div className="space-y-1.5">
                    {team.roundScores.map((rs) => (
                      <div
                        key={rs.roundNo}
                        className="flex items-center justify-between px-2 py-1"
                      >
                        <span className="text-[12px] text-[#5a6a73]">
                          Round {rs.roundNo}: {rs.roundName}
                        </span>
                        <span className="text-[13px] font-semibold text-[#1f2f3a]">
                          {rs.scopeScore?.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-5">
          <Pagination
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={setPageIndex}
          />
        </div>
      )}
    </div>
  )
}
