import { Search, Target, Trash2, Calendar } from 'lucide-react'
import { TARGET_TYPE_OPTIONS_ALL, DISABLE_OPTIONS } from '../../../constants/commonOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const notificationsFilters = [
  {
    type: 'search',
    key: 'title',
    label: 'Search',
    placeholder: 'Search by title...',
    className: 'w-full sm:w-[280px]',
    icon: Search,
  },
  {
    type: 'select',
    key: 'targetType',
    label: 'Target',
    options: TARGET_TYPE_OPTIONS_ALL,
    className: 'w-full sm:w-[180px]',
    icon: Target,
  },
  {
    type: 'select',
    key: 'isDisable',
    label: 'Deleted',
    options: DISABLE_OPTIONS,
    className: 'w-full sm:w-[160px]',
    icon: Trash2,
  },
  {
    type: 'date',
    key: 'fromDate',
    label: 'From',
    className: 'w-full sm:w-[180px]',
    icon: Calendar,
  },
  {
    type: 'date',
    key: 'toDate',
    label: 'To',
    className: 'w-full sm:w-[180px]',
    icon: Calendar,
  },
]
