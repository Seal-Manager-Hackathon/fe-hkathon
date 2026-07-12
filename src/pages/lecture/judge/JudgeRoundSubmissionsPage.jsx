import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Users, User, FolderKanban, FileText, Star, CircleCheck, Calendar, Eye, ExternalLink, Layers } from 'lucide-react'
import BaseTable from '../../../components/BaseTable'
import Badge from '../../../components/Badge'
import Avatar from '../../../components/Avatar'
import TrackSelectModal from '../../../components/TrackSelectModal'
import { getJudgeRoundSubmissions, getLecturerMyTracks } from '../../../api/lecturer'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const gradingBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Graded: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

export default function JudgeRoundSubmissionsPage() {
  const { roundId } = useParams()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trackId, setTrackId] = useState('')
  const [trackName, setTrackName] = useState('')
  const [trackModalOpen, setTrackModalOpen] = useState(false)

  const fetchSubmissions = useCallback(async (page = 1) => {
    if (!roundId) return
    setLoading(true); setError('')
    try {
      const params = { PageIndex: page, PageSize: PAGE_SIZE }
      if (trackId) params.trackId = trackId
      const result = await getJudgeRoundSubmissions(roundId, params)
      setItems(result.items || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      const msg = err?.response?.data?.message
      if (msg?.toLowerCase().includes('not found')) {
        setError('Round not found or you are not assigned.')
      } else if (msg?.toLowerCase().includes('forbidden') || msg?.toLowerCase().includes('not assigned')) {
        setError('You are not assigned as a Judge for this round/track.')
      } else {
        setError(msg || 'Failed to load submissions.')
      }
      setItems([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [roundId, trackId])

  useEffect(() => { fetchSubmissions(1); setPageIndex(1) }, [fetchSubmissions])
  useEffect(() => { if (pageIndex > 1) fetchSubmissions(pageIndex) }, [pageIndex])

  function handleTrackSelect(id, name) {
    setTrackId(id)
    setTrackName(name)
    setPageIndex(1)
  }

  function handleClearTrack() {
    setTrackId('')
    setTrackName('')
    setPageIndex(1)
  }

  const columns = [
    {
      key: 'teamName',
      header: 'Team',
      headerIcon: Users,
      render: (row) => (
        <div>
          <Link to={`/lecture/register-teams/${row.registerTeamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
            {row.teamName || '—'}
          </Link>
          {row.topicTitle && (
            <p className="text-[12px] text-gray-400">{row.topicTitle}</p>
          )}
        </div>
      ),
    },
    {
      key: 'submittedBy',
      header: 'Submitted By',
      headerIcon: User,
      render: (row) => {
        const sb = row.submittedBy
        if (!sb) return <span className="text-[13px] text-gray-400">—</span>
        return (
          <div className="flex items-center gap-2">
            <Avatar src={sb.avatarUrl} name={`${sb.firstName || ''} ${sb.lastName || ''}`} size="h-7 w-7" textSize="text-[10px]" />
            <span className="text-[13px] text-[#1f2f3a]">{sb.firstName} {sb.lastName}</span>
          </div>
        )
      },
    },
    {
      key: 'trackTitle',
      header: 'Track',
      headerIcon: FolderKanban,
      render: (row) => row.trackId ? (
        <Link to={`/lecture/tracks/${row.trackId}`} className="text-[13px] font-medium text-[#064f5d] hover:underline">{row.trackTitle}</Link>
      ) : <span className="text-[13px] text-gray-400">—</span>,
    },
    {
      key: 'gradingStatus',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => (
        <Badge label={row.gradingStatus || 'Pending'} className={gradingBadge[row.gradingStatus] || gradingBadge.Pending} />
      ),
    },
    {
      key: 'totalScore',
      header: 'Score',
      headerIcon: Star,
      render: (row) => (
        <span className={`text-[15px] font-bold ${row.totalScore != null ? 'text-[#064f5d]' : 'text-gray-400'}`}>
          {row.totalScore != null ? row.totalScore : '—'}
        </span>
      ),
    },
    {
      key: 'lastSubmission',
      header: 'Last Submission',
      headerIcon: Calendar,
      render: (row) => {
        const ls = row.lastSubmission
        if (!ls) return <span className="text-[13px] text-gray-400">—</span>
        return (
          <div>
            {ls.url ? (
              <a
                href={ls.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#064f5d] hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> Open
              </a>
            ) : (
              <span className="text-[13px] text-[#1f2f3a]">—</span>
            )}
            <p className="text-[11px] text-gray-400">{formatDateTime(ls.submittedAt)}</p>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => {
        const ls = row.lastSubmission
        if (!ls?.id) return null
        return (
          <Link
            to={`/lecture/submissions/${ls.id}`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        )
      },
    },
  ]

  return (
    <>
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-4">
          <Link
            to={eventId ? `/lecture/hackathons/${eventId}?tab=Rounds` : '/lecture/hackathons'}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Hackathons
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Round Submissions</h1>
          <p className="mt-1 text-[14px] text-gray-500">Review submissions for this round as a Judge.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <div className="flex flex-wrap items-end gap-3">
              {/* Track filter button */}
              <div className="relative w-full sm:w-[240px]">
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <FolderKanban className="h-3 w-3" /> Track
                </label>
                <button
                  type="button"
                  onClick={() => setTrackModalOpen(true)}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
                >
                  <span className={trackId ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
                    {trackId ? trackName : 'All Tracks'}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <BaseTable
            borderless
            columns={columns}
            data={items}
            page={pageIndex}
            pageSize={PAGE_SIZE}
            total={totalCount}
            onPageChange={setPageIndex}
            loading={loading}
            serverSide
            emptyText="No submissions found for this round."
            keyExtractor={(row) => row.registerTeamId}
            minWidth="800px"
          />
        </div>
      </div>

      <TrackSelectModal
        open={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        eventId={eventId || roundId}
        selectedTrackId={trackId}
        onSelect={(id, name) => { handleTrackSelect(id, name); setTrackModalOpen(false) }}
        fetchTracks={getLecturerMyTracks}
      />
    </>
  )
}
