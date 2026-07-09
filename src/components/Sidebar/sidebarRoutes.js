/**
 * Maps URL patterns to sidebar active keys.
 * Checked in order — first match wins.
 * Extend this whenever new shortcut routes are added that belong
 * to an existing parent nav item.
 */
const URL_TO_ACTIVE_KEY = [
  // Student routes
  { match: (p) => p === '/' || p === '', key: 'home' },
  { match: (p) => p.startsWith('/hackathons'), key: 'hackathons' },
  { match: (p) => p.startsWith('/leaderboard'), key: 'leaderboard' },
  // Admin routes
  { match: (p) => p.startsWith('/admin/hackathons') || p.startsWith('/admin/rounds'), key: 'hackathons' },
  { match: (p) => p.startsWith('/admin/leaderboard'), key: 'leaderboard' },
  { match: (p) => p.startsWith('/admin/teams'), key: 'teams' },
  { match: (p) => p.startsWith('/admin/users'), key: 'users' },
  { match: (p) => p.startsWith('/admin/notifications'), key: 'notifications' },
  { match: (p) => p.startsWith('/admin/reports'), key: 'reports' },
  { match: (p) => p === '/admin' || p === '/admin/', key: 'dashboard' },
  // Staff routes
  { match: (p) => p.startsWith('/staff/hackathons') || p.startsWith('/staff/rounds'), key: 'hackathons' },
  { match: (p) => p.startsWith('/staff/leaderboard'), key: 'leaderboard' },
  { match: (p) => p.startsWith('/staff/teams'), key: 'teams' },
  { match: (p) => p.startsWith('/staff/users'), key: 'users' },
  { match: (p) => p.startsWith('/staff/notifications'), key: 'notifications' },
  { match: (p) => p.startsWith('/staff/reports'), key: 'reports' },
  { match: (p) => p === '/staff' || p === '/staff/', key: 'dashboard' },
]

export default URL_TO_ACTIVE_KEY
