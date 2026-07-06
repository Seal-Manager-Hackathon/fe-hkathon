import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function StudentLayout() {
  const isAuthenticated = false

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isAuthenticated={isAuthenticated} />

      <main className="ml-[248px] flex min-h-screen flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
