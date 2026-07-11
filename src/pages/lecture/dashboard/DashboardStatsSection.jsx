import {
  Trophy, Users, Play, Flag,
  CheckCircle, XCircle, Clock,
} from 'lucide-react'
import StatCard from '../../../components/StatCard'
import SectionTitle from '../../../components/SectionTitle'

const iconMap = {
  Trophy, Users, Play, Flag,
  CheckCircle, XCircle, Clock,
}

/**
 * Renders a stats grid section with title and optional view-all link.
 */
export default function DashboardStatsSection({ section }) {
  const viewAllMap = {
    'My Events': '/lecture/hackathons',
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
