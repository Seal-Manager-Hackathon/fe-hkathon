import { HACKATHON_STATUS_OPTIONS_ALL as STATUS_OPTIONS } from '../../constants/adminOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const hackathonFilters = [
  {
    type: 'search',
    key: 'keyword',
    placeholder: 'Search by event name...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'status',
    label: 'Status',
    options: STATUS_OPTIONS,
    className: 'w-full sm:w-[180px]',
  },
  {
    type: 'date',
    key: 'fromDate',
    label: 'From',
    className: 'w-full sm:w-[180px]',
  },
  {
    type: 'date',
    key: 'toDate',
    label: 'To',
    className: 'w-full sm:w-[180px]',
  },
]
