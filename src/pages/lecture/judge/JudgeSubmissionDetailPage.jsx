import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Users, Calendar, Clock, ExternalLink, Star, CircleCheck, FileText } from 'lucide-react'
import RichTextViewer from '../../../components/RichTextViewer'
import CardPanel from '../../../components/CardPanel'
import Badge from '../../../components/Badge'
import Avatar from '../../../components/Avatar'
import { getJudgeSubmissionDetail } from '../../../api/lecturer'
import { formatDateTime } from '../../../utils/format'

const statusBadge = {
  Submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Grading: 'bg-amber-50 text-amber-700 border border-amber-200',
  Graded: 'bg-blue-50 text-blue-700 border border-blue-200',
}

export default function JudgeSubmissionDetailPage() {
  const { submissionId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!submissionId) return
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const result = await getJudgeSubmissionDetail(submissionId)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load submission.')
      } finally { if (!cancelled) setLoading(false) }
    }
    fetch()
    return () => { cancelled = true }
  }, [submissionId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-28 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">{error}</p>
        <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5">
        <Link to="/lecture/hackathons" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Hackathons
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-inner">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white sm:text-[26px]">
                Submission Detail
                <Badge label={data.status || '—'} className="ml-3 align-middle inline-flex bg-white/15 text-white border border-white/20" />
              </h1>
              <p className="mt-0.5 text-[13px] text-white/70">
                Submitted {formatDateTime(data.submittedAt || data.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Left column — submission content */}
        <div className="space-y-5 lg:col-span-2">
          <CardPanel title="Submission Content">
            <div className="divide-y divide-[#f5f5f5]">
              <div className="px-5 py-4">
                <span className="text-[13px] font-semibold text-gray-400">URL</span>
                <div className="mt-1">
                  {data.url ? (
                    <a href={data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" /> Open Submission
                    </a>
                  ) : <span className="text-[14px] text-gray-400">—</span>}
                </div>
              </div>
              <div className="px-5 py-4">
                <span className="text-[13px] font-semibold text-gray-400">Description</span>
                <div className="mt-2"><RichTextViewer content={data.description} /></div>
              </div>
            </div>
          </CardPanel>

          <CardPanel title="Information">
            <div className="divide-y divide-[#f5f5f5]">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[13px] text-gray-500"><CircleCheck className="h-3.5 w-3.5" /> Status</span>
                <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
              </div>
              {data.totalScore != null && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><Star className="h-3.5 w-3.5" /> Total Score</span>
                  <span className="text-[16px] font-bold text-[#064f5d]">{data.totalScore}</span>
                </div>
              )}
              {data.judgeCount != null && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><Users className="h-3.5 w-3.5" /> Judge Count</span>
                  <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.judgeCount}</span>
                </div>
              )}
              {data.isRegrade && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><Star className="h-3.5 w-3.5" /> Regrade</span>
                  <Badge label="Yes" className="bg-[#fff3e0] text-[#e65100]" />
                </div>
              )}
              <div className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[13px] text-gray-500"><Calendar className="h-3.5 w-3.5" /> Submitted At</span>
                <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.submittedAt || data.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[13px] text-gray-500"><Clock className="h-3.5 w-3.5" /> Last Updated</span>
                <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</span>
              </div>
            </div>
          </CardPanel>
        </div>

        {/* Right column — team & context info */}
        <div className="space-y-5">
          <CardPanel title="Submitted By">
            <div className="p-5">
              {data.submittedBy ? (
                <div className="flex items-center gap-3">
                  <Avatar name={`${data.submittedBy.firstName} ${data.submittedBy.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1f2f3a]">{data.submittedBy.firstName} {data.submittedBy.lastName}</p>
                    <p className="text-[12px] text-gray-400">{data.submittedBy.email}</p>
                  </div>
                </div>
              ) : <p className="text-[14px] text-gray-400">—</p>}
            </div>
          </CardPanel>

          <CardPanel title="Team">
            <div className="divide-y divide-[#f5f5f5]">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-[13px] text-gray-500"><Users className="h-3.5 w-3.5" /> Team</span>
                <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.teamName || '—'}</span>
              </div>
              {data.roundName && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><Calendar className="h-3.5 w-3.5" /> Round</span>
                  <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.roundName}</span>
                </div>
              )}
              {data.trackTitle && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><FileText className="h-3.5 w-3.5" /> Track</span>
                  <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.trackTitle}</span>
                </div>
              )}
              {data.topicTitle && (
                <div className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2 text-[13px] text-gray-500"><FileText className="h-3.5 w-3.5" /> Topic</span>
                  <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.topicTitle}</span>
                </div>
              )}
            </div>
          </CardPanel>
        </div>
      </div>
    </div>
  )
}
