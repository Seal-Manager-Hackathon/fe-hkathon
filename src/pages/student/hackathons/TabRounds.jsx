import { useState, useEffect } from 'react'
import { Calendar, Users, Layers, ListChecks, Eye } from 'lucide-react'
import { getStudentRounds } from '../../../api/student'
import { formatDate } from '../../../utils/format'
import Pagination from '../../../components/Pagination'
import RoundDetailModal from './RoundDetailModal'
import CriteriaModal from './CriteriaModal'

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                    */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl border border-[#e8ecf0] bg-white p-5">
          <div className="mb-3 h-5 w-40 rounded bg-gray-200" />
          <div className="mb-3 h-4 w-full rounded bg-gray-100" />
          <div className="flex gap-4">
            <div className="h-4 w-28 rounded bg-gray-100" />
            <div className="h-4 w-28 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
        <Layers size={22} />
      </div>
      <p className="text-[15px] font-medium text-[#1f2f3a]">No rounds</p>
      <p className="mt-1 text-[13px] text-[#7a8e99]">
        Rounds will appear here once the event is set up.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Error banner                                                        */
/* ------------------------------------------------------------------ */

function ErrorBanner({ message }) {
  return (
    <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
      {message}
    </div>
  )
}

/* ================================================================== */
/*  TabRounds                                                          */
/* ================================================================== */

export default function TabRounds({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedRoundId, setSelectedRoundId] = useState(null)
  const [criteriaRoundId, setCriteriaRoundId] = useState(null)

  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false

    async function fetchRounds() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentRounds(eventId, {
          PageIndex: pageIndex,
          PageSize: pageSize,
        })
        if (!cancelled) {
          setRounds(result.rounds || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Cannot load rounds.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRounds()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  /* ---- Loading ---- */
  if (loading) return <LoadingSkeleton />

  /* ---- Error ---- */
  if (error) return <ErrorBanner message={error} />

  /* ---- Empty ---- */
  if (rounds.length === 0) return <EmptyState />

  /* ---- Data ---- */
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {rounds.map((round) => (
          <div
            key={round.id}
            className="rounded-xl border border-[#e8ecf0] bg-white p-5 transition-colors hover:border-[#d0d7de]"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left info */}
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
                    <Layers size={15} className="text-[#1565c0]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-[#1f2f3a]">
                      Round {round.roundNo}{round.name ? `: ${round.name}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-[#5a6a73]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="shrink-0 text-[#8a9ba6]" />
                    <span>{formatDate(round.startTime)} &ndash; {formatDate(round.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="shrink-0 text-[#8a9ba6]" />
                    <span>Max {round.limitTeam ?? '&mdash;'} teams</span>
                  </div>
                </div>
              </div>

              {/* Right actions */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCriteriaRoundId(round.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#5a6a73] transition-colors hover:border-[#1565c0]/30 hover:bg-[#f0f7ff] hover:text-[#1565c0]"
                >
                  <ListChecks size={14} />
                  Criteria
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRoundId(round.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a]"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
      )}

      {/* Modals */}
      <RoundDetailModal
        roundId={selectedRoundId}
        onClose={() => setSelectedRoundId(null)}
      />
      <CriteriaModal
        roundId={criteriaRoundId}
        onClose={() => setCriteriaRoundId(null)}
      />
    </div>
  )
}
