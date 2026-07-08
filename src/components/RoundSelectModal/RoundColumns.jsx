import { useMemo } from 'react'
import { Hash, Calendar, Play, Flag, Users, CircleCheck } from 'lucide-react'
import Badge from '../Badge'
import { formatDateTime } from '../../utils/format'
import { isRowSelected } from './helpers'
import RadioCell from './RadioCell'

export default function useRoundColumns(pendingId, selectedRoundId) {
  return useMemo(() => [
    {
      key: 'select', header: '', className: 'w-12',
      render: (row) => <RadioCell isSelected={isRowSelected(row, pendingId, selectedRoundId)} />,
    },
    {
      key: 'roundNo', header: 'Round', headerIcon: Hash,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-600">
          Round {row.roundNo}
        </span>
      ),
    },
    {
      key: 'name', header: 'Round Name', headerIcon: Calendar,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]\">{row.name}</span>,
    },
    {
      key: 'startTime', header: 'Start', headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500\">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime', header: 'End', headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500\">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'limitTeam', header: 'Teams', headerIcon: Users,
      render: (row) => <span className="text-[13px] text-gray-500\">{row.limitTeam ?? '—'}</span>,
    },
    {
      key: 'status', header: 'Status', headerIcon: CircleCheck,
      render: (row) => row.isDisable
        ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />,
    },
  ], [pendingId, selectedRoundId])
}
