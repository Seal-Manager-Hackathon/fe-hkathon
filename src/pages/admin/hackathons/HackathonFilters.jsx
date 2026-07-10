import { Search, CircleDot, Ban, Calendar } from 'lucide-react'
import { HACKATHON_STATUS_OPTIONS_ALL as STATUS_OPTIONS } from '../../../constants/adminOptions'
import { DISABLE_OPTIONS } from '../../../constants/commonOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const hackathonFilters = [
  {
    type: 'search',
    key: 'keyword',
    label: 'Search',
    icon: Search,
    placeholder: 'Search by event name...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'status',
    label: 'Status',
    icon: CircleDot,
    options: STATUS_OPTIONS,
    className: 'w-full sm:w-[180px]',
  },
  {
    type: 'select',
    key: 'isDisable',
    label: 'Deleted',
    icon: Ban,
    options: DISABLE_OPTIONS,
    className: 'w-full sm:w-[160px]',
  },
  {
    type: 'date',
    key: 'fromDate',
    label: 'From',
    icon: Calendar,
    className: 'w-full sm:w-[180px]',
  },
  {
    type: 'date',
    key: 'toDate',
    label: 'To',
    icon: Calendar,
    className: 'w-full sm:w-[180px]',
  },
]
