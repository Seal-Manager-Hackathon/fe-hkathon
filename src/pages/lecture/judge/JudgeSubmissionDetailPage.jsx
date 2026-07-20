import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, User, CircleCheck, Send, ExternalLink, FolderKanban, Layers, Star, Eye, Info, Lock, Trophy } from 'lucide-react'
import { getJudgeSubmissionDetail, getLecturerCriteriaTemplates, getLecturerCriteriaItems } from '../../../api/lecturer'
import GradeSubmissionModal from '../../../components/GradeSubmissionModal'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorState from './ErrorState'
import TabBtn from './TabBtn'
import SidebarCard from './SidebarCard'

const statusBadge = {
  Submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Graded: 'bg-blue-50 text-blue-700 border border-blue-200',
  Failed: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export default function JudgeSubmissionDetailPage() {
  const { submissionId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('content')
  const [criteriaTemplates, setCriteriaTemplates] = useState([])
  const [criteriaTemplateItems, setCriteriaTemplateItems] = useState({})
  const [criteriaLoading, setCriteriaLoading] = useState(false)
  const [gradeModalOpen, setGradeModalOpen] = useState(false)

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

  // Fetch criteria when switching to that tab
  useEffect(() => {
    if (tab !== 'criteria' || !data?.roundId) return
    let cancelled = false
    async function fetch() {
      setCriteriaLoading(true)
      try {
        const result = await getLecturerCriteriaTemplates(data.roundId, { PageSize: 100 })
        const templates = result.templates || []
        if (cancelled) return
        setCriteriaTemplates(templates)
        const itemsMap = {}
        await Promise.all(templates.map(async (tpl) => {
          try {
            const itemsResult = await getLecturerCriteriaItems(tpl.id, { PageSize: 100 })
            itemsMap[tpl.id] = itemsResult.items || []
          } catch {}
        }))
        if (!cancelled) setCriteriaTemplateItems(itemsMap)
      } catch {} finally {
        if (!cancelled) setCriteriaLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [tab, data?.roundId])

  if (loading) return <LoadingSkeleton />
  if (error) {
    const nf = error.includes('Not Found')
    return <ErrorState message={error} nf={nf} />
  }
  if (!data) return null

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5">
        <button onClick={() => {
          if (window.history.length > 2) {
            navigate(-1)
          } else if (data?.roundId) {
            navigate(`/lecture/rounds/${data.roundId}/submissions`)
          } else {
            navigate('/lecture/submissions')
          }
        }} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Submissions
        </button>
      </div>

      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 shadow-inner">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white sm:text-[26px]">
                Submission Detail
                <Badge label={data.status} className="ml-3 align-middle inline-flex bg-white/15 text-white border border-white/20" />
              </h1>
              <p className="mt-0.5 text-[13px] text-white/70">
                <span>Submitted {formatDateTime(data.submittedAt || data.createdAt)}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGradeModalOpen(true)}
            className="mt-3 sm:mt-0 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-[14px] font-semibold text-white backdrop-blur-sm border border-white/20 hover:bg-white/25 active:scale-[0.97]"
          >
            <Star className="h-4 w-4" /> {data?.status === 'Graded' ? 'Regrade' : 'Grade'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Tabs */}
          <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
            <div className="flex bg-gradient-to-r from-slate-50 to-white">
              <TabBtn active={tab === 'content'} icon={Eye} label="Content" color="blue" onClick={() => setTab('content')} />
              <TabBtn active={tab === 'info'} icon={Info} label="Information" color="amber" onClick={() => setTab('info')} />
              <TabBtn active={tab === 'criteria'} icon={FileText} label="Criteria Template" color="purple" onClick={() => setTab('criteria')} />
            </div>

            {tab === 'content' && (
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
            )}

            {tab === 'info' && (
              <div className="divide-y divide-[#f5f5f5]">
                <InfoRow label="Status" icon={CircleCheck}>
                  <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
                </InfoRow>
                {data.isRegrade && (
                  <InfoRow label="Regrade" icon={Star}><Badge label="Yes" className="bg-[#fff3e0] text-[#e65100]" /></InfoRow>
                )}
                {data.totalScore != null && (
                  <InfoRow label="Total Score" icon={Star}><span className="text-[16px] font-bold text-[#064f5d]">{data.totalScore}</span></InfoRow>
                )}
                {data.judgeCount != null && (
                  <InfoRow label="Judge Count" icon={Users}><span className="text-[14px] text-[#1f2f3a]">{data.judgeCount}</span></InfoRow>
                )}
                <InfoRow label="Submitted At" icon={Calendar}>
                  <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.submittedAt || data.createdAt)}</span>
                </InfoRow>
                <InfoRow label="Last Updated" icon={Clock}>
                  <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</span>
                </InfoRow>
              </div>
            )}

            {tab === 'criteria' && (
              criteriaLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="space-y-3 w-full max-w-md px-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-16 animate-pulse rounded bg-gray-100" />
                    <div className="h-16 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ) : !data?.roundId ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-[14px] text-gray-400">No round associated with this submission.</p>
                </div>
              ) : criteriaTemplates.filter(tpl => tpl.isActive).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-[14px] text-gray-400">No active criteria templates for this round.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f0f0f0]">
                  {criteriaTemplates.filter(tpl => tpl.isActive).map((tpl) => {
                    const items = (criteriaTemplateItems[tpl.id] || []).filter(item => !item.isDisable)
                    return (
                      <div key={tpl.id} className="px-5 py-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[15px] font-bold text-[#064f5d]">{tpl.title || tpl.name}</span>
                          <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
                        </div>
                        {items.length > 0 ? (
                          <div className="rounded-lg border border-[#e8ecf0] overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-[#fafbfc]">
                                  <th className="px-4 py-2 text-left text-[12px] font-bold uppercase text-slate-500">Criteria</th>
                                  <th className="px-4 py-2 text-left text-[12px] font-bold uppercase text-slate-500 w-32">Max Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#f0f0f0]">
                                {items.map((item) => (
                                  <tr key={item.id} className="hover:bg-[#fafbfc]">
                                    <td className="px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a]">{item.name || item.criteriaName || '—'}</td>
                                    <td className="px-4 py-2.5 text-[14px] font-bold text-[#064f5d]">{item.score != null ? item.score : '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-[13px] text-gray-400 italic">No criteria items.</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
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

          {/* Team & Context */}
          <SidebarCard icon={Users} title="Team">
            <InfoRow label="Team" icon={Users}>
              <span className="text-[14px] font-semibold text-[#1f2f3a]">{data.teamName || '—'}</span>
            </InfoRow>
          </SidebarCard>

          <SidebarCard icon={Layers} title="Context">
            <InfoRow label="Round" icon={Layers}>
              <span className="text-[14px] text-[#1f2f3a]">{data.roundName || <span className="text-gray-400">—</span>}</span>
            </InfoRow>
            <InfoRow label="Track" icon={FolderKanban}>
              <span className="text-[14px] text-gray-400">{data.trackTitle || '—'}</span>
            </InfoRow>
            <InfoRow label="Topic" icon={FileText}>
              <span className="text-[14px] text-gray-400">{data.topicTitle || '—'}</span>
            </InfoRow>
          </SidebarCard>
        </div>
      </div>

      <GradeSubmissionModal
        open={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        submissionId={submissionId}
        roundId={data?.roundId}
        scoreId={data?.status === 'Graded' ? data?.score?.id || data?.scoreId : null}
        mode={data?.status === 'Graded' ? 'regrade' : 'grade'}
        onSuccess={() => {
          // Refresh submission data after successful grade
          getJudgeSubmissionDetail(submissionId).then(setData).catch(() => {})
        }}
      />
    </div>
  )
}
