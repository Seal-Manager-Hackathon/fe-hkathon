import { useMemo, useCallback } from 'react'
import { Search, Ban, Users, Calendar, CircleCheck } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'
import { getEventRegisterTeams } from '../../api/admin'
import TableSelectModal from '../TableSelectModal'

const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Team Name', icon: Search, placeholder: 'Search team name...' },
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

export default function RegisterTeamSelectModal({ open, onClose, eventId, selectedRegisterTeamId, onSelect }) {
  const fetchFn = useCallback(async (q) => {
    const result = await getEventRegisterTeams(eventId, q)
    return { items: result.registerTeams || [], totalCount: result.totalCount || 0 }
  }, [eventId])

  const columns = useMemo(() => [
    {
      key: 'teamName', header: 'Team Name', headerIcon: Users,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.teamName || '—'}</span>,
    },
    {
      key: 'createdAt', header: 'Registered', headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
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
      title="Select Register Team"
      entityName="Register Teams"
      selectedId={selectedRegisterTeamId}
      onSelect={onSelect}
      fetchFn={fetchFn}
      columns={columns}
      filterConfigs={FILTER_DEFS}
      defaultFilterValues={DEFAULT_FILTER_VALUES}
      buildQuery={buildQuery}
      getName={(row) => row.teamName}
      allLabel="All"
    />
  )
}
