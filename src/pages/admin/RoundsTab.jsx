import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../components/BaseTable'
import FilterBar from '../../components/FilterBar'
import { getRounds, getMaxRoundNo, deleteRound, restoreRound, swapRounds } from '../../api/admin'
import { roundColumns } from './RoundColumns'
import { toast } from '../../utils/toast'

const PAGE_SIZE = 10

const DEFAULT_VALUES = { keyword: '', roundNo: '', isDisable: '' }

const roundFilters = [
  { key: 'keyword', label: 'Round Name', type: 'search', placeholder: 'Search round name...' },
  { key: 'roundNo', label: 'Round #', type: 'search', inputType: 'number', placeholder: 'Enter round number' },
  { key: 'isDisable', label: 'Deleted', type: 'select', options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

export default function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxRoundNo, setMaxRoundNo] = useState(null)
  const [swapTarget, setSwapTarget] = useState(null)
  const [swapRoundNo, setSwapRoundNo] = useState('')
  const [swapping, setSwapping] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const fetchRounds = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.roundNo !== '') params.RoundNo = Number(filters.roundNo)
      if (filters.isDisable !== '') params.IsDisable = filters.isDisable === 'true'
      const result = await getRounds(eventId, params)
      setRounds(result.rounds || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setRounds([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchRounds() }, [fetchRounds])

  useEffect(() => {
    getMaxRoundNo(eventId).then(setMaxRoundNo).catch(() => setMaxRoundNo(null))
  }, [eventId])

  const nextRound = maxRoundNo != null ? maxRoundNo + 1 : 1

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  async function handleDelete(round) {
    try {
      await deleteRound(round.id)
      toast.success('Round deleted')
      fetchRounds()
      getMaxRoundNo(eventId).then(setMaxRoundNo).catch(() => setMaxRoundNo(null))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete round.')
    }
  }

  async function handleRestore(round) {
    try {
      await restoreRound(round.id)
      toast.success('Round restored')
      fetchRounds()
      getMaxRoundNo(eventId).then(setMaxRoundNo).catch(() => setMaxRoundNo(null))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore round.')
    }
  }

  function openSwap(round) {
    setSwapTarget(round)
    setSwapRoundNo('')
  }

  async function handleSwap() {
    const target = Number(swapRoundNo)
    if (!target || !swapTarget) return
    setSwapping(true)
    try {
      await swapRounds(eventId, swapTarget.id, target)
      toast.success('Rounds swapped successfully')
      setSwapTarget(null)
      fetchRounds()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to swap rounds.')
    } finally {
      setSwapping(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds</h3>
        <Link to={`/admin/hackathons/${eventId}/rounds/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">
          + Create Round #{nextRound}
        </Link>
      </div>

      <FilterBar filters={roundFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <BaseTable columns={roundColumns(openSwap, handleDelete, handleRestore)} data={rounds} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No rounds match the current filters.' : 'No rounds configured for this event.'} keyExtractor={(row) => row.id} minWidth="780px" />

      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSwapTarget(null)} />
          <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-xl border border-[#e8ecf0] bg-white shadow-2xl">
            <div className="border-b border-[#f0f0f0] px-6 py-4">
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">Swap Round #{swapTarget.roundNo}</h3>
              <p className="mt-0.5 text-[13px] text-gray-400">{swapTarget.name}</p>
            </div>
            <div className="px-6 py-5">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">Swap with Round #</label>
              <select value={swapRoundNo} onChange={(e) => setSwapRoundNo(e.target.value)} className="field-input">
                <option value="">Select a round...</option>
                {rounds.filter((r) => !r.isDisable && r.id !== swapTarget.id).map((r) => (
                  <option key={r.id} value={r.roundNo}>Round {r.roundNo} — {r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[#f0f0f0] px-6 py-4">
              <button onClick={() => setSwapTarget(null)} className="cursor-pointer rounded-lg border border-[#d8e0e6] bg-white px-4 py-2 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50">Cancel</button>
              <button onClick={handleSwap} disabled={!swapRoundNo || swapping} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1565c0] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:cursor-not-allowed disabled:opacity-50">
                {swapping ? 'Swapping...' : 'Swap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
