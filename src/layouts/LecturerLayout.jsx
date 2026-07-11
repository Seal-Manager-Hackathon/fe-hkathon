import { useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'

const LECTURER_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/lecture' },
  { key: 'hackathons', label: 'My Hackathons', icon: 'Trophy', to: '/lecture/hackathons' },
]

export default function LecturerLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = useMemo(() => {
    if (!user) return []
    return [
      { icon: 'User', label: 'Profile', to: '/lecture/profile' },
      { icon: 'LogOut', label: 'Sign out', to: null },
    ]
  }, [user])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar navItems={LECTURER_NAV_ITEMS} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
