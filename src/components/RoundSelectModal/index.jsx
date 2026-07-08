import { useState, useEffect, useCallback, useMemo } from 'react'
import { X, Search, AlertCircle, Layers, Check, Hash, Ban, Calendar, Play, Flag, Users, CircleCheck } from 'lucide-react'
import BaseTable from '../BaseTable'
import SearchInput from '../SearchInput'
import SelectInput from '../SelectInput'
import Badge from '../Badge'
import { getRounds } from '../../api/admin'
import { formatDateTime } from '../../utils/format'

// ── Constants ──
const PAGE_SIZE = 8

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban,
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
]

const DEFAULT_FILTER_VALUES = Object.fromEntries(FILTER_DEFS.map((f) => [f.key, '']))

function buildQuery(filters, page) {
  const q = { PageIndex: page, PageSize: PAGE_SIZE }
  if (filters.keyword)        q.Keyword = filters.keyword
  if (filters.roundNo !== '') q.RoundNo = Number(filters.roundNo)
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

function hasActiveFilters(filters) {
  return Object.entries(filters).some(([k, v]) => k === 'isDisable' ? v !== '' : v !== '')
}

// ── Helpers: row selection logic ──
function isRowSelected(row, pendingId, currentId) {
  if (pendingId !== null) return pendingId === row.id
  return currentId === row.id
}

function rowClass(row, pendingId, currentId) {
  return isRowSelected(row, pendingId, currentId)
    ? 'group bg-[#e8f4fd] cursor-pointer'
    : 'group cursor-pointer hover:bg-[#f4f6f8]'
}

// ── Filter bar ──
function ModalFilterBar({ values, onChange, onReset }) {
  return (
    <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-6 py-3.5">
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        {FILTER_DEFS.map((f) => {
          if (f.type === 'search') {
            return (
              <SearchInput
                key={f.key}
                label={f.label}
                icon={f.icon}
                className="w-full sm:w-[220px]"
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
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
                value={values[f.key] || ''}
                onChange={(v) => onChange(f.key, v)}
                className="w-full sm:w-[140px]"
              />
            )
          }
          return null
        })}
        <button type="button" onClick={onReset}
          className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50 hover:text-[#1f2f3a]"
        >
          <RotateCcwIcon />
          Reset
        </button>
      </div>
    </div>
  )
}

function RotateCcwIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 4v6h6M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
  )
}

