import { useEffect, useState } from 'react'
import { Inbox } from 'lucide-react'
import { getStudentEvents } from '../../../api/student'
import FilterTabs from '../../../components/FilterTabs'
import SearchBox from '../../../components/SearchBox'
import HackathonListItem from '../../../components/HackathonListItem'
import Pagination from '../../../components/Pagination'
import HackathonSkeleton from '../../../components/HackathonSkeleton'

const ITEMS_PER_PAGE = 6
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Published', label: 'Published' },
  { key: 'Closed', label: 'Closed' },
]
const THEME_COLORS = ['blue', 'emerald', 'violet', 'rose', 'amber', 'teal', 'indigo', 'orange', 'green', 'cyan', 'slate', 'sky']

function getRemainingText(event, now) {
  const start = event.startTime ? new Date(event.startTime) : null
  const end = event.endTime ? new Date(event.endTime) : null
  const target = start && now < start ? start : end

  if (!target || Number.isNaN(target.getTime())) return ''
  if (now >= target) return 'Ended'

  const days = Math.ceil((target - now) / 86400000)
  if (days > 30) {
    const months = Math.ceil(days / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} left`
  }
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}

function normalizeEvent(event) {
  const now = new Date()
  const start = event.startTime ? new Date(event.startTime) : null
  const end = event.endTime ? new Date(event.endTime) : null
  const isOngoing = event.status === 'Published'
    && start && end
    && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
    && now >= start && now < end
  const isEnded = event.status === 'Closed' || (end && !Number.isNaN(end.getTime()) && now >= end)
  const colorIndex = String(event.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % THEME_COLORS.length

  return {
    id: event.id,
    title: event.name,
    shortName: event.name,
    description: event.description || '',
    status: isEnded ? 'closed' : isOngoing ? 'ongoing' : 'published',
    remainingText: getRemainingText(event, now),
    themeColor: THEME_COLORS[colorIndex],
  }
}

export default function HackathonsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const params = { PageIndex: currentPage, PageSize: ITEMS_PER_PAGE }
        if (activeFilter !== 'all') params.Status = activeFilter
        if (searchTerm.trim()) params.Keyword = searchTerm.trim()
        const result = await getStudentEvents(params)
        if (!cancelled) {
          setEvents(result.events || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load hackathons.')
          setEvents([])
          setTotalCount(0)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, searchTerm ? 300 : 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [activeFilter, currentPage, searchTerm])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const isFiltered = activeFilter !== 'all' || searchTerm.trim() !== ''

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const handleSearchChange = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setActiveFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-[38px] font-semibold text-[#1f2f3a] tracking-[-0.5px] leading-tight max-sm:text-[30px]">
            Hackathons
          </h1>
          <p className="mt-1.5 text-[15px] text-[#5a6a73]">
            Discover upcoming and past innovation challenges
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <FilterTabs activeFilter={activeFilter} onChange={handleFilterChange} filters={FILTERS} />
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <HackathonSkeleton key={i} />
            ))
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af] mb-5">
                <Inbox size={28} />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1f2f3a] mb-1">
                No hackathons found
              </h3>
              <p className="text-[14px] text-[#5a6a73] mb-5 text-center max-w-xs">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl border border-[#d8e0e6] bg-white px-5 py-2 text-[14px] font-medium text-[#1f2f3a] hover:bg-[#f4f6f8] transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            events.map((event) => (
              <HackathonListItem key={event.id} hackathon={normalizeEvent(event)} />
            ))
          )}
        </div>

        {!isLoading && events.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
