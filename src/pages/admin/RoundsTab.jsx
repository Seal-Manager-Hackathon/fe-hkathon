import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../components/BaseTable'
import { getRounds } from '../../api/admin'
import { roundColumns } from './RoundColumns'

const PAGE_SIZE = 10

export default function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRounds = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const result = await getRounds(eventId, { PageIndex: pageIndex, PageSize: PAGE_SIZE })
      setRounds(result.rounds || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load rounds.')
      setRounds([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, pageIndex])

  useEffect(() => { fetchRounds() }, [fetchRounds])

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Rounds</h3>
        <Link to={`/admin/hackathons/${eventId}/rounds/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">
          + Create Round
        </Link>
      </div>
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <BaseTable columns={roundColumns} data={rounds} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText="No rounds configured for this event." keyExtractor={(row) => row.id} minWidth="700px" />
    </>
  )
}