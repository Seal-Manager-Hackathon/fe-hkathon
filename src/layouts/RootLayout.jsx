import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex grow flex-col">
        <Outlet />
      </main>
    </div>
  )
}

