import { Search, Shield, UserCheck, Ban, Calendar } from 'lucide-react'
import { ROLE_OPTIONS_ALL, VERIFIED_OPTIONS, DISABLE_OPTIONS } from '../../../constants/commonOptions'

/**
 * Filter descriptor array consumed by FilterBar.
 * Each entry maps to a filter control: search, select, or date.
 */
export const usersFilters = [
  {
    type: 'search',
    key: 'keyword',
    label: 'Search',
    icon: Search,
    placeholder: 'Search by name or email...',
    className: 'w-full sm:w-[280px]',
  },
  {
    type: 'select',
    key: 'role',
    label: 'Role',
    icon: Shield,
    options: ROLE_OPTIONS_ALL,
    className: 'w-full sm:w-[160px]',
  },
  {
    type: 'select',
    key: 'isVerified',
    label: 'Verified',
    icon: UserCheck,
    options: VERIFIED_OPTIONS,
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
