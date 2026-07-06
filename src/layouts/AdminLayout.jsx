import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { mockAdminNavItems } from '../data/mockAdminData'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar navItems={mockAdminNavItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[248px]">
        <Header
          viewAllTo="/admin/my-notifications"
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
