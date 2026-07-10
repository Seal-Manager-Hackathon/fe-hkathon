import { useState, useEffect, useCallback } from 'react'
import { Search, Ban } from 'lucide-react'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import { getTracks } from '../../../../api/staff'
import { trackColumns } from './TrackColumns'

const PAGE_SIZE = 10

const DEFAULT_VALUES = { keyword: '', isDisable: '' }

const trackFilters = [
  { type: 'search', key: 'keyword', label: 'Track Name', icon: Search, placeholder: 'Search track name...' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

export default function TracksTab({ eventId }) {
  const [tracks, setTracks] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const fetchTracks = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.isDisable !== '') params.IsDisable = filters.isDisable === 'true'
      const result = await getTracks(eventId, params)
      setTracks(result.items || result.tracks || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tracks.')
      setTracks([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, pageIndex, filters])

  useEffect(() => { fetchTracks() }, [fetchTracks])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Tracks</h3>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar filters={trackFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
        </div>
        <BaseTable borderless columns={trackColumns()} data={tracks} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No tracks match the current filters.' : 'No tracks configured for this event.'} keyExtractor={(row) => row.id} minWidth="700px" />
      </div>
    </>
  )
}
