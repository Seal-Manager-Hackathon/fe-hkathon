import { Search, Lock, Ban, Calendar } from 'lucide-react'
import { LOCK_OPTIONS, DISABLE_OPTIONS } from '../../../constants/commonOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const teamsFilters = [
  {
    type: 'search',
    key: 'keyword',
    label: 'Search',
    icon: Search,
    placeholder: 'Search by team name...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'canEdit',
    label: 'Lock',
    icon: Lock,
    options: LOCK_OPTIONS,
    className: 'w-full sm:w-[160px]',
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
