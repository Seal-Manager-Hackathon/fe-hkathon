import { useState, useEffect, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'
import BaseTable from '../BaseTable'
import { getRounds } from '../../api/admin'
import { PAGE_SIZE, DEFAULT_FILTER_VALUES, buildQuery, hasActiveFilters, rowClass } from './helpers'
import ModalHeader from './ModalHeader'
import ModalFilterBar from './ModalFilterBar'
import ModalFooter from './ModalFooter'
import SelectionIndicator from './SelectionIndicator'
import useRoundColumns from './RoundColumns'

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
  const columns = useRoundColumns(pendingId, selectedRoundId)

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
