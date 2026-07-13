import { useEffect, useState } from 'react'
import { CalendarDays, ChevronDown, Inbox, ListFilter, RotateCcw } from 'lucide-react'
import { getStudentEvents } from '../../../api/student'
import FilterTabs from '../../../components/FilterTabs'
import SearchBox from '../../../components/SearchBox'
import DateInput from '../../../components/DateInput'
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
const ERROR_MESSAGES = {
  'Invalid Status. Must be: Draft, Published, Closed': 'Trạng thái không hợp lệ',
  'Page Index Must Be Greater Than 0': 'Trang không hợp lệ',
  'Page Size Must Be Between 1 And 100': 'Kích thước trang không hợp lệ',
}

function normalizeEvent(event) {
  const colorIndex = String(event.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % THEME_COLORS.length

  return {
    id: event.id,
    title: event.name,
    shortName: event.name,
    status: event.status,
    themeColor: THEME_COLORS[colorIndex],
  }
}

function toApiDate(date, endOfDay = false) {
  if (!date) return ''
  return `${date}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`
}

function getErrorMessage(error) {
  const message = error?.response?.data?.message
  return ERROR_MESSAGES[message] || message || 'Không thể tải danh sách hackathon.'
}

export default function HackathonsPage() {
  const [activeFilter, setActiveFilter] = useState('Published')
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isForbidden, setIsForbidden] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const params = { PageIndex: currentPage, PageSize: ITEMS_PER_PAGE }
        if (activeFilter !== 'all') params.Status = activeFilter
        if (searchTerm.trim()) params.Keyword = searchTerm.trim()
        if (fromDate) params.FromDate = toApiDate(fromDate)
        if (toDate) params.ToDate = toApiDate(toDate, true)

        const result = await getStudentEvents(params)
        if (!cancelled) {
          setEvents(result.events || [])
          setTotalCount(result.totalCount || 0)
          setIsForbidden(false)
        }
      } catch (requestError) {
        if (!cancelled) {
          const forbidden = requestError?.response?.status === 403
          setIsForbidden(forbidden)
          setError(forbidden ? '' : getErrorMessage(requestError))
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
  }, [activeFilter, currentPage, fromDate, searchTerm, toDate])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const isFiltered = activeFilter !== 'all' || searchTerm.trim() !== '' || fromDate !== '' || toDate !== ''

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setActiveFilter('Published')
    setSearchTerm('')
    setFromDate('')
    setToDate('')
    setCurrentPage(1)
  }

  if (isForbidden) return null

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

        <div className="mb-5 flex items-center gap-3">
          <div className="min-w-0 flex-1 [&>div]:max-w-none">
            <SearchBox value={searchTerm} onChange={(value) => updateFilter(setSearchTerm, value)} />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((visible) => !visible)}
            aria-expanded={showFilters}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d8e0e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f2f3a] shadow-[0_1px_3px_rgba(31,47,58,0.05)] transition-colors hover:border-[#064f5d]/40 hover:text-[#064f5d]"
          >
            <ListFilter size={17} />
            Filter
            <ChevronDown size={15} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-5 rounded-2xl border border-[#d8e0e6] bg-white p-4 shadow-[0_2px_12px_rgba(31,47,58,0.04)] sm:p-5">
            <div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7a8991]">Status</p>
                <FilterTabs
                  activeFilter={activeFilter}
                  onChange={(value) => updateFilter(setActiveFilter, value)}
                  filters={FILTERS}
                />
              </div>

              <div className="my-4 h-px bg-[#e8edf1]" />

              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7a8991]">
                  <CalendarDays size={14} className="text-[#064f5d]" />
                  Date range
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <DateInput
                    label="From"
                    value={fromDate}
                    onChange={(event) => updateFilter(setFromDate, event.target.value)}
                    className="w-full"
                  />
                  <DateInput
                    label="To"
                    value={toDate}
                    onChange={(event) => updateFilter(setToDate, event.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {isFiltered && (
              <div className="mt-4 flex justify-end border-t border-[#e8edf1] pt-4">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5a6a73] transition-colors hover:text-[#064f5d]"
                >
                  <RotateCcw size={14} />
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        <main>
            {error && (
              <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => <HackathonSkeleton key={index} />)
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af]">
                    <Inbox size={28} />
                  </div>
                  <h3 className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">No hackathons found</h3>
                  <p className="mb-5 max-w-xs text-center text-[14px] text-[#5a6a73]">
                    Try adjusting your search or filter to find what you&apos;re looking for.
                  </p>
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="rounded-xl border border-[#d8e0e6] bg-white px-5 py-2 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-[#f4f6f8]"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                events.map((event) => <HackathonListItem key={event.id} hackathon={normalizeEvent(event)} />)
              )}
            </div>

            {!isLoading && events.length > 0 && totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </main>
      </div>
    </div>
  )
}
