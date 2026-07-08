import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, User, CircleCheck, Send, ExternalLink, FolderKanban, Layers, Hash, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { getSubmissionDetail } from '../../../api/admin'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'

const statusBadge = {
  Submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Grading: 'bg-amber-50 text-amber-700 border border-amber-200',
  Graded: 'bg-blue-50 text-blue-700 border border-blue-200',
}

function ScoreCard({ score }) {
  const [openItems, setOpenItems] = useState({})

  function toggleItem(id) {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="rounded-xl border border-[#e8ecf0] overflow-hidden">
      <div className="flex items-center justify-between bg-[#fafbfc] px-5 py-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-semibold text-[#1f2f3a]">{score.trackTitle || 'Score'}</span>
          {score.isRetake && <Badge label="Retake" className="bg-[#fce4ec] text-[#c62828]" />}
          {score.isMock && <Badge label="Mock" className="bg-[#fff3e0] text-[#e65100]" />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-400">Total</span>
          <span className="text-[16px] font-bold text-[#064f5d]">{score.totalScore}</span>
        </div>
      </div>
      <div>
        {(score.items || []).map((item) => {
          const isOpen = !!openItems[item.scoreItemId]
          return (
            <div key={item.scoreItemId} className="border-b border-[#f0f0f0] last:border-b-0">
              <button onClick={() => toggleItem(item.scoreItemId)} className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-[#1f2f3a]">{item.criteriaName}</span>
                  <Badge label={`${item.score} pts`} className="bg-[#e3f2fd] text-[#1565c0]" />
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              {isOpen && (
                <div className="space-y-2 bg-[#fafbfc] px-5 pb-4">
                  {item.comment && (
                    <p className="text-[13px] text-gray-600"><span className="font-semibold">Comment:</span> {item.comment}</p>
                  )}
                  {item.gradedBy && (
                    <div className="flex items-center gap-2 text-[13px] text-gray-500">
                      <span className="font-medium">Graded by</span>
                      <Link to={`/admin/users/${item.gradedBy.userId}`} className="inline-flex items-center gap-1.5 font-semibold text-[#064f5d] hover:underline">
                        <Avatar src={item.gradedBy.avatarUrl} name={`${item.gradedBy.firstName} ${item.gradedBy.lastName}`} size="h-6 w-6" textSize="text-[10px]" />
                        {item.gradedBy.firstName} {item.gradedBy.lastName}
                      </Link>
                    </div>
                  )}
                  <p className="text-[12px] text-gray-400">Last updated {formatDateTime(item.updatedAt || item.createdAt)}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="border-t border-[#f0f0f0] bg-[#fafbfc] px-5 py-2 text-[12px] text-gray-400">
        Graded {formatDateTime(score.createdAt)}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mb-6 h-28 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
    </div>
  )
}

function ErrorState({ message, nf }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="mb-4 rounded-full bg-rose-50 p-4"><Send className="h-8 w-8 text-rose-400" /></div>
      <p className="text-[18px] font-semibold text-gray-500">{nf ? 'Submission not found' : message}</p>
      <Link to="/admin/hackathons" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Hackathons</Link>
    </div>
  )
}

export default function SubmissionDetail() {
  const { submissionId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchData() {
    setLoading(true); setError('')
    try { const result = await getSubmissionDetail(submissionId); setData(result) }
    catch (err) { setError(err?.response?.data?.message || 'Failed to load submission.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [submissionId])

  if (loading) return <LoadingSkeleton />

  if (error) {
    const nf = error.includes('Not Found')
    return <ErrorState message={error} nf={nf} />
  }

  if (!data) return null

  const scores = data.scores || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5">
        <button onClick={() => window.history.back()} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-inner">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-white sm:text-[26px]">Submission Detail</h1>
                <p className="mt-0.5 flex items-center gap-2 text-[13px] text-white/70">
                  <span>Submitted {formatDateTime(data.submittedAt || data.createdAt)}</span>
                  <Badge label={data.status} className={statusBadge[data.status] || 'bg-white/15 text-white border border-white/20'} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          <CardPanel title="Submission Details">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Status" icon={CircleCheck}>
                <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
              </InfoRow>
              {data.isRegrade && (
                <InfoRow label="Regrade" icon={Star}>
                  <Badge label="Yes" className="bg-[#fff3e0] text-[#e65100]" />
                </InfoRow>
              )}
              <InfoRow label="Description" icon={FileText}>
                <p className="text-[14px] text-[#1f2f3a] whitespace-pre-wrap">{data.description || '—'}</p>
              </InfoRow>
              {data.url && (
                <InfoRow label="File" icon={ExternalLink}>
                  <a href={data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> Open Submission
                  </a>
                </InfoRow>
              )}
              <InfoRow label="Submitted At" icon={Calendar}>
                <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.submittedAt || data.createdAt)}</span>
              </InfoRow>
              <InfoRow label="Last Updated" icon={Clock}>
                <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</span>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title={`Judging Scores (${scores.length})`}>
            {scores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Star className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-[14px] text-gray-400">No judge scores yet.</p>
              </div>
            ) : (
              <div className="space-y-4 p-5">
                {scores.map((s) => <ScoreCard key={s.scoreId} score={s} />)}
              </div>
            )}
          </CardPanel>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <CardPanel title="Submitted By">
            <div className="p-5">
              {data.submittedBy ? (
                <Link to={`/admin/users/${data.submittedBy.userId}`} className="flex items-center gap-3 hover:opacity-80">
                  <Avatar src={data.submittedBy.avatarUrl} name={`${data.submittedBy.firstName} ${data.submittedBy.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.submittedBy.firstName} {data.submittedBy.lastName}</p>
                    <p className="text-[12px] text-gray-400">{data.submittedBy.email}</p>
                  </div>
                </Link>
              ) : <p className="text-[14px] text-gray-400">—</p>}
            </div>
          </CardPanel>

          <CardPanel title="Team">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Team" icon={Users}>
                {data.teamId ? (
                  <Link to={`/admin/teams/${data.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.teamName || '—'}</Link>
                ) : <span className="text-[14px] text-[#1f2f3a]">{data.teamName || '—'}</span>}
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Context">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Round" icon={Layers}>
                {data.roundName ? <span className="text-[14px] text-[#1f2f3a]">{data.roundName}</span> : <span className="text-[14px] text-gray-400">—</span>}
              </InfoRow>
              <InfoRow label="Track" icon={FolderKanban}>
                {data.trackTitle ? <span className="text-[14px] text-[#1f2f3a]">{data.trackTitle}</span> : <span className="text-[14px] text-gray-400">—</span>}
              </InfoRow>
              <InfoRow label="Topic" icon={FileText}>
                {data.topicTitle ? <span className="text-[14px] text-[#1f2f3a]">{data.topicTitle}</span> : <span className="text-[14px] text-gray-400">—</span>}
              </InfoRow>
              <InfoRow label="ID" icon={Hash}>
                <span className="text-[12px] text-gray-400 font-mono">{data.id}</span>
              </InfoRow>
            </div>
          </CardPanel>
        </div>
      </div>
    </div>
  )
}
