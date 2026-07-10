import { Users, GraduationCap, Briefcase, Shield, Users as UsersIcon } from 'lucide-react'

const ROLE_META = {
  Student: { icon: GraduationCap, color: 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]', iconColor: 'text-[#1565c0]' },
  Lecturer: { icon: Briefcase, color: 'bg-[#f3e5f5] text-[#7b1fa2] border-[#e1bee7]', iconColor: 'text-[#7b1fa2]' },
  Staff: { icon: Shield, color: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]', iconColor: 'text-[#2e7d32]' },
  Admin: { icon: UsersIcon, color: 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]', iconColor: 'text-[#e65100]' },
}

/**
 * Sidebar showing user count breakdown by role.
 * @param {{ counts: Record<string, number> }} props
 */
export default function UsersCreateSidebar({ counts }) {
  const totalUsers = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="self-start space-y-4">
      <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
          <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-[#80deea]" /> Users in System
          </h4>
        </div>
        <div className="divide-y divide-[#f5f5f5]">
          <div className="px-5 py-3">
            <p className="text-[13px] text-gray-400">Total</p>
            <p className="text-[22px] font-bold text-[#1f2f3a]">{totalUsers}</p>
          </div>
          {Object.entries(ROLE_META).map(([role, meta]) => {
            const Icon = meta.icon
            return (
              <div key={role} className="flex items-center gap-3 px-5 py-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.color.replace(/text-\S+/, '')}`}>
                  <Icon className={`h-4 w-4 ${meta.iconColor}`} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">{role}</p>
                  <p className="text-[14px] font-semibold text-[#1f2f3a]">{counts[role] ?? '—'}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
