import { Search } from 'lucide-react'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { userEventColumns } from './userEventColumns'

const PAGE_SIZE = 10

/**
 * User event history table section.
 * Receives all data and handlers via props — no API import.
 *
 * @param {{
 *   events: Array,
 *   eventsTotal: number,
 *   eventsLoading: boolean,
 *   eventPage: number,
 *   eventKeyword: string,
 *   onPageChange: (page: number) => void,
 *   onFilterChange: (key: string, value: string) => void,
 *   onFilterReset: () => void,
 * }} props
 */
export default function UserDetailEvents({
  events,
  eventsTotal,
  eventsLoading,
  eventPage,
  eventKeyword,
  onPageChange,
  onFilterChange,
  onFilterReset,
}) {
  const eventHasActive = eventKeyword !== ''
  const eventFilters = [
    { type: 'search', key: 'keyword', label: 'Event', icon: Search, placeholder: 'Search event name...' },
  ]

  return (
    <div className="mt-5">
      <div className="rounded-xl border border-[#e8ecf0] bg-white">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">Event History</h3>
        </div>
        <div className="px-5 pt-4 pb-0">
          <div className="mb-4">
            <FilterBar
              filters={eventFilters}
              values={{ keyword: eventKeyword }}
              onChange={onFilterChange}
              onReset={onFilterReset}
              hasActive={eventHasActive}
            />
          </div>
        </div>
        <BaseTable
          borderless
          columns={userEventColumns}
          data={events}
          page={eventPage}
          pageSize={PAGE_SIZE}
          total={eventsTotal}
          onPageChange={onPageChange}
          loading={eventsLoading}
          emptyText="No event history found."
          keyExtractor={(row) => row.registerTeamId || row.eventId}
        />
      </div>
    </div>
  )
}
