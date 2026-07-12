import { Search, Shield, AlertCircle } from 'lucide-react'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { assignEventColumns } from './assignEventColumns'

const PAGE_SIZE = 10

export default function UserDetailAssignEvents({
  userRole,
  events,
  total,
  loading,
  error,
  page,
  keyword,
  eventRole,
  onPageChange,
  onFilterChange,
  onFilterReset,
}) {
  const roleOptions = userRole === 'Staff'
    ? [{ value: 'Staff', label: 'Staff' }]
    : [
        { value: 'Mentor', label: 'Mentor' },
        { value: 'Judge', label: 'Judge' },
      ]
  const filters = [
    { type: 'search', key: 'keyword', label: 'Event', icon: Search, placeholder: 'Search event name...' },
    { type: 'select', key: 'eventRole', label: 'Event Role', icon: Shield, options: [{ value: '', label: 'All Roles' }, ...roleOptions] },
  ]

  return (
    <div className="mt-5">
      <div className="rounded-xl border border-[#e8ecf0] bg-white">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">Assigned Events</h3>
        </div>
        <div className="px-5 pt-4 pb-0">
          <div className="mb-4">
            <FilterBar
              filters={filters}
              values={{ keyword, eventRole }}
              onChange={onFilterChange}
              onReset={onFilterReset}
              hasActive={keyword !== '' || eventRole !== ''}
            />
          </div>
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[13px] text-[#c62828]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
        <BaseTable
          borderless
          columns={assignEventColumns}
          data={events}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={onPageChange}
          loading={loading}
          emptyText="No assigned events found."
          keyExtractor={(row) => row.eventRoleId || `${row.id}-${row.eventRoleName}`}
          serverSide
          minWidth="1100px"
        />
      </div>
    </div>
  )
}
