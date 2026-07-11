import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Hash, Calendar, Play, Flag, Users, CircleCheck, Eye, Layers, ClipboardList, BarChart3 } from 'lucide-react'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import BaseTable from '../../../../components/BaseTable'
import RoundLeaderboardModal from '../../../../components/RoundLeaderboardModal'
import { getLecturerRounds, getLecturerRoundLeaderboard } from '../../../../api/lecturer'
import { formatDateTime } from '../../../../utils/format'

export default function LecturerRoundsSection({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [roundNo, setRoundNo] = useState('')
  const [leaderboardTarget, setLeaderboardTarget] = useState(null)

  const fetchRounds = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (keyword) params.keyword = keyword
      if (roundNo !== '') params.roundNo = Number(roundNo)
      const result = await getLecturerRounds(eventId, params)
      setRounds(result.rounds || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setRounds([])
    } finally {
      setLoading(false)
    }
  }, [eventId, keyword, roundNo])

  useEffect(() => { if (eventId) fetchRounds() }, [fetchRounds, eventId])

  const roundFilters = [
    { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
    { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  ]
  const hasActive = keyword !== '' || roundNo !== ''

  const columns = [
    { key: 'roundNo', header: '#', headerIcon: Hash, render: (row) => <span className="text-[13px] text-[#1f2f3a]">Round {row.roundNo}</span> },
    {
      key: 'name',
      header: 'Round Name',
      headerIcon: Layers,
      render: (row) => (
        <Link to={`/lecture/rounds/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: 'startTime', header: 'Start', headerIcon: Play, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.startTime)}</p> },
    { key: 'endTime', header: 'End', headerIcon: Flag, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.endTime)}</p> },
    { key: 'limitTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.limitTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setLeaderboardTarget(row)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-[13px] font-semibold text-[#7b1fa2] transition-colors hover:bg-[#e1bee7]">
            <BarChart3 className="h-3.5 w-3.5" /> Leaderboard
          </button>
          <Link to={`/lecture/rounds/${row.id}/criteria-templates`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fff3e0] px-3 py-1.5 text-[13px] font-semibold text-[#e65100] transition-colors hover:bg-[#ffe0b2]">
            <ClipboardList className="h-3.5 w-3.5" /> Criteria
          </Link>
          <Link to={`/lecture/rounds/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]">
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds</h3>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <FilterBar
              filters={roundFilters}
              values={{ keyword, roundNo }}
              onChange={(key, val) => {
                if (key === 'keyword') setKeyword(val)
                if (key === 'roundNo') setRoundNo(val)
              }}
              onReset={() => { setKeyword(''); setRoundNo('') }}
              hasActive={hasActive}
            />
          </div>
          <BaseTable
            borderless
            columns={columns}
            data={rounds}
            page={1}
            pageSize={rounds.length || 10}
            total={rounds.length}
            loading={loading}
            emptyText="No rounds configured for this event."
            keyExtractor={(row) => row.id}
            minWidth="700px"
          />
        </div>
      </div>

      <RoundLeaderboardModal
        open={!!leaderboardTarget}
        onClose={() => setLeaderboardTarget(null)}
        roundId={leaderboardTarget?.id}
        roundName={leaderboardTarget?.name}
        fetchLeaderboard={getLecturerRoundLeaderboard}
      />
    </>
  )
}
