import { useState, useEffect } from 'react'
import { Award, Eye } from 'lucide-react'
import { getStudentAwards } from '../../../api/student'
import Pagination from '../../../components/Pagination'
import { cn } from '../../../utils/cn'
import { getLevelLabel } from './eventDetailConstants'
import AwardDetailModal from './AwardDetailModal'

function AwardCard({ award, onView }) {
  const levelStyle = getLevelLabel(award.levelAward)

  return (
    <div className="flex items-start gap-4 rounded-xl border border-[#e8ecf0] bg-white p-4 transition-shadow hover:shadow-sm">
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
          levelStyle.icon
        )}
      >
        <Award size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold text-[#1f2f3a]">{award.name}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#5a6a73]">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
              levelStyle.color
            )}
          >
            {levelStyle.label}
          </span>
          <span>
            <span className="font-medium text-[#1f2f3a]">{award.numberOfAward ?? '—'}</span> winner{award.numberOfAward !== 1 ? 's' : ''}
          </span>
          <span>
            Prize:{' '}
            <span className="font-semibold text-[#f59e0b]">
              {award.prize != null
                ? new Intl.NumberFormat('vi-VN').format(award.prize) + ' ₫'
                : '—'}
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={() => onView(award.id)}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#e8ecf0] px-3 py-2 text-[12px] font-semibold text-[#5a6a73] transition-colors hover:bg-[#f0f4f8] hover:text-[#1f2f3a] cursor-pointer"
      >
        <Eye size={14} />
        View
      </button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[76px] animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fef3c7] text-[#f59e0b]">
        <Award size={22} />
      </div>
      <p className="text-[15px] font-medium text-[#1f2f3a]">No awards yet</p>
      <p className="mt-1 text-[13px] text-[#7a8e99]">
        Awards will appear here once they are announced.
      </p>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
      {message}
    </div>
  )
}

export default function TabAwards({ eventId }) {
  const [awards, setAwards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAwardId, setSelectedAwardId] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false

    async function fetchAwards() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentAwards(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) {
          setAwards(data.awards || [])
          setTotalCount(data.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Cannot load awards.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAwards()
    return () => { cancelled = true }
  }, [eventId, pageIndex])

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading) return <LoadingSkeleton />

  if (error) return <ErrorBanner message={error} />

  return (
    <div>
      {awards.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {awards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onView={(id) => setSelectedAwardId(id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={pageIndex}
          totalPages={totalPages}
          onPageChange={(p) => setPageIndex(p)}
        />
      )}

      {selectedAwardId && (
        <AwardDetailModal
          awardId={selectedAwardId}
          onClose={() => setSelectedAwardId(null)}
        />
      )}
    </div>
  )
}
