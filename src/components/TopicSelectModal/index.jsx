import { useMemo, useCallback } from 'react'
import { Search, Ban, Calendar, CircleCheck } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'
import { getTopics } from '../../api/admin'
import TableSelectModal from '../TableSelectModal'

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Topic Title', icon: Search, placeholder: 'Search topic title...' },
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

export default function TopicSelectModal({ open, onClose, trackId, selectedTopicId, onSelect }) {
  const fetchFn = useCallback(async (q) => {
    if (!trackId) return { items: [], totalCount: 0 }
    const result = await getTopics(trackId, q)
    return { items: result.topics || [], totalCount: result.totalCount || 0 }
  }, [trackId])

  const columns = useMemo(() => [
    {
      key: 'title', header: 'Topic Title', headerIcon: Calendar,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.title}</span>,
    },
    {
      key: 'createdAt', header: 'Created', headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
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
      title="Select Topic"
      entityName="Topics"
      selectedId={selectedTopicId}
      onSelect={onSelect}
      fetchFn={fetchFn}
      columns={columns}
      filterConfigs={FILTER_DEFS}
      defaultFilterValues={DEFAULT_FILTER_VALUES}
      buildQuery={buildQuery}
      getName={(row) => row.title}
      allLabel="All Topics"
    />
  )
}
