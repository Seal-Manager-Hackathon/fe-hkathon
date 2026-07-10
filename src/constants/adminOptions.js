/**
 * Admin-specific constants (not shared with staff pages).
 */

/* ─── Hackathon status (admin only — Draft/Published/Closed) ─── */
export const HACKATHON_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Closed', label: 'Closed' },
]

export const HACKATHON_STATUS_OPTIONS_ALL = [
  { value: '', label: 'All Statuses' },
  ...HACKATHON_STATUS_OPTIONS,
]

/* ─── Visibility ─── */
export const VISIBILITY_OPTIONS = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

export const VISIBILITY_OPTIONS_ALL = [
  { value: '', label: 'All Visibilities' },
  ...VISIBILITY_OPTIONS,
]

/* ─── Notification type (admin only) ─── */
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

/* ─── Audience (admin only) ─── */
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

/* ─── Notification status (admin only) ─── */
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
