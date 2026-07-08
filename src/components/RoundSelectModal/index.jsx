import { useMemo, useCallback } from 'react'
import { Search, Hash, Ban, Calendar, Play, Flag, Users, CircleCheck } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'
import { getRounds } from '../../api/admin'
import TableSelectModal from '../TableSelectModal'

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban,
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
]

const DEFAULT_FILTER_VALUES = { keyword: '', roundNo: '', isDisable: '' }

function buildQuery(filters, page) {
  const q = { PageIndex: page, PageSize: 5 }
  if (filters.keyword)        q.Keyword = filters.keyword
  if (filters.roundNo !== '') q.RoundNo = Number(filters.roundNo)
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

export default function RoundSelectModal({ open, onClose, eventId, selectedRoundId, onSelect }) {
  const fetchFn = useCallback(async (q) => {
    const result = await getRounds(eventId, q)
    return { items: result.rounds || [], totalCount: result.totalCount || 0 }
  }, [eventId])

  const columns = useMemo(() => [
    {
      key: 'roundNo', header: 'Round', headerIcon: Hash,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-600">
          Round {row.roundNo}
        </span>
      ),
    },
    {
      key: 'name', header: 'Round Name', headerIcon: Calendar,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span>,
    },
    {
      key: 'startTime', header: 'Start', headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime', header: 'End', headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'limitTeam', header: 'Teams', headerIcon: Users,
      render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span>,
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
      title="Select Round"
      entityName="Rounds"
      selectedId={selectedRoundId}
      onSelect={onSelect}
      fetchFn={fetchFn}
      columns={columns}
      filterConfigs={FILTER_DEFS}
      defaultFilterValues={DEFAULT_FILTER_VALUES}
      buildQuery={buildQuery}
      getName={(row) => row.name}
      allLabel="All"
    />
  )
}
