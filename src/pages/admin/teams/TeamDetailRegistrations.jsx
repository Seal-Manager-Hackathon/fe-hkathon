import { CircleCheck } from 'lucide-react'
import CardPanel from '../../../components/CardPanel'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { teamRegisterColumns } from './teamColumns'

const REG_PAGE_SIZE = 10

const regFilters = [
  {
    type: 'select',
    key: 'status',
    label: 'Status',
    icon: CircleCheck,
    options: [
      { value: '', label: 'All' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ],
  },
]

/**
 * Registration history section for team detail.
 * Receives all data and handlers via props — no API import.
 *
 * @param {{
 *   registers: Array,
 *   regTotal: number,
 *   regLoading: boolean,
 *   regPage: number,
 *   regStatus: string,
 *   regHasActive: boolean,
 *   onPageChange: (page: number) => void,
 *   onFilterChange: (key: string, value: string) => void,
 *   onFilterReset: () => void,
 * }} props
 */
export default function TeamDetailRegistrations({
  registers,
  regTotal,
  regLoading,
  regPage,
  regStatus,
  regHasActive,
  onPageChange,
  onFilterChange,
  onFilterReset,
}) {
  return (
    <div className="mt-5">
      <CardPanel title="Registration History">
        <div className="px-5 pt-4">
          <FilterBar
            filters={regFilters}
            values={{ status: regStatus }}
            onChange={onFilterChange}
            onReset={onFilterReset}
            hasActive={regHasActive}
          />
        </div>
        <BaseTable
          borderless
          columns={teamRegisterColumns()}
          data={registers}
          page={regPage}
          pageSize={REG_PAGE_SIZE}
          total={regTotal}
          onPageChange={onPageChange}
          loading={regLoading}
          serverSide
          emptyText={regHasActive ? 'No results.' : 'No registration history.'}
          keyExtractor={(row) => row.id}
          minWidth="700px"
        />
      </CardPanel>
    </div>
  )
}
