import {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
} from 'lucide-react'

export const mockAdminNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy' },
  { key: 'users', label: 'Users', icon: 'Users' },
  { key: 'settings', label: 'Settings', icon: 'Settings' },
]

export const mockAdminUser = {
  name: 'Admin',
  email: 'admin@seal.dev',
  avatarLetter: 'A',
  role: 'Administrator',
}

export const mockAdminMenu = [
  { icon: 'User', label: 'Profile', to: '/admin/profile' },
  { icon: 'Settings', label: 'Settings', to: '/admin/settings' },
  { icon: 'LogOut', label: 'Sign out', to: null },
]

export const statSections = [
  {
    title: 'Hackathons',
    items: [
      { label: 'Total Hackathons', value: 48, icon: 'Trophy', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Published Hackathons', value: 32, icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Draft Hackathons', value: 9, icon: 'Layers', color: 'bg-[#f5f5f5] text-[#757575]' },
      { label: 'Closed Hackathons', value: 7, icon: 'XCircle', color: 'bg-[#e0f2f1] text-[#00695c]' },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Total Users', value: 1284, icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Student Users', value: 980, icon: 'GraduationCap', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Lecturer Users', value: 180, icon: 'UserCheck', color: 'bg-[#f3e5f5] text-[#7b1fa2]' },
      { label: 'Staff Users', value: 80, icon: 'Briefcase', color: 'bg-[#fff3e0] text-[#e65100]' },
      { label: 'Admin Users', value: 44, icon: 'Shield', color: 'bg-[#fce4ec] text-[#c62828]' },
    ],
  },
  {
    title: 'Teams',
    items: [
      { label: 'Total Teams', value: 256, icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Active Teams', value: 198, icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Disabled Teams', value: 38, icon: 'XCircle', color: 'bg-[#f5f5f5] text-[#757575]' },
      { label: 'Pending Teams', value: 20, icon: 'Clock', color: 'bg-[#fff3e0] text-[#e65100]' },
    ],
  },
]

export const recentHackathons = [
  { name: 'SEAL Hackathon 2026 - Summer', season: 'Summer 2026', date: 'Jul 06, 2026', status: 'Draft', teams: 0, prize: '$50,000' },
  { name: 'Cloud Builders Cup 2026', season: 'Spring 2026', date: 'Jun 15, 2026', status: 'Published', teams: 8, prize: '$30,000' },
  { name: 'Cyber Security Arena 2025', season: 'Fall 2025', date: 'Dec 20, 2025', status: 'Closed', teams: 7, prize: '$25,000' },
  { name: 'AI HackFest 2026', season: 'Fall 2026', date: 'Jun 01, 2026', status: 'Upcoming', teams: 0, prize: '$40,000' },
  { name: 'Green Innovators Cup 2025', season: 'Winter 2025', date: 'Nov 10, 2025', status: 'Closed', teams: 5, prize: '$20,000' },
]

export const recentUsers = [
  { name: 'Alex Johnson', email: 'alex@seal.dev', role: 'Student', status: 'Active', submissions: 12, joined: 'Jan 2026' },
  { name: 'Maria Chen', email: 'maria@dev.io', role: 'Student', status: 'Active', submissions: 9, joined: 'Feb 2026' },
  { name: 'David Kim', email: 'david@code.org', role: 'Lecturer', status: 'Active', submissions: 8, joined: 'Mar 2026' },
  { name: 'Sarah Wilson', email: 'sarah@build.dev', role: 'Student', status: 'Inactive', submissions: 7, joined: 'Jan 2026' },
  { name: 'Tech Corp', email: 'team@techcorp.com', role: 'Staff', status: 'Active', submissions: 6, joined: 'Dec 2025' },
]

export const notifications = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: 'We are excited to announce that SEAL Hackathon 2026 - Summer edition is now accepting submissions. All students and teams are encouraged to register before the deadline on August 15, 2026.', sentBy: 'Admin', date: '2026-07-06' },
  { id: 2, title: 'New round added: Final Pitch', body: 'The Final Pitch round has been added to Cloud Builders Cup 2026. Participants must submit their presentation slides by July 20, 2026.', sentBy: 'Admin', date: '2026-07-05' },
  { id: 3, title: 'System maintenance scheduled', body: 'The platform will undergo scheduled maintenance on July 12, 2026 from 02:00 AM to 06:00 AM UTC.', sentBy: 'Admin', date: '2026-07-03' },
  { id: 4, title: 'New lecturer accounts created', body: '20 new lecturer accounts have been created for the upcoming semester.', sentBy: 'Admin', date: '2026-07-01' },
]

export const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
  Upcoming: 'bg-[#fff3e0] text-[#e65100]',
}

export const roleBadge = {
  Student: 'bg-[#e3f2fd] text-[#1565c0]',
  Staff: 'bg-[#fff3e0] text-[#e65100]',
  Lecturer: 'bg-[#f3e5f5] text-[#7b1fa2]',
  Admin: 'bg-[#fce4ec] text-[#c62828]',
}

export const userStatusBadge = {
  Active: 'bg-[#e8f5e9] text-[#2e7d32]',
  Inactive: 'bg-[#f5f5f5] text-[#757575]',
}

export const iconMap = {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
}
