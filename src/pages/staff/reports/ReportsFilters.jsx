import { Search, Flag, Calendar } from 'lucide-react'
import { REPORT_STATUS_OPTIONS_ALL } from '../../../constants/adminOptions'

export const reportsFilters = [
  {
    type: 'search',
    key: 'keyword',
    label: 'Search',
    icon: Search,
    placeholder: 'Search by email, name or title...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'status',
    label: 'Status',
    icon: Flag,
    options: REPORT_STATUS_OPTIONS_ALL,
    className: 'w-full sm:w-[180px]',
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