import { useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'

const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/admin' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/admin/hackathons' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'BarChart3', to: '/admin/leaderboard' },
  { key: 'teams', label: 'Teams', icon: 'UserRound', to: '/admin/teams' },
  { key: 'users', label: 'Users', icon: 'Users', to: '/admin/users' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', to: '/admin/notifications' },
  { key: 'reports', label: 'Reports', icon: 'FileText', to: '/admin/reports' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = useMemo(() => {
    if (!user) return []
    return [
      { icon: 'User', label: 'Profile', to: '/admin/profile' },
      { icon: 'LogOut', label: 'Sign out', to: null },
    ]
  }, [user])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar navItems={ADMIN_NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
