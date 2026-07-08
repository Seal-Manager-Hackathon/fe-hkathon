import ViewButton from '../../../components/ViewButton'
import Badge from '../../../components/Badge'
import Avatar from '../../../components/Avatar'

/**
 * Renders a single row inside the recent activity panel.
 * @param {object}  item          - data object
 * @param {string}  type          - 'hackathons' | 'users' | 'notifications' | 'reports'
 * @param {object}  statusBadge   - status -> className map
 * @param {object}  roleBadge     - role -> className map
 */
export default function RecentActivityItem({
  item,
  type,
  statusBadge = {},
  roleBadge = {},
}) {
  if (type === 'hackathons') {
    return (
      <div className="flex items-center justify-between px-5 py-3 gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{item.name}</p>
            <Badge label={item.status} className={statusBadge[item.status]} />
          </div>
          <p className="mt-0.5 text-[12px] text-gray-400">{item.season} &middot; {item.date}</p>
        </div>
        <ViewButton to={`/admin/hackathons/${item.id}`} />
      </div>
    )
  }

  if (type === 'users') {
    return (
      <div className="flex items-center justify-between px-5 py-3 gap-3">
        <Avatar src={item.avatarUrl} name={item.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{item.name}</p>
            <Badge label={item.role} className={roleBadge[item.role]} />
          </div>
          <p className="mt-0.5 truncate text-[12px] text-gray-400">{item.email}</p>
        </div>
        <ViewButton to={`/admin/users/${item.id}`} />
      </div>
    )
  }

  if (type === 'notifications') {
    return (
      <div className="flex items-center justify-between px-5 py-3 gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#1f2f3a]">{item.title}</p>
          <p className="mt-0.5 text-[11px] text-gray-400">{item.date}</p>
        </div>
        <ViewButton to={`/admin/notifications/${item.id}`} />
      </div>
    )
  }

  if (type === 'reports') {
    return (
      <div className="flex items-center justify-between px-5 py-3 gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{item.title}</p>
            <Badge
              label={item.status}
              className={statusBadge[item.status] || 'bg-[#f5f5f5] text-[#757575]'}
            />
            <Badge label={item.typeReport} className="bg-[#e3f2fd] text-[#1565c0]" />
          </div>
          <p className="mt-0.5 text-[11px] text-gray-300">{item.date}</p>
        </div>
        <ViewButton to={`/admin/reports/${item.id}`} />
      </div>
    )
  }

  return null
}
