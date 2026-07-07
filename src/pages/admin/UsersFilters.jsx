import { ROLE_OPTIONS_ALL, VERIFIED_OPTIONS, DISABLE_OPTIONS } from '../../constants/adminOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const usersFilters = [
  {
    type: 'search',
    key: 'keyword',
    placeholder: 'Search by name or email...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'role',
    label: 'Role',
    options: ROLE_OPTIONS_ALL,
    className: 'w-full sm:w-[160px]',
  },
  {
    type: 'select',
    key: 'isVerified',
    label: 'Verified',
    options: VERIFIED_OPTIONS,
    className: 'w-full sm:w-[160px]',
  },
  {
    type: 'select',
    key: 'isDisable',
    label: 'Status',
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
