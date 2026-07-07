import { CAN_EDIT_OPTIONS, DISABLE_OPTIONS } from '../../../constants/adminOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const teamsFilters = [
  {
    type: 'search',
    key: 'keyword',
    placeholder: 'Search by team name...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'canEdit',
    label: 'Can Edit',
    options: CAN_EDIT_OPTIONS,
    className: 'w-full sm:w-[160px]',
  },
  {
    type: 'select',
    key: 'isDisable',
    label: 'Deleted',
    options: DISABLE_OPTIONS,
    className: 'w-full sm:w-[160px]',
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
