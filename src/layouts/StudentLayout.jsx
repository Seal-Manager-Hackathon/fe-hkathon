import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { mockNavItems, mockGuestUser, mockGuestMenu } from '../data/mockHomeData'

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        navItems={mockNavItems}
        user={mockGuestUser}
        userMenu={mockGuestMenu}
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
