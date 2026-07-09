import {
  Trophy, Users, UserCheck, Bell, FileText, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
  UserRound,
} from 'lucide-react'

export const mockStaffNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/staff' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/staff/hackathons' },
  { key: 'teams', label: 'Teams', icon: 'UserRound', to: '/staff/teams' },
  { key: 'users', label: 'Users', icon: 'Users', to: '/staff/users' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', to: '/staff/notifications' },
  { key: 'reports', label: 'Reports', icon: 'FileText', to: '/staff/reports' },
]

export const mockStaffUser = {
  name: 'Staff Member',
  email: 'staff@seal.dev',
  avatarLetter: 'S',
  role: 'Staff',
}

export const mockStaffMenu = [
  { icon: 'User', label: 'Profile', to: '/staff/profile' },
  { icon: 'LogOut', label: 'Sign out', to: null },
]

// ---- Dashboard shared data ----

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
    ],
  },
]

export const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export const iconMap = {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
  Bell,
}

export const notificationTypeBadge = {
  Announcement: 'bg-[#e3f2fd] text-[#1565c0]',
  Update: 'bg-[#e8f5e9] text-[#2e7d32]',
  Alert: 'bg-[#fce4ec] text-[#c62828]',
}

export const notificationStatusBadge = {
  Sent: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
}

