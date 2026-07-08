import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import { getAwards, deleteAward, restoreAward, swapAward } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import { Search, Trash2, Trophy, Hash, DollarSign, Calendar, Plus, Edit, RotateCcw, MoreHorizontal, CircleCheck, Eye, ArrowUpDown } from 'lucide-react'
import { toast, confirm } from '../../../../utils/toast'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', isDisable: '' }

const actionBtnClass = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const dangerBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'
const restoreBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'
const swapBtnClass = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#bbdefb]'

const awardFilters = [
  { type: 'search', key: 'keyword', label: 'Name', icon: Search, placeholder: 'Search award name...' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Trash2, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

function awardColumns(eventId, onSwap, onDelete, onRestore) {
  return [
    {
      key: 'name',
      header: 'Award Name',
      headerIcon: Trophy,
      render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.name}</span>,
    },
    {
      key: 'levelAward',
      header: 'Level',
      headerIcon: Hash,
      render: (row) => {
        const ordinals = { 1: '1st', 2: '2nd', 3: '3rd' }
        const label = ordinals[row.levelAward] || `${row.levelAward}th`
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f2fd] px-2.5 py-0.5 text-[12px] font-semibold text-[#1565c0]">
            <Trophy className="h-3 w-3" />
            {label} Place
          </span>
        )
      },
    },
    {
      key: 'numberOfAward',
      header: 'Quantity',
      headerIcon: Hash,
      render: (row) => <span className="text-[13px] font-semibold text-slate-600">{row.numberOfAward}</span>,
    },
    {
      key: 'prize',
      header: 'Prize',
      headerIcon: DollarSign,
      render: (row) => {
        const usd = Number(row.prize || 0)
        return <span className="text-[13px] font-semibold text-emerald-600">${usd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
      },
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => (
        <Badge label={row.isDisable ? 'Deleted' : 'Active'} className={row.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {!row.isDisable && (
            <button onClick={() => onSwap(row)} className={swapBtnClass}><ArrowUpDown className="h-3.5 w-3.5" />Swap</button>
          )}
          <Link to={`/admin/hackathons/${eventId}/awards/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] hover:bg-[#e8e8e8]"><Eye className="h-3.5 w-3.5" />View</Link>
          {!row.isDisable && (
            <Link to={`/admin/hackathons/${eventId}/awards/${row.id}/edit`} className={actionBtnClass}>
              <Edit className="h-3.5 w-3.5" /> Edit
            </Link>
          )}
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]
}

export default function AwardsTab({ eventId }) {
  const [awards, setAwards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const [swapTarget, setSwapTarget] = useState(null)
  const [swapLevel, setSwapLevel] = useState('')
  const [swapping, setSwapping] = useState(false)

  const fetchAwards = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { pageIndex, pageSize: PAGE_SIZE }
      if (filters.keyword) params.keyword = filters.keyword
      if (filters.isDisable !== '') params.isDisable = filters.isDisable === 'true'
      const result = await getAwards(eventId, params)
      setAwards(result.awards || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load awards.')
      setAwards([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchAwards() }, [fetchAwards])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  function openSwap(award) {
    setSwapTarget(award)
    setSwapLevel('')
  }

  async function handleSwap() {
    if (!swapTarget || !swapLevel) return
    setSwapping(true)
    try {
      await swapAward(eventId, swapTarget.id, Number(swapLevel))
      toast.success('Awards swapped')
      setSwapTarget(null)
      fetchAwards()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to swap awards.')
    } finally {
      setSwapping(false)
    }
  }

  async function handleDelete(award) {
    const ok = await confirm('Delete Award', `Are you sure you want to delete "${award.name}"?`)
    if (!ok) return
    try {
      await deleteAward(eventId, award.id)
      toast.success('Award deleted')
      fetchAwards()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete award.')
    }
  }

  async function handleRestore(award) {
    const ok = await confirm('Restore Award', `Are you sure you want to restore "${award.name}"?`)
    if (!ok) return
    try {
      await restoreAward(eventId, award.id)
      toast.success('Award restored')
      fetchAwards()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore award.')
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Awards</h3>
        <Link to={`/admin/hackathons/${eventId}/awards/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">
          <Plus className="h-3.5 w-3.5" />Create Award
        </Link>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar filters={awardFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
        </div>
        <BaseTable
          borderless
          columns={awardColumns(eventId, openSwap, handleDelete, handleRestore)}
          data={awards}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText={hasActive ? 'No awards match the current filters.' : 'No awards configured for this event.'}
          keyExtractor={(row) => row.id}
          minWidth="950px"
        />
      </div>

      {swapTarget && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/30" onClick={() => !swapping && setSwapTarget(null)} />
          <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-xl border border-[#e8ecf0] bg-white shadow-2xl">
            <div className="border-b border-[#f0f0f0] px-6 py-4">
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">Swap Award</h3>
              <p className="mt-0.5 text-[13px] text-gray-400">
                {swapTarget.name} — currently at <span className="font-semibold text-[#1565c0]">{swapTarget.levelAward}</span>
              </p>
            </div>
            <div className="px-6 py-5">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">Swap with Level #</label>
              <select value={swapLevel} onChange={(e) => setSwapLevel(e.target.value)} className="field-input">
                <option value="">Select a level...</option>
                {(() => {
                  const ordinals = { 1: '1st', 2: '2nd', 3: '3rd' }
                  return awards.filter((a) => !a.isDisable && a.id !== swapTarget.id).map((a) => {
                    const label = ordinals[a.levelAward] || `${a.levelAward}th`
                    return <option key={a.id} value={a.levelAward}>{label} Place</option>
                  })
                })()}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-[#f0f0f0] px-6 py-4">
              <button onClick={() => setSwapTarget(null)} disabled={swapping} className="cursor-pointer rounded-lg border border-[#d8e0e6] bg-white px-4 py-2 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50">Cancel</button>
              <button onClick={handleSwap} disabled={!swapLevel || swapping} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#1565c0] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:cursor-not-allowed disabled:opacity-50">
                {swapping ? 'Swapping...' : 'Swap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
