/**
 * Shared admin constants: options, badges, and filter sets.
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

/* ─── Hackathon ─── */
export const HACKATHON_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Closed', label: 'Closed' },
]

export const HACKATHON_STATUS_OPTIONS_ALL = [
  { value: '', label: 'All Statuses' },
  ...HACKATHON_STATUS_OPTIONS,
]

export const VISIBILITY_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

export const VISIBILITY_OPTIONS_ALL = [
  { value: '', label: 'All Visibilities' },
  ...VISIBILITY_OPTIONS,
]

export const YEAR_OPTIONS_2024_2028 = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
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

/* ─── Notification ─── */
export const NOTIFICATION_TYPE_OPTIONS = [
  { value: 'Announcement', label: 'Announcement' },
  { value: 'Update', label: 'Update' },
  { value: 'Alert', label: 'Alert' },
]

export const NOTIFICATION_TYPE_OPTIONS_ALL = [
  { value: '', label: 'All Types' },
  ...NOTIFICATION_TYPE_OPTIONS,
]

export const NOTIFICATION_TYPE_OPTIONS_SELECT = [
  { value: '', label: 'Select type...' },
  ...NOTIFICATION_TYPE_OPTIONS,
]

export const AUDIENCE_OPTIONS = [
  { value: 'All Users', label: 'All Users' },
  { value: 'Participants', label: 'Participants' },
  { value: 'Staff', label: 'Staff' },
]

export const AUDIENCE_OPTIONS_ALL = [
  { value: '', label: 'All Audiences' },
  ...AUDIENCE_OPTIONS,
]

export const AUDIENCE_OPTIONS_SELECT = [
  { value: '', label: 'Select audience...' },
  ...AUDIENCE_OPTIONS,
]

export const NOTIFICATION_STATUS_OPTIONS = [
  { value: 'Sent', label: 'Sent' },
  { value: 'Draft', label: 'Draft' },
]

export const NOTIFICATION_STATUS_OPTIONS_ALL = [
  { value: '', label: 'All Statuses' },
  ...NOTIFICATION_STATUS_OPTIONS,
]

export const NOTIFICATION_STATUS_OPTIONS_SELECT = [
  { value: '', label: 'Select status...' },
  { value: 'Sent', label: 'Send immediately' },
  { value: 'Draft', label: 'Save as draft' },
]

/* ─── Notification TargetType ─── */
export const TARGET_TYPE_OPTIONS = [
  { value: 'Personal', label: 'Personal' },
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
export const CAN_EDIT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Can Edit' },
  { value: 'false', label: 'Cannot Edit' },
]
