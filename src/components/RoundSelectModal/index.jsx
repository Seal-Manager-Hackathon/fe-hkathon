import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, Search, AlertCircle, Layers, Check, Hash, Ban, Calendar, Play, Flag, Users, CircleCheck } from 'lucide-react'
import BaseTable from '../BaseTable'
import SearchInput from '../SearchInput'
import SelectInput from '../SelectInput'
import Badge from '../Badge'
import { getRounds } from '../../api/admin'
import { formatDateTime } from '../../utils/format'

const PAGE_SIZE = 8

const DEFAULT_FILTERS = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

function buildQuery(filters, page) {
  const q = { PageIndex: page, PageSize: PAGE_SIZE }
  if (filters.keyword) q.Keyword = filters.keyword
  if (filters.roundNo !== '') q.RoundNo = Number(filters.roundNo)
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

export default function RoundSelectModal({
  open,
  onClose,
  eventId,
  selectedRoundId,
  onSelect,
}) {
  const defaultFilterValues = Object.fromEntries(DEFAULT_FILTERS.map((f) => [f.key, '']))

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilterValues)
  const [pendingSelection, setPendingSelection] = useState(null)

  const hasActive = Object.entries(filters).some(([k, v]) => {
    if (k === 'isDisable') return v !== '' && v !== 'false'
    return v !== ''
  })

  const doFetch = useCallback(async (pg = page, currentFilters = filters) => {
    setLoading(true)
    setError('')
    try {
      const q = buildQuery(currentFilters, pg)
      const result = await getRounds(eventId, q)
      setItems(result.rounds || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    if (open) {
      setPendingSelection(null)
      doFetch(page, filters)
    }
  }, [open, page, filters, doFetch])

  function handleFilterChange(key, value) {
    setFilters((p) => ({ ...p, [key]: value }))
    setPage(1)
  }

  function handleReset() {
    setFilters(defaultFilterValues)
    setPage(1)
  }

  function handleSelectRound(round) {
    // Toggle selection
    if (pendingSelection === round.id) {
      setPendingSelection(null)
      return
    }
    setPendingSelection(round.id)
  }

  function handleConfirm() {
    if (pendingSelection) {
      const selected = items.find(r => r.id === pendingSelection)
      onSelect(pendingSelection, selected?.name || '')
    }
    onClose()
  }

  function handleSelectAll() {
    onSelect('', '')
    onClose()
  }

  const columns = useMemo(() => [
    {
      key: 'select',
      header: '',
      className: 'w-12',
      render: (row) => {
        const isPending = pendingSelection === row.id
        const isCurrent = pendingSelection === null && selectedRoundId === row.id
        const isSelected = isPending || isCurrent
        return (
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
              isSelected
                ? 'border-[#064f5d] bg-[#064f5d] shadow-sm'
                : 'border-[#d0d5dd] group-hover:border-[#064f5d]'
            }`}
          >
            {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </div>
        )
      },
    },
    {
      key: 'roundNo',
      header: 'Round',
      headerIcon: Hash,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-600">
          Round {row.roundNo}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Round Name',
      headerIcon: Calendar,
      render: (row) => (
        <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span>
      ),
    },
    {
      key: 'startTime',
      header: 'Start',
      headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime',
      header: 'End',
      headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'limitTeam',
      header: 'Teams',
      headerIcon: Users,
      render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) =>
        row.isDisable ? (
          <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        ) : (
          <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
        ),
    },
  ], [pendingSelection, selectedRoundId])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => onClose()} />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e3f2fd]">
              <Layers className="h-[18px] w-[18px] text-[#1565c0]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">Select Round</h3>
              <p className="text-[13px] text-gray-400">
                {selectedRoundId ? 'Click a row to change selection, or press All Rounds to clear.' : 'Choose a round to filter submissions.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onClose()}
            className="ml-4 shrink-0 cursor-pointer rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Filter ── */}
        <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-6 py-3.5">
          <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
            {DEFAULT_FILTERS.map((f) => {
              if (f.type === 'search') {
                return (
                  <SearchInput
                    key={f.key}
                    label={f.label}
                    icon={f.icon}
                    className="w-full sm:w-[220px]"
                    placeholder={f.placeholder}
                    value={filters[f.key] || ''}
                    onChange={(e) => handleFilterChange(f.key, e.target.value)}
                    type={f.inputType || 'text'}
                  />
                )
              }
              if (f.type === 'select') {
                return (
                  <SelectInput
                    key={f.key}
                    label={f.label}
                    icon={f.icon}
                    options={f.options}
                    value={filters[f.key] || ''}
                    onChange={(v) => handleFilterChange(f.key, v)}
                    className="w-full sm:w-[140px]"
                  />
                )
              }
              return null
            })}
            <button
              onClick={handleReset}
              className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50 hover:text-[#1f2f3a]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
              Reset
            </button>
          </div>

          {/* Active round selection indicator */}
          {(selectedRoundId || pendingSelection) && (
            <div className="flex items-center gap-2 rounded-lg bg-[#e3f2fd] px-4 py-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#064f5d]">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[13px] font-semibold text-[#064f5d]">
                {pendingSelection
                  ? `Selected: ${items.find(r => r.id === pendingSelection)?.name || '...'}`
                  : selectedRoundId
                    ? `Current: ${items.find(r => r.id === selectedRoundId)?.name || '...'}`
                    : null
                }
              </span>
              <span className="text-[12px] text-[#1565c0]">— Click Confirm to apply</span>
            </div>
          )}
        </div>

        {/* ── Error + Table scroll area ── */}
        <div className="flex-1 min-h-0 overflow-auto">
          {error && (
            <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <BaseTable
            borderless
            columns={columns}
            data={items}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            loading={loading}
            serverSide
            emptyText={hasActive ? 'No rounds match the current filters.' : 'No active rounds available.'}
            keyExtractor={(row) => row.id}
            minWidth="780px"
            onRowClick={(row) => handleSelectRound(row)}
            rowClassName={(row) => {
              const isPending = pendingSelection === row.id
              const isCurrent = pendingSelection === null && selectedRoundId === row.id
              const isSelected = isPending || isCurrent
              return isSelected
                ? 'group bg-[#e8f4fd] cursor-pointer'
                : 'group cursor-pointer hover:bg-[#f4f6f8]'
            }}
          />
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 flex items-center justify-between border-t border-[#f0f0f0] px-6 py-4 bg-[#fafbfc]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition-all ${
                !selectedRoundId && pendingSelection === null
                  ? 'border-[#064f5d] bg-[#064f5d] text-white shadow-sm'
                  : 'border-[#d8e0e6] bg-white text-[#5c6b7a] hover:border-[#064f5d] hover:text-[#064f5d]'
              }`}
            >
              <Layers className="h-4 w-4" />
              All Rounds
            </button>
            <span className="text-[13px] text-gray-400 hidden sm:inline">
              Show submissions from all rounds
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onClose()}
              className="inline-flex cursor-pointer items-center rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!pendingSelection && !selectedRoundId}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-all ${
                pendingSelection || selectedRoundId
                  ? 'bg-[#064f5d] text-white hover:bg-[#05404a] shadow-sm'
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              <Check className="h-4 w-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
