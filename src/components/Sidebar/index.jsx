import { useLocation } from 'react-router-dom'
import SidebarNavItem from './SidebarNavItem'
import { X } from 'lucide-react'
import { useMemo } from 'react'
import BrandLogo from '../BrandLogo'
import URL_TO_ACTIVE_KEY from './sidebarRoutes'

export default function Sidebar({ navItems, open, onClose }) {
  const { pathname } = useLocation()

  const activeKey = useMemo(() => {
    // Special pages that should not highlight any sidebar item
    if (pathname === '/admin/my-notifications' || pathname.startsWith('/admin/profile')
        || pathname === '/staff/my-notifications' || pathname.startsWith('/staff/profile')) {
      return ''
    }
    const entry = URL_TO_ACTIVE_KEY.find((m) => m.match(pathname))
    return entry?.key || navItems[0]?.key || ''
  }, [pathname, navItems])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[248px] flex-col bg-[#064f5d] transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex-1">
            <BrandLogo white />
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 pt-2" role="navigation">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              activeKey={activeKey}
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="flex-1" />
      </aside>
    </>
  )
}
