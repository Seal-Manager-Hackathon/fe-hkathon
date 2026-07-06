import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { mockAdminNavItems, mockAdminUser, mockAdminMenu } from '../data/mockAdminData'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        navItems={mockAdminNavItems}
        user={mockAdminUser}
        userMenu={mockAdminMenu}
        defaultActive="dashboard"
      />

      <main className="ml-[248px] flex min-h-screen flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
