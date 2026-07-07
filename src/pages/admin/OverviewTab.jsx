import Badge from '../../components/Badge'
import { formatDate } from '../../utils/format'

export const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

export default function OverviewTab({ event }) {
  const rows = [
    { label: 'Name', value: event.name },
    { label: 'Description', value: event.description || '—', full: true },
    { label: 'Season', value: event.season || '—' },
    { label: 'Status', badge: event.status, badgeClass: statusBadge[event.status] },
    { label: 'Active', badge: event.isDisable ? 'Disabled' : 'Active', badgeClass: event.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]' },
    { label: 'Start Time', value: formatDate(event.startTime) },
    { label: 'End Time', value: formatDate(event.endTime) },
    { label: 'Registration Deadline', value: event.registerLimitTime ? formatDate(event.registerLimitTime) : '—' },
    { label: 'Max Teams', value: event.limitTeam ?? '—' },
    { label: 'Min Members', value: event.minMember ?? '—' },
    { label: 'Max Members', value: event.maxMember ?? '—' },
    { label: 'Number of Rounds', value: event.numberRound ?? 0 },
    { label: 'Created', value: formatDate(event.createdAt) },
    { label: 'Last Updated', value: formatDate(event.updatedAt) },
  ]
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white">
      <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4"><h3 className="text-[15px] font-bold text-[#1f2f3a]">Event Information</h3></div>
      <div className="divide-y divide-[#f5f5f5]">
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center px-5 ${row.full ? 'flex-col items-start py-3' : 'justify-between py-3'}`}>
            <span className={`text-[13px] text-gray-400 ${row.full ? 'mb-1 w-full' : ''}`}>{row.label}</span>
            {row.badge ? <Badge label={row.badge} className={row.badgeClass} /> : <span className={`text-[14px] font-medium text-[#1f2f3a] ${row.full ? 'whitespace-pre-wrap leading-relaxed' : ''}`}>{row.value}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}