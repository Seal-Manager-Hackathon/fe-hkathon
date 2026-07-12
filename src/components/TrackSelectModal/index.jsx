import { useMemo, useCallback } from 'react'
import { Search, Users, CircleCheck, Ban } from 'lucide-react'
import Badge from '../Badge'
import TableSelectModal from '../TableSelectModal'

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Track Name', icon: Search, placeholder: 'Search track name...' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban,
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
]

const DEFAULT_FILTER_VALUES = { keyword: '', isDisable: '' }

function buildQuery(filters, page) {
  const q = { PageIndex: page, PageSize: 5 }
  if (filters.keyword)        q.Keyword = filters.keyword
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

const trackStatusBadge = {
  false: 'bg-[#e8f5e9] text-[#2e7d32]',
  true: 'bg-[#fce4ec] text-[#c62828]',
}

export default function TrackSelectModal({ open, onClose, eventId, selectedTrackId, onSelect, fetchTracks }) {
  const fetchFn = useCallback(async (q) => {
    const result = await fetchTracks(eventId, q)
    return { items: result.tracks || [], totalCount: result.totalCount || 0 }
  }, [eventId, fetchTracks])

  const columns = useMemo(() => [
    {
      key: 'title', header: 'Track Title', headerIcon: Search,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.title}</span>,
    },
    {
      key: 'maxTeam', header: 'Max Teams', headerIcon: Users,
      render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.maxTeam ?? '—'}</span>,
    },
    {
      key: 'status', header: 'Status', headerIcon: CircleCheck,
      render: (row) => (
        <Badge
          label={row.isDisable ? 'Deleted' : 'Active'}
          className={trackStatusBadge[row.isDisable] || 'bg-gray-50 text-gray-600'}
        />
      ),
    },
  ], [])

  return (
    <TableSelectModal
      open={open}
      onClose={onClose}
      title="Select Track"
      entityName="Tracks"
      selectedId={selectedTrackId}
      onSelect={onSelect}
      fetchFn={fetchFn}
      columns={columns}
      filterConfigs={FILTER_DEFS}
      defaultFilterValues={DEFAULT_FILTER_VALUES}
      buildQuery={buildQuery}
      getName={(row) => row.title}
      allLabel="All"
    />
  )
}
