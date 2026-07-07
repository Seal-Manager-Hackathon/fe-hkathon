import Badge from '../../components/Badge'
import { formatDate } from '../../utils/format'

export const roundColumns = [
  { key: 'name', header: 'Round Name', render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</span> },
  { key: 'roundNo', header: '#', render: (row) => <span className="text-[13px] text-gray-500">Round {row.roundNo}</span> },
  { key: 'startTime', header: 'Start', render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.startTime)}</p> },
  { key: 'endTime', header: 'End', render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.endTime)}</p> },
  { key: 'limitTeam', header: 'Max Teams', render: (row) => <span className="text-[13px] text-gray-500">{row.limitTeam ?? '—'}</span> },
  { key: 'status', header: 'Status', render: (row) => row.isDisable ? <Badge label="Disabled" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
]