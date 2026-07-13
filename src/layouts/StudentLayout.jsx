import { useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { mockNavItems } from '../data/mockHomeData'

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = useMemo(() => {
    if (!user) return mockNavItems.filter((item) => item.key !== 'teams' && item.key !== 'invitations')
    return mockNavItems
  }, [user])

  const menuItems = useMemo(() => {
    if (!user) return [
      { icon: 'LogIn', label: 'Sign in', to: '/login' },
      { icon: 'UserPlus', label: 'Sign up', to: '/register' },
    ]
    return [
      { icon: 'User', label: 'Profile', to: '/profile' },
      { icon: 'LogOut', label: 'Sign out', to: null },
    ]
  }, [user])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar navItems={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
