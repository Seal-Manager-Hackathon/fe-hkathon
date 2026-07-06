import { useLocation } from 'react-router-dom'
import SidebarNavItem from './SidebarNavItem'
import SidebarUserCard from './SidebarUserCard'
import { useMemo } from 'react'

export default function Sidebar({ navItems, user, userMenu }) {
  const { pathname } = useLocation()

  const activeKey = useMemo(() => {
    if (pathname === '/admin/my-notifications') return ''
    const sorted = [...navItems].sort((a, b) => b.to.length - a.to.length)
    const match = sorted.find((item) => pathname.startsWith(item.to))
    return match?.key || navItems[0]?.key || ''
  }, [pathname, navItems])

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[248px] flex-col bg-[#064f5d]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 items-center justify-center rounded-md bg-white px-2.5 text-sm font-extrabold text-[#064f5d]">
          SEAL
        </div>
        <span className="text-lg font-bold text-white">Hackathon</span>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-2" role="navigation">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.key}
            item={item}
            activeKey={activeKey}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <SidebarUserCard user={user} menuItems={userMenu} />
    </aside>
  )
}
