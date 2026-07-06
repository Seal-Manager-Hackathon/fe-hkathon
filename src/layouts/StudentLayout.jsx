import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { mockNavItems, mockGuestUser, mockGuestMenu } from '../data/mockHomeData'

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        navItems={mockNavItems}
        user={mockGuestUser}
        userMenu={mockGuestMenu}
      />

      <main className="ml-[248px] flex min-h-screen flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