// ── Header ──
function ModalHeader({ selectedRoundId, onClose }) {
  return (
    <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e3f2fd]">
          <Layers className="h-[18px] w-[18px] text-[#1565c0]" />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[#1f2f3a]">Select Round</h3>
          <p className="text-[13px] text-gray-400">
            {selectedRoundId
              ? 'Click a row to change selection, or press All Rounds to clear.'
              : 'Choose a round to filter submissions.'}
          </p>
        </div>
      </div>
      <button type="button" onClick={onClose}
        className="ml-4 shrink-0 cursor-pointer rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

// ── Footer ──
function ModalFooter({ selectedRoundId, pendingId, items, onSelectAll, onCancel, onConfirm }) {
  const isAllActive = !selectedRoundId && pendingId === null
  const canConfirm = pendingId !== null || !!selectedRoundId

  return (
    <div className="shrink-0 flex items-center justify-between border-t border-[#f0f0f0] px-6 py-4 bg-[#fafbfc]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSelectAll}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition-all ${
            isAllActive
              ? 'border-[#064f5d] bg-[#064f5d] text-white shadow-sm'
              : 'border-[#d8e0e6] bg-white text-[#5c6b7a] hover:border-[#064f5d] hover:text-[#064f5d]'
          }`}
        >
          <Layers className="h-4 w-4" /> All Rounds
        </button>
        <span className="text-[13px] text-gray-400 hidden sm:inline">Show submissions from all rounds</span>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel}
          className="inline-flex cursor-pointer items-center rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={!canConfirm}
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
  )
}

// ── SELECTION INDICATOR ──
function SelectionIndicator({ items, pendingId, currentId }) {
  if (!currentId && pendingId === null) return null

  const selectedItem = pendingId
    ? items.find((r) => r.id === pendingId)
    : items.find((r) => r.id === currentId)

  const label = pendingId
    ? `Selected: ${selectedItem?.name || '...'}`
    : `Current: ${selectedItem?.name || '...'}`

  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#e3f2fd] px-4 py-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#064f5d]">
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </div>
      <span className="text-[13px] font-semibold text-[#064f5d]">{label}</span>
      <span className="text-[12px] text-[#1565c0]">— Click Confirm to apply</span>
    </div>
  )
}

// ── RADIO CELL ──
function RadioCell({ isSelected }) {
  return (
    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ${
      isSelected
        ? 'border-[#064f5d] bg-[#064f5d] shadow-sm'
        : 'border-[#d0d5dd] group-hover:border-[#064f5d]'
    }`}>
      {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </div>
  )
}

// ── MAIN ──
export default function RoundSelectModal({ open, onClose, eventId, selectedRoundId, onSelect }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTER_VALUES)
  const [pendingId, setPendingId] = useState(null)

  // ── Fetch ──
  const doFetch = useCallback(async (pg = page, flt = filters) => {
    setLoading(true); setError('')
    try {
      const result = await getRounds(eventId, buildQuery(flt, pg))
      setItems(result.rounds || [])
      setTotal(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setItems([]); setTotal(0)
    } finally { setLoading(false) }
  }, [eventId])

  useEffect(() => {
    if (open) { setPendingId(null); doFetch(page, filters) }
  }, [open, page, filters, doFetch])

  // ── Filter handlers ──
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_VALUES)
    setPage(1)
  }, [])

  // ── Selection handlers ──
  const toggleRound = useCallback((round) => {
    setPendingId((prev) => prev === round.id ? null : round.id)
  }, [])

  const confirm = useCallback(() => {
    if (pendingId) {
      const selected = items.find((r) => r.id === pendingId)
      onSelect(pendingId, selected?.name || '')
    }
    onClose()
  }, [pendingId, items, onSelect, onClose])

  const selectAll = useCallback(() => {
    onSelect('', '')
    onClose()
  }, [onSelect, onClose])

  // ── Table columns ──
  const columns = useMemo(() => [
    {
      key: 'select', header: '', className: 'w-12',
      render: (row) => <RadioCell isSelected={isRowSelected(row, pendingId, selectedRoundId)} />,
    },
    {
      key: 'roundNo', header: 'Round', headerIcon: Hash,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-600">
          Round {row.roundNo}
        </span>
      ),
    },
    {
      key: 'name', header: 'Round Name', headerIcon: Calendar,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span>,
    },
    {
      key: 'startTime', header: 'Start', headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime', header: 'End', headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'limitTeam', header: 'Teams', headerIcon: Users,
      render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span>,
    },
    {
      key: 'status', header: 'Status', headerIcon: CircleCheck,
      render: (row) => row.isDisable
        ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />,
    },
  ], [pendingId, selectedRoundId])

  if (!open) return null

  const active = hasActiveFilters(filters)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[6vh]">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[960px] flex-col overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <ModalHeader selectedRoundId={selectedRoundId} onClose={onClose} />

        <ModalFilterBar values={filters} onChange={setFilter} onReset={resetFilters} />

        {error && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <SelectionIndicator items={items} pendingId={pendingId} currentId={selectedRoundId} />

        <div className="flex-1 min-h-0 overflow-auto">
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
            emptyText={active ? 'No rounds match the current filters.' : 'No rounds available.'}
            keyExtractor={(row) => row.id}
            minWidth="780px"
            onRowClick={toggleRound}
            rowClassName={(row) => rowClass(row, pendingId, selectedRoundId)}
          />
        </div>

        <ModalFooter
          selectedRoundId={selectedRoundId}
          pendingId={pendingId}
          items={items}
          onSelectAll={selectAll}
          onCancel={onClose}
          onConfirm={confirm}
        />
      </div>
    </div>
  )
}
