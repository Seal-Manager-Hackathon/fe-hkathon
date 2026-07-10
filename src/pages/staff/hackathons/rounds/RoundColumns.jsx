import { Eye, Hash, Calendar, Play, Flag, Users, CircleCheck, ClipboardList, TrendingUp, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const viewBtnClass =
  'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

const criteriaBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fff3e0] px-3 py-1.5 text-[13px] font-semibold text-[#e65100] transition-colors hover:bg-[#ffe0b2]'

const nextRoundBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] whitespace-nowrap w-[110px] justify-center'

const leaderboardBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-[13px] font-semibold text-[#7b1fa2] transition-colors hover:bg-[#e1bee7]'

export function roundColumns(onNextRound, onLeaderboard) {
  return [
    { key: 'roundNo', header: '#', headerIcon: Hash, render: (row) => <span className="text-[13px] text-[#1f2f3a]">Round {row.roundNo}</span> },
    { key: 'name', header: 'Round Name', headerIcon: Calendar, render: (row) => <Link to={`/staff/rounds/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.name}</Link> },
    { key: 'startTime', header: 'Start', headerIcon: Play, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.startTime)}</p> },
    { key: 'endTime', header: 'End', headerIcon: Flag, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.endTime)}</p> },
    { key: 'limitTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{row.limitTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: null,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <Link to={`/staff/rounds/${row.id}`} className={viewBtnClass}>
              <Eye className="h-3.5 w-3.5" /> View
            </Link>
            {!row.isDisable && (
              <>
                <button onClick={() => onNextRound?.(row)} className={nextRoundBtnClass}>
                  <TrendingUp className="h-3.5 w-3.5" /> Team Flow
                </button>
                <Link to={`/staff/rounds/${row.id}/criteria-templates`} className={criteriaBtnClass}>
                  <ClipboardList className="h-3.5 w-3.5" /> Criteria
                </Link>
                <button onClick={() => onLeaderboard?.(row)} className={leaderboardBtnClass}>
                  <BarChart3 className="h-3.5 w-3.5" /> Leaderboard
                </button>
              </>
            )}
          </div>
        </div>
      ),
    },
  ]
}
