import Badge from '../../../components/Badge'
import BaseTable from '../../../components/BaseTable'
import { teamStatusBadge } from '../../../data/mockAdminData'

export default function TeamsTab({ teams }) {
  const columns = [
    { key: 'name', header: 'Team Name', render: (row) => <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.name}</p> },
    { key: 'leader', header: 'Team Leader', render: (row) => <p className="text-[14px] text-[#1f2f3a]">{row.leader}</p> },
    { key: 'members', header: 'Members', render: (row) => <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.members}</p> },
    { key: 'registered', header: 'Registered', render: (row) => <p className="text-[13px] text-gray-500">{row.registered}</p> },
    { key: 'status', header: 'Status', render: (row) => <Badge label={row.status} className={teamStatusBadge[row.status]} /> },
  ]

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[15px] text-gray-400">No teams registered yet.</p>
      </div>
    )
  }
  return <BaseTable columns={columns} data={teams} page={1} pageSize={10} total={teams.length} keyExtractor={(t) => t.id} />
}