import { useMemo, useCallback } from 'react'
import { Search, Ban, Calendar, Play, Flag, Users, CircleCheck } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'
import { getTracks } from '../../api/admin'
import TableSelectModal from '../TableSelectModal'

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Track Title', icon: Search, placeholder: 'Search track title...' },
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
  if (filters.keyword) q.Keyword = filters.keyword
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

export default function TrackSelectModal({ open, onClose, eventId, selectedTrackId, onSelect }) {
  const fetchFn = useCallback(async (q) => {
    const result = await getTracks(eventId, q)
    return { items: result.tracks || [], totalCount: result.totalCount || 0 }
  }, [eventId])

  const columns = useMemo(() => [
    {
      key: 'title', header: 'Track Title', headerIcon: Calendar,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.title}</span>,
    },
    {
      key: 'startDate', header: 'Start', headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startDate)}</p>,
    },
    {
      key: 'endDate', header: 'End', headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endDate)}</p>,
    },
    {
      key: 'maxTeam', header: 'Max Teams', headerIcon: Users,
      render: (row) => <span className="text-[13px] text-gray-500">{row.maxTeam ?? '—'}</span>,
    },
    {
      key: 'status', header: 'Status', headerIcon: CircleCheck,
      render: (row) => row.isDisable
        ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />,
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
