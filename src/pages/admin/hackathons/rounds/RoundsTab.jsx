import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import SwapModal from '../../../../components/SwapModal'
import NextRoundModal from '../../../../components/NextRoundModal'
import RoundLeaderboardModal from '../../../../components/RoundLeaderboardModal'
import { getRounds, getMaxRoundNo, deleteRound, restoreRound, swapRounds, getEventRegisterTeams, assignRegisterTeamToNextRound, revertRegisterTeamToPreviousRound, getRoundLeaderboard } from '../../../../api/admin'
import { roundColumns } from './RoundColumns'
import { toast, confirm } from '../../../../utils/toast'
import { Search, Hash, Ban, ArrowUpDown } from 'lucide-react'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', roundNo: '', isDisable: '' }

const roundFilters = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

const roundSwapFilters = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

function buildRoundSwapQuery(filters, page) {
  const q = { PageIndex: page, PageSize: 8, pageIndex: page, pageSize: 8 }
  if (filters.keyword) q.Keyword = filters.keyword
  if (filters.roundNo !== '') q.RoundNo = Number(filters.roundNo)
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  else q.IsDisable = false
  return q
}

export default function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxRoundNo, setMaxRoundNo] = useState(null)
  const [swapSource, setSwapSource] = useState(null)
  const [nextRoundTarget, setNextRoundTarget] = useState(null)
  const [leaderboardTarget, setLeaderboardTarget] = useState(null)
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
      setRounds(result.rounds || []); setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setRounds([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchRounds() }, [fetchRounds])
  useEffect(() => { getMaxRoundNo(eventId).then(setMaxRoundNo).catch(() => setMaxRoundNo(null)) }, [eventId])

  const nextRound = maxRoundNo != null ? maxRoundNo + 1 : 1

  function handleFilterChange(key, value) { setFilters((p) => ({ ...p, [key]: value })); setPageIndex(1) }
  function handleReset() { setFilters(DEFAULT_VALUES); setPageIndex(1) }

  async function handleDelete(round) {
    const ok = await confirm('Delete Round', `Delete round #${round.roundNo} "${round.name}"?`)
    if (!ok) return
    try { await deleteRound(round.id); toast.success('Round deleted'); fetchRounds(); getMaxRoundNo(eventId).then(setMaxRoundNo) }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete round.') }
  }

  async function handleRestore(round) {
    const ok = await confirm('Restore Round', `Restore round #${round.roundNo} "${round.name}"?`)
    if (!ok) return
    try { await restoreRound(round.id); toast.success('Round restored'); fetchRounds(); getMaxRoundNo(eventId).then(setMaxRoundNo) }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to restore round.') }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds</h3>
        <Link to={`/admin/hackathons/${eventId}/rounds/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">+ Create Round #{nextRound}</Link>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar filters={roundFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
        </div>
        <BaseTable
          borderless
          columns={roundColumns(eventId, setSwapSource, handleDelete, handleRestore, setNextRoundTarget, setLeaderboardTarget)}
          data={rounds}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText={hasActive ? 'No rounds match the current filters.' : 'No rounds configured for this event.'}
          keyExtractor={(row) => row.id}
          minWidth="780px"
        />
      </div>

      <SwapModal
        open={!!swapSource}
        onClose={(swapped) => { setSwapSource(null); if (swapped) fetchRounds() }}
        title="Swap Round Position"
        entityName="Round"
        sourceItem={swapSource}
        sourceSummary={`Round #${swapSource?.roundNo} — ${swapSource?.name || ''}`}
        eventId={eventId}
        fetchFn={getRounds}
        swapFn={(target) => swapRounds(eventId, swapSource.id, target.roundNo)}
        filters={roundSwapFilters}
        buildQueryParams={buildRoundSwapQuery}
        columns={({ handleSwap, swappingId }) => [
          {
            key: 'roundNo',
            header: '#',
            headerIcon: Hash,
            render: (row) => (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[12px] font-semibold text-gray-500">
                Round {row.roundNo}
              </span>
            ),
          },
          {
            key: 'name',
            header: 'Round Name',
            render: (row) => (
              <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span>
            ),
          },
          {
            key: 'action',
            header: 'Action',
            headerIcon: ArrowUpDown,
            headerClassName: 'w-[110px] text-right',
            className: 'text-right',
            render: (row) => {
              const isThis = swappingId === row.id
              return (
                <button
                  onClick={() => handleSwap(row)}
                  disabled={!!swappingId}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                    isThis
                      ? 'bg-[#1565c0] text-white opacity-70'
                      : 'bg-[#1565c0] text-white hover:bg-[#0d47a1] active:scale-95'
                  } disabled:opacity-50`}
                >
                  {isThis ? 'Swapping...' : 'Swap'}
                </button>
              )
            },
          },
        ]}
      />

      <NextRoundModal
        open={!!nextRoundTarget}
        onClose={() => setNextRoundTarget(null)}
        eventId={eventId}
        roundId={nextRoundTarget?.id}
        roundName={nextRoundTarget?.name}
        roundNo={nextRoundTarget?.roundNo}
        routePrefix="/admin"
        fetchTeams={getEventRegisterTeams}
        onAdvance={assignRegisterTeamToNextRound}
        onRevert={revertRegisterTeamToPreviousRound}
      />

      <RoundLeaderboardModal
        open={!!leaderboardTarget}
        onClose={() => setLeaderboardTarget(null)}
        roundId={leaderboardTarget?.id}
        roundName={leaderboardTarget?.name}
        fetchLeaderboard={getRoundLeaderboard}
      />
    </>
  )
}
