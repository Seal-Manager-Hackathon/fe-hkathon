import { ArrowLeft, Calendar, Lock, CircleCheck, Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import { formatDateTime } from '../../../utils/format'

/**
 * Team detail page header and team information card.
 * Receives team data via props — no API import.
 *
 * @param {{ team: object }} props
 */
export default function TeamDetailHeader({ team }) {
  return (
    <>
      <div className="mb-4">
        <Link to="/staff/teams" className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Teams
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{team.name}</h1>
            {team.isDisable ? (
              <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
            ) : (
              <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
            )}
          </div>
          <p className="mt-2 text-[12px] sm:text-[13px] text-gray-400">Created {formatDateTime(team.createdAt)}</p>
        </div>
      </div>

      <CardPanel title="Team Information">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Team Name" icon={Users}><p className="text-[14px] font-medium text-[#1f2f3a]">{team.name}</p></InfoRow>
          <InfoRow label="Lock" icon={Lock}>{team.canEdit ? <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />}</InfoRow>
          <InfoRow label="Status" icon={CircleCheck}>{team.isDisable ? <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}</InfoRow>
          <InfoRow label="Created At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(team.createdAt)}</p></InfoRow>
          <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(team.updatedAt)}</p></InfoRow>
        </div>
      </CardPanel>
    </>
  )
}
