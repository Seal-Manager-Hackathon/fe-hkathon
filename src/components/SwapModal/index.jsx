import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { X, Search, AlertCircle, ArrowUpDown } from 'lucide-react'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import { toast, confirm } from '../../utils/toast'

const PAGE_SIZE = 5

const DEFAULT_FILTERS = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search by name...' },
]

/**
 * @param {Object}   filters  - current filter values { keyword, ...extraKeys }
 * @param {number}   page     - current page number
 * @returns {Object} default API query params
 */
function defaultBuildQuery(filters, page) {
  return {
    PageIndex: page,
    PageSize: PAGE_SIZE,
    pageIndex: page,
    pageSize: PAGE_SIZE,
    IsDisable: false,
    ...(filters.keyword ? { Keyword: filters.keyword } : {}),
  }
}

export default function SwapModal({
  open,
  onClose,
  title,
  entityName,
  sourceItem,
  sourceSummary,
  eventId,
  fetchFn,
  swapFn,
  columns,
  filters: customFilters,
  buildQueryParams,
}) {
  const filterConfigs = customFilters || DEFAULT_FILTERS
  const defaultFilterValues = Object.fromEntries(filterConfigs.map((f) => [f.key, '']))

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilterValues)
  const [swappingId, setSwappingId] = useState(null)

  const fetchRef = useRef(fetchFn)
  fetchRef.current = fetchFn
  const buildQueryRef = useRef(buildQueryParams || defaultBuildQuery)
  buildQueryRef.current = buildQueryParams || defaultBuildQuery

  const hasFilter = Object.values(filters).some((v) => v !== '')

  const doFetch = useCallback(async (pg = page, currentFilters = filters) => {
    setLoading(true)
    setError('')
    try {
      const q = buildQueryRef.current(currentFilters, pg)
      const result = await fetchRef.current(eventId, q)
      setItems(result.awards || result.rounds || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load.')
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  // Fetch on open + page/filter changes
  useEffect(() => {
    if (open) doFetch(page, filters)
  }, [open, page, filters, doFetch])

  function handleFilterChange(key, value) {
    setFilters((p) => ({ ...p, [key]: value }))
    setPage(1)
  }

  function handleReset() {
    setFilters(defaultFilterValues)
    setPage(1)
  }

  async function handleSwap(target) {
    const ok = await confirm('Swap ' + entityName, `Swap "${sourceSummary}" with "${target.name || target.title}"? This will exchange their positions.`)
    if (!ok) return
    setSwappingId(target.id)
    try {
      await swapFn(target)
      toast.success('Swapped successfully')
      onClose(true)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to swap.')
      setSwappingId(null)
    }
  }

  const tableColumns = useMemo(
    () => columns({ handleSwap, swappingId }),
    [columns, swappingId]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => onClose(false)} />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[92%] sm:max-w-[860px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <ArrowUpDown className="h-4 w-4 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">{title}</h3>
            <span className="mx-0.5 text-gray-300">·</span>
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#f0f7ff] px-3 py-1 text-[13px] font-semibold text-[#1565c0]">{sourceSummary}</span>
          </div>

          <button
            onClick={() => onClose(false)}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Filter + Error + Table scroll area ── */}
        <div className="flex-1 min-h-0 overflow-auto">
          {/* ── Filter ── */}
          <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-6 py-3 sticky top-0 z-[1]">
            <FilterBar
              filters={filterConfigs}
              values={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              hasActive={hasFilter}
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Table ── */}
          <BaseTable
            borderless
            columns={tableColumns}
            data={items.filter((item) => item.id !== sourceItem?.id)}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            loading={loading}
            serverSide
            emptyText={hasFilter ? 'No ' + entityName.toLowerCase() + 's match.' : 'No ' + entityName.toLowerCase() + 's available.'}
            keyExtractor={(row) => row.id}
            minWidth="520px"
          />
        </div>
      </div>
    </div>
  )
}
