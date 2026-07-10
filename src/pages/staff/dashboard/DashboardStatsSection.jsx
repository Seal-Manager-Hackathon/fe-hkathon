import {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock, Play, Flag,
} from 'lucide-react'
import StatCard from '../../../components/StatCard'
import SectionTitle from '../../../components/SectionTitle'

const iconMap = {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock, Play, Flag,
}

/**
 * Renders a stats grid section (Hackathons, Users, Teams) with title and optional view-all link.
 */
export default function DashboardStatsSection({ section }) {
  const viewAllMap = {
    Hackathons: '/staff/hackathons',
    'My Events': '/staff/hackathons',
    Users: '/staff/users',
    Teams: '/staff/teams',
  }

  return (
    <div>
      <SectionTitle viewAllTo={viewAllMap[section.title]}>
        {section.title}
      </SectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {section.items.map((item) => (
          <StatCard
            key={item.label}
            icon={iconMap[item.icon]}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
    </div>
  )
}
