import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, User, CircleCheck, Send, ExternalLink, FolderKanban, Layers, Star, Eye, Info, Lock, ChevronRight, Trophy, X } from 'lucide-react'
import { getSubmissionDetail, getTeamDetail, getSubmissionGraderScores, getRegisterTeamDetail, getScoreDetail, getScoreItems, getScoreItemDetail } from '../../../api/staff'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import BaseTable from '../../../components/BaseTable'

const statusBadge = {
  Submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Grading: 'bg-amber-50 text-amber-700 border border-amber-200',
  Graded: 'bg-blue-50 text-blue-700 border border-blue-200',
}

const regStatusBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
}

const GRADER_PAGE_SIZE = 5

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
      <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Submission not found' : message}</p>
      <Link to="/staff/hackathons" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Hackathons</Link>
    </div>
  )
}

function TabBtn({ active, icon: Icon, label, color, onClick }) {
  const c = {
    blue:   { bg: 'from-blue-50 to-white', text: 'text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-500' },
    amber:  { bg: 'from-amber-50 to-white', text: 'text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500' },
    green:  { bg: 'from-emerald-50 to-white', text: 'text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
  }[color] || { bg: 'from-blue-50 to-white', text: 'text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-500' }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 cursor-pointer px-4 py-3.5 text-[13px] font-semibold transition-all duration-200 ${active ? `bg-gradient-to-r ${c.bg} ${c.text}` : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
      <span className="inline-flex items-center gap-2 whitespace-nowrap"><Icon className={`h-4 w-4 ${active ? c.icon : 'text-slate-400'}`} />{label}</span>
      {active && <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${c.bar}`} />}
    </button>
  )
}


function ScoreDetailModal({ scoreId, onClose }) {
  const [score, setScore] = useState(null)
  const [items, setItems] = useState([])
  const [itemDetails, setItemDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scoreId) return
    setLoading(true); setError('')
    Promise.all([
      getScoreDetail(scoreId),
      getScoreItems(scoreId, { pageIndex: 1, pageSize: 100 }),
    ])
      .then(([scoreData, itemsData]) => {
        setScore(scoreData)
        const scoreItems = itemsData.items || []
        setItems(scoreItems)
        if (scoreItems.length > 0) {
          return Promise.all(
            scoreItems.map((item) =>
              getScoreItemDetail(item.scoreItemId)
                .then((detail) => ({ [item.scoreItemId]: detail }))
                .catch(() => ({ [item.scoreItemId]: {} }))
            )
          ).then((details) => {
            setItemDetails(Object.assign({}, ...details))
          })
        }
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load score detail.'))
      .finally(() => setLoading(false))
  }, [scoreId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[70%] max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Header — fixed */}
        <div className="shrink-0 px-6 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-slate-800">Score Detail</h3>
            <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-32 animate-pulse rounded bg-slate-100" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
          ) : score ? (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#f4f6f8] p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Score</p>
                    <p className="mt-1 text-[24px] font-bold text-[#064f5d]">{score.totalScore ?? '—'}</p>
                  </div>
                  {score.gradedBy && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Graded By</p>
                      <div className="mt-1 flex items-center gap-3">
                        <Avatar src={score.gradedBy.avatarUrl} name={`${score.gradedBy.firstName || ''} ${score.gradedBy.lastName || ''}`} size="h-10 w-10" textSize="text-[14px]" />
                        <div>
                          <Link to={`/staff/users/${score.gradedBy.userId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
                            {score.gradedBy.firstName} {score.gradedBy.lastName}
                          </Link>
                          <p className="text-[12px] text-gray-400">{score.gradedBy.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {score.isRetake && <Badge label="Retake" className="bg-[#fce4ec] text-[#c62828]" />}
                  {score.isMock && <Badge label="Mock" className="bg-[#fff3e0] text-[#e65100]" />}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-semibold text-slate-500">Criteria Scores ({items.length})</p>
                {items.length === 0 ? (
                  <p className="text-[13px] text-gray-400 italic">No criteria scores.</p>
                ) : (
                  <div className="rounded-lg border border-[#e8ecf0] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#fafbfc]">
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500 min-w-[180px]">Criteria</th>
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500 w-24">Score</th>
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f0]">
                        {items.map((item) => {
                          const detail = itemDetails[item.scoreItemId] || {}
                          const criteriaLink = detail.roundId && detail.criteriaTemplateId
                            ? `/staff/rounds/${detail.roundId}/criteria-templates/${detail.criteriaTemplateId}`
                            : null
                          return (
                          <tr key={item.scoreItemId} className="hover:bg-[#fafbfc]">
                            <td className="px-5 py-3 text-[14px] font-semibold text-[#1f2f3a]">
                              {criteriaLink ? (
                                <Link to={criteriaLink} className="text-[#064f5d] hover:underline">{item.criteriaName || '—'}</Link>
                              ) : (
                                item.criteriaName || '—'
                              )}
                            </td>
                            <td className="px-5 py-3 text-[15px] font-bold text-[#064f5d]">
                              {detail.maxScore != null ? `${item.score ?? '—'} / ${detail.maxScore}` : (item.score ?? '—')}
                            </td>
                            <td className="px-5 py-3 min-w-[300px]">
                              {item.comment ? (
                                <div className="max-h-[120px] overflow-y-auto rounded-lg bg-[#f4f6f8] p-3">
                                  <RichTextViewer content={item.comment} />
                                </div>
                              ) : <span className="italic text-gray-400">—</span>}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] text-slate-400">
                <span>Created {formatDateTime(score.createdAt)}</span>
                <span>Updated {formatDateTime(score.updatedAt)}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer — fixed Close button */}
        <div className="shrink-0 px-6 pb-6 pt-3">
          <div className="flex justify-end">
            <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarCard({ icon: Icon, title, viewTo, children }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2"><Icon className="h-4 w-4 text-[#80deea]" />{title}</h4>
        {viewTo && (
          <Link to={viewTo} className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-white/80 hover:text-white hover:underline">
            View <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="divide-y divide-[#f5f5f5]">{children}</div>
    </div>
  )
}

function SubmissionTabs({ data, graderScores, graderTotal, graderPage, graderLoading, onGraderPageChange, eventId }) {
  const [tab, setTab] = useState('content')
  const [selectedScoreId, setSelectedScoreId] = useState(null)

  const graderColumns = [
    { key: 'grader', header: 'Grader', headerIcon: User,
      render: (row) => {
        const gb = row.gradedBy
        if (gb) return <Link to={`/staff/users/${gb.userId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{gb.firstName} {gb.lastName}</Link>
        if (row.graderName) return <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.graderName}</span>
        return <span className="text-[14px] text-gray-400">—</span>
      },
    },
    { key: 'trackTitle', header: 'Track', headerIcon: FolderKanban,
      render: (row) => row.assignTrackId && eventId ? (
        <Link to={`/staff/hackathons/${eventId}/tracks/${row.assignTrackId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.trackTitle || '—'}
        </Link>
      ) : <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.trackTitle || '—'}</span>
    },
    { key: 'totalScore', header: 'Score', headerIcon: Star, render: (row) => <span className="text-[15px] font-bold text-[#064f5d]">{row.totalScore}</span> },
    { key: 'flags', header: '', render: (row) => <div className="flex items-center gap-1.5">{row.isRetake && <Badge label="Retake" className="bg-[#fce4ec] text-[#c62828]" />}{row.isMock && <Badge label="Mock" className="bg-[#fff3e0] text-[#e65100]" />}</div> },
    { key: 'createdAt', header: 'Graded At', headerIcon: Calendar, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</span> },
    { key: 'actions', header: 'Action', headerClassName: 'text-right', className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setSelectedScoreId(row.scoreId)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"
          >
            <Eye className="h-3.5 w-3.5" />View
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      {selectedScoreId && <ScoreDetailModal scoreId={selectedScoreId} onClose={() => setSelectedScoreId(null)} />}
      <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
      <div className="flex bg-gradient-to-r from-slate-50 to-white">
        <TabBtn active={tab === 'content'} icon={Eye} label="Content" color="blue" onClick={() => setTab('content')} />
        <TabBtn active={tab === 'info'} icon={Info} label="Information" color="amber" onClick={() => setTab('info')} />
        <TabBtn active={tab === 'score'} icon={Star} label="Judge Scores" color="green" onClick={() => setTab('score')} />
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
          <InfoRow label="Submitted At" icon={Calendar}>
            <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.submittedAt || data.createdAt)}</span>
          </InfoRow>
          <InfoRow label="Last Updated" icon={Clock}>
            <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</span>
          </InfoRow>
        </div>
      )}

      {tab === 'score' && (
        graderTotal === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Star className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-[14px] text-gray-400">No judge scores yet.</p>
          </div>
        ) : (
          <BaseTable borderless columns={graderColumns} data={graderScores} page={graderPage} pageSize={GRADER_PAGE_SIZE}
            total={graderTotal} onPageChange={onGraderPageChange} loading={graderLoading}
            serverSide emptyText="No scores." keyExtractor={(row) => row.scoreId} minWidth="600px" />
        )
      )}
    </div>
    </>
  )
}

export default function SubmissionDetail() {
  const { submissionId } = useParams()
  const [data, setData] = useState(null)
  const [team, setTeam] = useState(null)
  const [regTeam, setRegTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [graderScores, setGraderScores] = useState([])
  const [graderTotal, setGraderTotal] = useState(0)
  const [graderPage, setGraderPage] = useState(1)
  const [graderLoading, setGraderLoading] = useState(false)

  async function fetchData() {
    setLoading(true); setError('')
    try {
      const result = await getSubmissionDetail(submissionId)
      setData(result)
      if (result.teamId || result.registerTeamId) {
        const promises = []
        if (result.teamId) promises.push(getTeamDetail(result.teamId).then(setTeam).catch(() => {}))
        if (result.registerTeamId) promises.push(getRegisterTeamDetail(result.registerTeamId).then(setRegTeam).catch(() => {}))
        await Promise.allSettled(promises)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load submission.')
    } finally { setLoading(false) }
  }

  const fetchGraderScores = useCallback(async () => {
    setGraderLoading(true)
    try {
      const r = await getSubmissionGraderScores(submissionId, { pageIndex: graderPage, pageSize: GRADER_PAGE_SIZE })
      setGraderScores(r.scores || [])
      setGraderTotal(r.totalCount || 0)
    } catch {} finally { setGraderLoading(false) }
  }, [submissionId, graderPage])

  useEffect(() => { fetchData() }, [submissionId])
  useEffect(() => { if (data) fetchGraderScores() }, [fetchGraderScores, data])

  if (loading) return <LoadingSkeleton />
  if (error) {
    const nf = error.includes('Not Found')
    return <ErrorState message={error} nf={nf} />
  }
  if (!data) return null

  const members = team?.members || []
  const eventId = regTeam?.eventId

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5">
        <button onClick={() => window.history.back()} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Submissions
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-6 py-5 sm:px-8">
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SubmissionTabs
            data={data}
            graderScores={graderScores} graderTotal={graderTotal} graderPage={graderPage}
            graderLoading={graderLoading} onGraderPageChange={setGraderPage}
            eventId={eventId}
          />
        </div>

        <div className="space-y-5">
          <CardPanel title="Submitted By">
            <div className="p-5">
              {data.submittedBy ? (
                <Link to={`/staff/users/${data.submittedBy.userId}`} className="flex items-center gap-3 hover:opacity-80">
                  <Avatar src={data.submittedBy.avatarUrl} name={`${data.submittedBy.firstName} ${data.submittedBy.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.submittedBy.firstName} {data.submittedBy.lastName}</p>
                    <p className="text-[12px] text-gray-400">{data.submittedBy.email}</p>
                  </div>
                </Link>
              ) : <p className="text-[14px] text-gray-400">—</p>}
            </div>
          </CardPanel>

          {/* Team & Registration (merged) */}
          <SidebarCard icon={Users} title="Team & Registration">
            <div className="px-5 py-3.5">
              <div className="flex items-center gap-2 text-[13px]">
                <Users className="h-3.5 w-3.5 text-[#2e7d32]" /><span className="text-gray-400">Team</span>
                {data.teamId ? (
                  <Link to={`/staff/teams/${data.teamId}`} className="font-semibold text-[#064f5d] hover:underline">{data.teamName || '—'}</Link>
                ) : <span className="font-semibold text-[#1f2f3a]">{data.teamName || '—'}</span>}
                {team && (
                  <span className="ml-auto flex items-center gap-1.5">
                    {team.isDisable ? <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
                    {team.canEdit === false && <Badge label="Locked" className="bg-[#ffcdd2] text-[#e65100]" />}
                  </span>
                )}
              </div>
            </div>
            <div className="px-5 py-3.5">
              <div className="flex items-center gap-2 text-[13px]">
                <FileText className="h-3.5 w-3.5 text-[#6a1b9a]" /><span className="text-gray-400">Register Team</span>
                {data.registerTeamId ? (
                  <Link to={`/staff/register-teams/${data.registerTeamId}`} className="font-semibold text-[#064f5d] hover:underline">{data.teamName || '—'}</Link>
                ) : <span className="font-semibold text-gray-400">—</span>}
                {regTeam && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <Badge label={regTeam.status} className={regStatusBadge[regTeam.status] || 'bg-gray-50 text-gray-600'} />
                    {regTeam.isBanned && <Badge label="Banned" className="bg-[#fce4ec] text-[#c62828]" />}
                  </span>
                )}
              </div>
            </div>
            <div className="px-5 py-3 space-y-2">
              <p className="flex items-center gap-2 text-[13px]"><Trophy className="h-3.5 w-3.5 text-[#ef6c00]" /><span className="text-gray-400">Event</span>
                {regTeam?.eventId ? (
                  <Link to={`/staff/hackathons/${regTeam.eventId}`} className="ml-auto font-semibold text-[#064f5d] hover:underline">{regTeam.eventName || '—'}</Link>
                ) : <span className="ml-auto font-semibold text-[#1f2f3a]">{regTeam?.eventName || '—'}</span>}
              </p>
              <p className="flex items-center gap-2 text-[13px]"><Users className="h-3.5 w-3.5 text-[#2e7d32]" /><span className="text-gray-400">Members</span><span className="ml-auto font-semibold text-[#2e7d32]">{team ? members.length : '—'}</span></p>
              <p className="flex items-center gap-2 text-[13px]"><Lock className="h-3.5 w-3.5 text-[#e65100]" /><span className="text-gray-400">Lock</span><span className="ml-auto font-semibold text-[#e65100]">{team ? (team.canEdit ? 'No' : 'Yes') : '—'}</span></p>
              <p className="flex items-center gap-2 text-[13px]"><Calendar className="h-3.5 w-3.5 text-[#1565c0]" /><span className="text-gray-400">Team Created</span><span className="ml-auto font-semibold text-[#1f2f3a]">{team ? formatDateTime(team.createdAt) : '—'}</span></p>
              <p className="flex items-center gap-2 text-[13px]"><Calendar className="h-3.5 w-3.5 text-[#1565c0]" /><span className="text-gray-400">Registered Hackathon</span><span className="ml-auto font-semibold text-[#1f2f3a]">{regTeam ? formatDateTime(regTeam.createdAt) : '—'}</span></p>
            </div>
          </SidebarCard>

          {/* Context */}
          <SidebarCard icon={Layers} title="Context">
            <InfoRow label="Round" icon={Layers}>
              {data.roundId && eventId ? (
                <Link to={`/staff/hackathons/${eventId}?tab=Rounds`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.roundName || '—'}</Link>
              ) : <span className="text-[14px] text-[#1f2f3a]">{data.roundName || <span className="text-gray-400">—</span>}</span>}
            </InfoRow>
            <InfoRow label="Track" icon={FolderKanban}>
              {data.trackId && eventId ? (
                <Link to={`/staff/hackathons/${eventId}/tracks/${data.trackId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.trackTitle || '—'}</Link>
              ) : <span className="text-[14px] text-gray-400">—</span>}
            </InfoRow>
            <InfoRow label="Topic" icon={FileText}>
              {data.topicId && data.trackId && eventId ? (
                <Link to={`/staff/hackathons/${eventId}/tracks/${data.trackId}/topics`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.topicTitle || '—'}</Link>
              ) : <span className="text-[14px] text-gray-400">—</span>}
            </InfoRow>
          </SidebarCard>
        </div>
      </div>
    </div>
  )
}
