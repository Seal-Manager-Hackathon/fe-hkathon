import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, User, CircleCheck, Send, FolderKanban, Layers, Star, Lock, Trophy } from 'lucide-react'
import { getSubmissionDetail, getTeamDetail, getSubmissionGraderScores, getRegisterTeamDetail } from '../../../api/staff'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorState from './ErrorState'
import SidebarCard from './SidebarCard'
import SubmissionTabs from './SubmissionTabs'

const regStatusBadge = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
}

const GRADER_PAGE_SIZE = 5

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
                <Link to={`/staff/tracks/${data.trackId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.trackTitle || '—'}</Link>
              ) : <span className="text-[14px] text-gray-400">—</span>}
            </InfoRow>
            <InfoRow label="Topic" icon={FileText}>
              {data.topicId && data.trackId && eventId ? (
                <Link to={`/staff/tracks/${data.trackId}/topics`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.topicTitle || '—'}</Link>
              ) : <span className="text-[14px] text-gray-400">—</span>}
            </InfoRow>
          </SidebarCard>
        </div>
      </div>
    </div>
  )
}
