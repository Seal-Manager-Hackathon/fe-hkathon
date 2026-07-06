import { cn } from '../../utils/cn'
import { ChevronDown } from 'lucide-react'

export default function SidebarUserCard({ user, isAuthenticated }) {
  return (
    <div className="mx-3 mb-4 rounded-xl bg-white p-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
            isAuthenticated ? 'bg-[#1f78d1]' : 'bg-[#064f5d]'
          )}
        >
          {user.avatarLetter}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1f2f3a]">{user.name}</p>
          <p className="truncate text-xs text-gray-500">
            {isAuthenticated ? user.email : 'Explore account'}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </div>
    </div>
  )
}
