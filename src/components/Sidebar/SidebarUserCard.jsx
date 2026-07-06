import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import {
  ChevronDown,
  LogIn, UserPlus,
  User, Settings, LogOut,
} from 'lucide-react'

const iconMap = {
  LogIn, UserPlus,
  User, Settings, LogOut,
}

export default function SidebarUserCard({ user, menuItems }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isAuthenticated = !!user.email

  return (
    <div ref={ref} className="relative mx-3 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full cursor-pointer rounded-xl bg-white p-3 transition-shadow hover:shadow-md',
          open && 'shadow-md'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
              isAuthenticated ? 'bg-[#1f78d1]' : 'bg-[#064f5d]'
            )}
          >
            {user.avatarLetter}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-semibold text-[#1f2f3a]">{user.name}</p>
            <p className="truncate text-xs text-gray-500">
              {isAuthenticated ? user.email : 'Explore account'}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <button
                key={item.action}
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50"
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


