import { useState, useEffect, useCallback } from 'react'
import { X, AlertCircle, Layers, Check } from 'lucide-react'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import RadioCell from './RadioCell'

const PAGE_SIZE = 5

export { PAGE_SIZE }

/**
 * Generic table-based selection modal.
 *
 * @param {boolean}  open
 * @param {function} onClose
 * @param {string}   title        - modal title
 * @param {string}   entityName   - used in emptyText/All button (e.g. "Rounds", "Tracks")
 * @param {string}   selectedId   - currently selected ID from parent
 * @param {string}   selectedName - currently selected name from parent
 * @param {function} onSelect     - (id: string, name: string) => void
 * @param {function} fetchFn      - (filters: object, page: number) => Promise<{ items: Array, totalCount: number }>
 * @param {Array}    columns      - column definitions (useMemo from parent)
 * @param {Array}    filterConfigs - [{ type, key, label, ... }]
 * @param {object}   defaultFilterValues - { key: '' }
 * @param {function} buildQuery   - (filters, page) => query params for API
 * @param {function} getName      - (row) => string - extracts display name from a row
 * @param {string}   allLabel     - label for "All" button (default: "All {entityName}")
 */
export default function TableSelectModal({
  open,
  onClose,
  title,
  entityName = 'items',
  selectedId,
  selectedName,
  onSelect,
  fetchFn,
  columns,
  filterConfigs = [],
  defaultFilterValues = {},
  buildQuery,
  getName = (row) => row.name || row.title || '',
  allLabel,
}) {
  const allText = allLabel || `All ${entityName}`

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilterValues)
  const [pendingId, setPendingId] = useState(null)

  const hasActive = Object.values(filters).some((v) => v !== '')

  // ── Fetch ──
  const doFetch = useCallback(async (pg = page, flt = filters) => {
    setLoading(true)
    setError('')
    try {
      const q = buildQuery(flt, pg)
      const result = await fetchFn(q)
      setItems(result.items || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to load ${entityName.toLowerCase()}.`)
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, buildQuery])

  useEffect(() => {
    if (open) {
      setPendingId(null)
      doFetch(page, filters)
    }
  }, [open, page, filters, doFetch])

  // ── Filter handlers ──
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterValues)
    setPage(1)
  }, [defaultFilterValues])

  // ── Row selection ──
  const toggleRow = useCallback((row) => {
    setPendingId((prev) => prev === row.id ? null : row.id)
  }, [])

  const confirm = useCallback(() => {
    if (pendingId) {
      const selected = items.find((r) => r.id === pendingId)
      onSelect(pendingId, selected ? getName(selected) : '')
    }
    onClose()
  }, [pendingId, items, onSelect, onClose, getName])

  const selectAll = useCallback(() => {
    onSelect('', '')
    onClose()
  }, [onSelect, onClose])

  // ── Augment columns with radio cell ──
  const displayColumns = [
    {
      key: '_select',
      header: '',
      className: 'w-12',
      render: (row) => (
        <RadioCell
          isSelected={
            pendingId !== null ? pendingId === row.id : selectedId === row.id
          }
        />
      ),
    },
    ...columns,
  ]

  const isRowActive = (row) =>
    pendingId !== null ? pendingId === row.id : selectedId === row.id

  const canConfirm = pendingId !== null || !!selectedId
  const isAllActive = !selectedId && pendingId === null

  // ── Selection indicator ──
  const selectedItem = pendingId
    ? items.find((r) => r.id === pendingId)
    : items.find((r) => r.id === selectedId)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e3f2fd]">
              <Layers className="h-[18px] w-[18px] text-[#1565c0]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">{title}</h3>
              <p className="text-[13px] text-gray-400">
                {selectedId
                  ? 'Click a row to change selection, or press All button to clear.'
                  : `Choose ${entityName.toLowerCase()} to filter submissions.`}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Filter bar ── */}
        {filterConfigs.length > 0 && (
          <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-6 py-3.5">
            <FilterBar
              filters={filterConfigs}
              values={filters}
              onChange={setFilter}
              onReset={resetFilters}
              hasActive={hasActive}
            />
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Selection indicator ── */}
        {selectedItem && (
          <div className="flex items-center gap-2 rounded-lg bg-[#e3f2fd] px-4 py-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#064f5d]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-[13px] font-semibold text-[#064f5d]">
              {pendingId ? `Selected: ${getName(selectedItem)}` : `Current: ${getName(selectedItem)}`}
            </span>
            <span className="text-[12px] text-[#1565c0]">— Click Confirm to apply</span>
          </div>
        )}

        {/* ── Table scroll area ── */}
        <div className="flex-1 min-h-0 overflow-auto">
          <BaseTable
            borderless
            columns={displayColumns}
            data={items}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            loading={loading}
            serverSide
            emptyText={hasActive ? `No ${entityName.toLowerCase()} match the current filters.` : `No ${entityName.toLowerCase()} available.`}
            keyExtractor={(row) => row.id}
            minWidth="780px"
            onRowClick={toggleRow}
            rowClassName={(row) =>
              isRowActive(row)
                ? 'group bg-[#e8f4fd] cursor-pointer'
                : 'group cursor-pointer hover:bg-[#f4f6f8]'
            }
          />
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex items-center justify-between border-t border-[#f0f0f0] px-6 py-4 bg-[#fafbfc]">
          <div className="flex items-center gap-3">
            <button type="button" onClick={selectAll}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition-all ${
                isAllActive
                  ? 'border-[#064f5d] bg-[#064f5d] text-white shadow-sm'
                  : 'border-[#d8e0e6] bg-white text-[#5c6b7a] hover:border-[#064f5d] hover:text-[#064f5d]'
              }`}
            >
              <Layers className="h-4 w-4" /> {allText}
            </button>
            <span className="text-[13px] text-gray-400 hidden sm:inline">
              Show submissions from all {entityName.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose}
              className="inline-flex cursor-pointer items-center rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="button" onClick={confirm} disabled={!canConfirm}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-all ${
                canConfirm
                  ? 'bg-[#064f5d] text-white hover:bg-[#05404a] shadow-sm'
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              <Check className="h-4 w-4" /> Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
