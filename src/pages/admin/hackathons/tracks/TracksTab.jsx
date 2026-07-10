import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import { getTracks, deleteTrack, restoreTrack } from '../../../../api/admin'
import { trackColumns } from './TrackColumns'
import { toast, confirm } from '../../../../utils/toast'

const PAGE_SIZE = 10

const DEFAULT_VALUES = { keyword: '', isDisable: '' }

import { Search, Ban } from 'lucide-react'

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
      setTracks(result.tracks || [])
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

  async function handleDelete(track) {
    const ok = await confirm('Delete Track', `Are you sure you want to delete "${track.name}"?`)
    if (!ok) return
    try {
      await deleteTrack(track.id)
      toast.success('Track deleted')
      fetchTracks()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete track.')
    }
  }

  async function handleRestore(track) {
    const ok = await confirm('Restore Track', `Are you sure you want to restore "${track.name}"?`)
    if (!ok) return
    try {
      await restoreTrack(track.id)
      toast.success('Track restored')
      fetchTracks()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore track.')
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">Tracks</h3>
        <Link to={`/admin/tracks/create`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]">
          + Create Track
        </Link>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar filters={trackFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
        </div>
        <BaseTable borderless columns={trackColumns(handleDelete, handleRestore)} data={tracks} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No tracks match the current filters.' : 'No tracks configured for this event.'} keyExtractor={(row) => row.id} minWidth="700px" />
      </div>
    </>
  )
}
