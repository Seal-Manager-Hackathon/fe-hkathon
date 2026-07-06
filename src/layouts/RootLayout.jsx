import { Outlet } from 'react-router-dom'
import './RootLayout.css'

export default function RootLayout() {
  return (
    <div className="root-layout">
      <main className="root-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
