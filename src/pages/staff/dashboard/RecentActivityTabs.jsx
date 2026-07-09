import { Link } from 'react-router-dom'
import { Trophy, Users, Bell, FileText, ArrowRight } from 'lucide-react'

const TABS = [
  { key: 'hackathons', label: 'Hackathons', icon: Trophy, viewAll: '/staff/hackathons' },
  { key: 'users', label: 'Users', icon: Users, viewAll: '/staff/users' },
  { key: 'notifications', label: 'Notifications', icon: Bell, viewAll: '/staff/notifications' },
  { key: 'reports', label: 'Reports', icon: FileText, viewAll: '/staff/reports' },
]

/**
 * Tab bar inside the recent activity panel.
 */
export default function RecentActivityTabs({ activeTab, onChange }) {
  const active = TABS.find((t) => t.key === activeTab) || TABS[0]

  return (
    <div className="flex bg-gradient-to-r from-[#064f5d] to-[#0a6e7d]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer px-5 py-3 text-[13px] font-semibold transition-colors inline-flex items-center gap-1.5 ${
            activeTab === tab.key
              ? 'border-b-2 border-white text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <tab.icon className="h-3.5 w-3.5" />
          {tab.label}
        </button>
      ))}
      <div className="ml-auto flex items-center pr-4">
        <Link
          to={active.viewAll}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/70 hover:text-white hover:underline"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export { TABS as RECENT_TABS }
