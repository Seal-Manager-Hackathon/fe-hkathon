/**
 * Shared constants used by both admin and staff pages.
 */

/* ─── Role ─── */
export const ROLE_OPTIONS = [
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
]

export const ROLE_OPTIONS_ALL = [
  { value: '', label: 'All Roles' },
  ...ROLE_OPTIONS,
]

export const ROLE_OPTIONS_SELECT = [
  { value: '', label: 'Select role...' },
  ...ROLE_OPTIONS,
]

export const ROLE_OPTIONS_SELECT_NO_ADMIN = [
  { value: '', label: 'Select role...' },
  ...ROLE_OPTIONS.filter((r) => r.value !== 'Admin'),
]

export const roleBadge = {
  Admin: 'bg-[#fce4ec] text-[#c62828]',
  Staff: 'bg-[#fff3e0] text-[#e65100]',
  Student: 'bg-[#e3f2fd] text-[#1565c0]',
  Lecturer: 'bg-[#f3e5f5] text-[#7b1fa2]',
}

/* ─── User filters ─── */
export const VERIFIED_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Not Verified' },
]

export const DISABLE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

/* ─── Season ─── */
export const SEASON_OPTIONS = [
  { value: 'Spring', label: 'Spring' },
  { value: 'Summer', label: 'Summer' },
  { value: 'Autumn', label: 'Autumn' },
  { value: 'Winter', label: 'Winter' },
]

export const SEASON_OPTIONS_SELECT = [
  { value: '', label: 'Select season...' },
  ...SEASON_OPTIONS,
]

/* ─── Year ─── */
export const YEAR_OPTIONS_2024_2028 = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
]

/* ─── Report ─── */
export const REPORT_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Reject', label: 'Rejected' },
]

export const REPORT_STATUS_OPTIONS_ALL = [
  { value: '', label: 'All Statuses' },
  ...REPORT_STATUS_OPTIONS,
]

export const reportStatusBadge = {
  Pending: 'bg-[#fff3e0] text-[#e65100]',
  Resolved: 'bg-[#e8f5e9] text-[#2e7d32]',
  Reject: 'bg-[#fce4ec] text-[#c62828]',
}

export const reportTypeBadge = {
  Other: 'bg-[#e3f2fd] text-[#1565c0]',
}

/* ─── Notification TargetType ─── */
export const TARGET_TYPE_OPTIONS = [
  { value: 'Personal', label: 'User' },
  { value: 'Team', label: 'Team' },
  { value: 'System', label: 'System' },
]

export const TARGET_TYPE_OPTIONS_ALL = [
  { value: '', label: 'All Target Types' },
  ...TARGET_TYPE_OPTIONS,
]

export const targetTypeBadge = {
  Personal: 'bg-[#e3f2fd] text-[#1565c0]',
  Team: 'bg-[#e8f5e9] text-[#2e7d32]',
  System: 'bg-[#f3e5f5] text-[#7b1fa2]',
}

/* ─── Team filters ─── */
export const LOCK_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'false', label: 'Locked' },
  { value: 'true', label: 'Unlocked' },
]
