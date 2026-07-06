import Badge from '../../../components/Badge'
import BaseTable from '../../../components/BaseTable'
import { roundStatusBadge } from '../../../data/mockAdminData'

export default function RoundsTab({ rounds }) {
  const columns = [
    { key: 'name', header: 'Round Name', render: (row) => <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</p> },
    { key: 'startDate', header: 'Start Date', render: (row) => <p className="text-[13px] text-gray-500">{row.startDate}</p> },
    { key: 'endDate', header: 'End Date', render: (row) => <p className="text-[13px] text-gray-500">{row.endDate}</p> },
    { key: 'status', header: 'Status', render: (row) => <Badge label={row.status} className={roundStatusBadge[row.status]} /> },
    { key: 'teams', header: 'Teams', render: (row) => <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.teams}</p> },
  ]

  if (rounds.length === 0) {
    return <Empty text="No rounds configured yet." />
  }
  return <BaseTable columns={columns} data={rounds} page={1} pageSize={10} total={rounds.length} keyExtractor={(r) => r.id} />
}

function Empty({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-[15px] text-gray-400">{text}</p>
    </div>
  )
}