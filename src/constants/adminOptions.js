/**
 * Shared admin options: roles, badges, and filter option sets.
 * Imported by UsersManagement, UsersCreate, UserEdit, UserDetail, AdminDashboard.
 */

export const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
]

export const ROLE_OPTIONS_ALL = [
  { value: '', label: 'All Roles' },
  ...ROLE_OPTIONS,
]

export const ROLE_OPTIONS_SELECT = [
  { value: '', label: 'Select role...' },
  ...ROLE_OPTIONS,
]

export const roleBadge = {
  Admin: 'bg-[#fce4ec] text-[#c62828]',
  Staff: 'bg-[#fff3e0] text-[#e65100]',
  Student: 'bg-[#e3f2fd] text-[#1565c0]',
  Lecturer: 'bg-[#f3e5f5] text-[#7b1fa2]',
}

export const VERIFIED_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Not Verified' },
]

export const DISABLE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Disabled' },
  { value: 'false', label: 'Active' },
]

export const USER_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'true', label: 'Disabled' },
  { value: 'false', label: 'Active' },
]
