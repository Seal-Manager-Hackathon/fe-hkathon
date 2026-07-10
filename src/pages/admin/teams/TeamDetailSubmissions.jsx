import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import CardPanel from '../../../components/CardPanel'
import BaseTable from '../../../components/BaseTable'
import { teamSubmissionColumns } from './teamColumns'

const SUB_PAGE_SIZE = 10

/**
 * Submissions tab content.
 * Receives all data and handlers via props — no API import.
 *
 * @param {{
 *   allRegisters: Array,
 *   selectedRegisterId: string,
 *   submissions: Array,
 *   subTotal: number,
 *   subPage: number,
 *   subLoading: boolean,
 *   onRegisterChange: (id: string) => void,
 *   onPageChange: (page: number) => void,
 * }} props
 */
export default function TeamDetailSubmissions({
  allRegisters,
  selectedRegisterId,
  submissions,
  subTotal,
  subPage,
  subLoading,
  onRegisterChange,
  onPageChange,
}) {
  const selectedReg = allRegisters.find((r) => r.id === selectedRegisterId)

  return (
    <CardPanel title="Submissions">
      <div className="mb-4 px-1">
        <label className="text-[13px] font-semibold text-[#1f2f3a] mr-2">Select Registration:</label>
        <div className="relative inline-block">
          <select
            value={selectedRegisterId}
            onChange={(e) => onRegisterChange(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg border border-[#e0e0e0] bg-white py-2 pl-3 pr-8 text-[13px] font-medium text-[#1f2f3a] focus:border-[#064f5d] focus:outline-none"
          >
            {allRegisters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.eventName || 'Untitled Event'} {r.trackName ? `— ${r.trackName}` : ''} ({r.status})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {selectedReg && (
          <Link to={`/admin/register-teams/${selectedReg.id}`} className="ml-3 text-[13px] font-medium text-[#064f5d] hover:underline">
            View Registration
          </Link>
        )}
      </div>
      <BaseTable
        borderless
        columns={teamSubmissionColumns}
        data={submissions}
        page={subPage}
        pageSize={SUB_PAGE_SIZE}
        total={subTotal}
        onPageChange={onPageChange}
        loading={subLoading}
        serverSide
        emptyText="No submissions found."
        keyExtractor={(row) => row.roundId}
        minWidth="700px"
      />
    </CardPanel>
  )
}
