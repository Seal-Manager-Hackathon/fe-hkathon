import { useState, useEffect, useCallback } from 'react'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import NextRoundModal from '../../../../components/NextRoundModal'
import RoundLeaderboardModal from '../../../../components/RoundLeaderboardModal'
import { getRounds, getEventRegisterTeams, assignRegisterTeamToNextRound, revertRegisterTeamToPreviousRound, getRoundLeaderboard } from '../../../../api/staff'
import { roundColumns } from './RoundColumns'
import { Search, Hash, Ban } from 'lucide-react'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', roundNo: '', isDisable: '' }

const roundFilters = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

export default function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  function handleFilterChange(key, value) { setFilters((p) => ({ ...p, [key]: value })); setPageIndex(1) }
  function handleReset() { setFilters(DEFAULT_VALUES); setPageIndex(1) }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds</h3>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar filters={roundFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
        </div>
        <BaseTable
          borderless
          columns={roundColumns(setNextRoundTarget, setLeaderboardTarget)}
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

      <RoundLeaderboardModal
        open={!!leaderboardTarget}
        onClose={() => setLeaderboardTarget(null)}
        roundId={leaderboardTarget?.id}
        roundName={leaderboardTarget?.name}
        fetchLeaderboard={getRoundLeaderboard}
      />

      <NextRoundModal
        open={!!nextRoundTarget}
        onClose={() => setNextRoundTarget(null)}
        eventId={eventId}
        roundId={nextRoundTarget?.id}
        roundName={nextRoundTarget?.name}
        roundNo={nextRoundTarget?.roundNo}
        routePrefix="/staff"
        fetchTeams={getEventRegisterTeams}
        onAdvance={assignRegisterTeamToNextRound}
        onRevert={revertRegisterTeamToPreviousRound}
      />
    </>
  )
}
