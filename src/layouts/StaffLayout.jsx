import { useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'

const STAFF_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/staff' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/staff/hackathons' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'BarChart3', to: '/staff/leaderboard' },
  { key: 'teams', label: 'Teams', icon: 'UserRound', to: '/staff/teams' },
  { key: 'users', label: 'Users', icon: 'Users', to: '/staff/users' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', to: '/staff/notifications' },
  { key: 'reports', label: 'Reports', icon: 'FileText', to: '/staff/reports' },
]

export default function StaffLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = useMemo(() => {
    if (!user) return []
    return [
      { icon: 'User', label: 'Profile', to: '/staff/profile' },
      { icon: 'LogOut', label: 'Sign out', to: null },
    ]
  }, [user])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar navItems={STAFF_NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[248px]">
        <Header
          user={user}
          menuItems={menuItems}
          onLogout={logout}
          showSidebarToggle
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
