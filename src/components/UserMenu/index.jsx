import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ChevronDown, LogIn, UserPlus, User, Settings, LogOut, Users } from 'lucide-react'

const iconMap = { LogIn, UserPlus, User, Settings, LogOut, Users }

export default function UserMenu({ user, menuItems }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isAuthenticated = !!user?.email

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-100"
      >
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
            isAuthenticated ? 'bg-[#1f78d1]' : 'bg-[#064f5d]'
          )}
        >
          {user?.avatarLetter || '?'}
        </div>
        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{user?.name}</p>
          {isAuthenticated && (
            <p className="truncate text-[11px] text-gray-400">{user.email}</p>
          )}
        </div>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-[220px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon]
            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50"
                >
                  {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                  {item.label}
                </Link>
              )
            }
            return (
              <button
                key={item.label}
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50"
              >
                {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}