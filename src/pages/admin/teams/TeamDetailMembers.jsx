import { Users } from 'lucide-react'
import CardPanel from '../../../components/CardPanel'
import BaseTable from '../../../components/BaseTable'
import { teamMemberColumns } from './teamMemberColumns'

/**
 * Team members tab content.
 * Receives data via props — no API import.
 *
 * @param {{ members: Array }} props
 */
export default function TeamDetailMembers({ members }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white">
      <div className="border-b border-[#f0f0f0] px-5 py-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#064f5d]" />
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">Members</h3>
        </div>
      </div>
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-[14px] text-gray-400">No members in this team.</p>
        </div>
      ) : (
        <BaseTable
          borderless
          columns={teamMemberColumns}
          data={members}
          page={1}
          pageSize={members.length}
          total={members.length}
          emptyText="No members."
          keyExtractor={(row) => row.userId}
          minWidth="600px"
        />
      )}
    </div>
  )
}
