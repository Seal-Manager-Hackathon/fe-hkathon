const TYPES = ['Personal', 'Team', 'System']
export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: '<p>Registration is open for all students and teams. New tracks in <strong>AI</strong>, <strong>Blockchain</strong>, and <strong>Climate Tech</strong> are available.</p>', date: 'Jul 06, 2026', read: false, targetType: 'System' },
  { id: 2, title: 'New round added: Final Pitch', body: '<p>The Final Pitch round has been added to <em>Cloud Builders Cup 2026</em>. Submit your slides by <strong>July 20</strong>.</p>', date: 'Jul 05, 2026', read: false, targetType: 'Team' },
  { id: 3, title: 'System maintenance scheduled', body: '<p>Platform will undergo maintenance on <strong>July 12</strong> from 02:00 AM to 06:00 AM UTC.</p>', date: 'Jul 03, 2026', read: true, targetType: 'System' },
  { id: 4, title: 'Your team has been approved', body: '<p>Your team registration for SEAL Hackathon 2026 has been approved. Good luck!</p>', date: 'Jul 01, 2026', read: true, targetType: 'Personal' },
]
