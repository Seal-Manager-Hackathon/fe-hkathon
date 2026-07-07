import { TARGET_TYPE_OPTIONS_ALL } from '../../constants/adminOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const notificationsFilters = [
  {
    type: 'search',
    key: 'title',
    placeholder: 'Search by title...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'targetType',
    label: 'Target',
    options: TARGET_TYPE_OPTIONS_ALL,
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
