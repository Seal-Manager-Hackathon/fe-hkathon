import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Layers, FolderKanban, FileText, Eye, Send, MoreHorizontal, User } from 'lucide-react'
import { formatDateTime } from '../../../../utils/format'
import Avatar from '../../../../components/Avatar'

const S = {
  viewBtn:
    'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]',
}

export function useSubmissionColumns(eventId) {
  return useMemo(
    () => [
      {
        key: 'teamName', header: 'Team', headerIcon: Users,
        render: (row) => (
          <Link to={`/admin/teams/${row.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
            {row.teamName || '—'}
          </Link>
        ),
      },
      {
        key: 'roundName', header: 'Round', headerIcon: Layers,
        render: (row) =>
          row.roundId ? (
            <Link to={`/admin/hackathons/${eventId}?tab=Rounds`} className="text-[13px] font-medium text-[#064f5d] hover:underline">
              {row.roundName || '—'}
            </Link>
          ) : (
            <span className="text-[13px] text-gray-400">—</span>
          ),
      },
      {
        key: 'trackTitle', header: 'Track', headerIcon: FolderKanban,
        render: (row) =>
          row.trackId ? (
            <Link to={`/admin/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">
              {row.trackTitle || '—'}
            </Link>
          ) : (
            <span className="text-[13px] text-gray-400">—</span>
          ),
      },
      {
        key: 'topicTitle', header: 'Topic', headerIcon: FileText,
        render: (row) =>
          row.topicId ? (
            <span className="text-[13px] font-medium text-[#064f5d]">{row.topicTitle || '—'}</span>
          ) : (
            <span className="text-[13px] text-gray-400">—</span>
          ),
      },
      {
        key: 'submittedBy', header: 'Submitted By', headerIcon: User,
        render: (row) => {
          const s = row.submittedBy
          if (!s) return <span className="text-[13px] text-gray-400">—</span>
          const fullName = `${s.firstName} ${s.lastName}`.trim()
          return (
            <Link to={`/admin/users/${s.userId}`} className="flex items-center gap-3 hover:opacity-80">
              <Avatar src={s.avatarUrl} name={fullName} size="h-9 w-9" textSize="text-[13px]" />
              <div>
                <p className="text-[14px] font-semibold text-[#064f5d] hover:underline">{fullName}</p>
                <p className="text-[12px] text-[#1f2f3a]">{s.email}</p>
              </div>
            </Link>
          )
        },
      },
      {
        key: 'lastSubmission', header: 'Last Submission', headerIcon: Send,
        render: (row) => {
          const s = row.lastSubmission
          if (!s) return <span className="text-[13px] text-gray-400">—</span>
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-[#1f2f3a]">{formatDateTime(s.submittedAt)}</span>
              <span className="text-[12px] text-gray-400">{s.status}</span>
            </div>
          )
        },
      },
      {
        key: 'actions', header: 'Actions', headerIcon: MoreHorizontal,
        headerClassName: 'text-right', className: 'text-right',
        render: (row) => {
          if (!row.lastSubmission) return null
          return (
            <div className="flex items-center justify-end gap-2">
              <Link to={`/admin/submissions/${row.lastSubmission.id}`} className={S.viewBtn}>
                <Eye className="h-3.5 w-3.5" />View
              </Link>
            </div>
          )
        },
      },
    ],
    [eventId],
  )
}
