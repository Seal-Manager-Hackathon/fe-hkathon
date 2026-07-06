import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
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

      <div className="ml-[248px] flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
