import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Home, Trophy, Medal, LayoutDashboard, Users, UserRound, Settings, Bell, FileText, BarChart3 } from 'lucide-react'

const iconMap = { Home, Trophy, Medal, LayoutDashboard, Users, UserRound, Settings, Bell, FileText, BarChart3 }

export default function SidebarNavItem({ item, activeKey, onClick }) {
  const navigate = useNavigate()
  const isActive = activeKey === item.key
  const Icon = iconMap[item.icon]

  return (
    <button
      onClick={() => { navigate(item.to); onClick?.() }}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left text-[16px] font-bold transition-colors duration-150',
        isActive
          ? 'bg-[#ffca28] text-[#064f5d]'
          : 'text-white hover:bg-white/10 hover:text-white'
      )}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />}
      <span>{item.label}</span>
    </button>
  )
}
