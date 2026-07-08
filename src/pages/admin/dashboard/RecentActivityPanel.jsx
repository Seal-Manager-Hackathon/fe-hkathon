import { useState } from 'react'
import SectionTitle from '../../../components/SectionTitle'
import RecentActivityTabs from './RecentActivityTabs'
import RecentActivityItem from './RecentActivityItem'

/**
 * Recent activity panel with tabbed views for Hackathons, Users, Notifications, Reports.
 */
export default function RecentActivityPanel({
  recentEvents = [],
  recentUsers = [],
  recentNotifications = [],
  recentReports = [],
  statusBadge = {},
  roleBadge = {},
}) {
  const [tab, setTab] = useState('hackathons')

  const itemsMap = {
    hackathons: recentEvents,
    users: recentUsers,
    notifications: recentNotifications,
    reports: recentReports,
  }

  const items = itemsMap[tab] || []

  return (
    <>
      <SectionTitle>Recent Activity</SectionTitle>
      <div className="rounded-xl border border-[#e9edf0] bg-white overflow-hidden">
        <RecentActivityTabs activeTab={tab} onChange={setTab} />
        <div className="divide-y divide-[#f5f5f5]">
          {items.length > 0
            ? items.map((item) => (
                <RecentActivityItem
                  key={item.id || item.name || item.email}
                  item={item}
                  type={tab}
                  statusBadge={statusBadge}
                  roleBadge={roleBadge}
                />
              ))
            : (
            <div className="px-5 py-8 text-center text-[13px] text-gray-400">
              No data available.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
