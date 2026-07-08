import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, Layers, FolderKanban, FileText, Eye, Send, MoreHorizontal, User } from 'lucide-react'
import { formatDateTime } from '../../../../utils/format'

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
            <Link to={`/admin/hackathons/${eventId}/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">
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
            <span className="text-[13px] text-gray-500">{row.topicTitle || '—'}</span>
          ) : (
            <span className="text-[13px] text-gray-400">—</span>
          ),
      },
      {
        key: 'submittedBy', header: 'Submitted By', headerIcon: User,
        render: (row) =>
          row.submittedBy ? (
            <Link to={`/admin/users/${row.submittedBy.userId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">
              {row.submittedBy.firstName} {row.submittedBy.lastName}
            </Link>
          ) : (
            <span className="text-[13px] text-gray-400">—</span>
          ),
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
        key: 'submissions', header: 'Submissions', headerIcon: FileText,
        render: (row) => <span className="text-[13px] font-semibold text-[#064f5d]">{row.records?.length || 0}</span>,
      },
      {
        key: 'actions', header: 'Actions', headerIcon: MoreHorizontal,
        headerClassName: 'text-right', className: 'text-right',
        render: (row) => (
          <div className="flex items-center justify-end gap-2">
            <Link to={`/admin/submissions/${row.lastSubmission?.id || row.id}`} className={S.viewBtn}>
              <Eye className="h-3.5 w-3.5" />View
            </Link>
          </div>
        ),
      },
    ],
    [eventId],
  )
}
