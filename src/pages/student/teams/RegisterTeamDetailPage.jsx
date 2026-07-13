import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Users, Calendar, Crown, FileText, Clock,
  Info, UserRound, Layers, Award, MapPin, UsersRound,
  Trophy, Eye, Upload, X, ExternalLink,
} from 'lucide-react'
import {
  getStudentRegisterTeamDetail,
  getStudentRounds,
  getStudentRoundDetail,
  getStudentAwards,
  getStudentEventLeaderboard,
  getStudentEventAssignments,
  getStudentTeamSubmissions,
  submitStudentSubmission,
  getStudentSubmissionDetail,
} from '../../../api/student'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import { formatDate, formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import Pagination from '../../../components/Pagination'
import { useAuth } from '../../../context/AuthContext'
import { toast } from '../../../utils/toast'

const TABS = [
  { key: 'overview', label: 'Overview', icon: Info },
  { key: 'rounds', label: 'Rounds', icon: Layers },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'assignments', label: 'Assignments', icon: UsersRound },
  { key: 'leaderboard', label: 'Leaderboard', icon: MapPin },
]

export default function RegisterTeamDetailPage() {
  const { registerTeamId } = useParams()
  const { user } = useAuth()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const currentUserId = user?.id

  useEffect(() => {
    if (!registerTeamId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentRegisterTeamDetail(registerTeamId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) setError('Not found')
          else setError(err?.response?.data?.message || 'Failed to load details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [registerTeamId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-36 animate-pulse rounded bg-gray-200" />
          <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-200" />
          <div className="rounded-xl border border-[#d7e0e5] bg-white p-6">
            <div className="mb-6 flex gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />)}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <Link to="/teams" className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
            <ArrowLeft size={16} /> Back to Teams
          </Link>
          <div className="flex min-h-[40vh] flex-col items-center justify-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
              <FileText size={28} />
            </div>
            <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
            <Link to="/teams" className="mt-2 text-[14px] font-medium text-[#1565c0] hover:underline">&larr; Back to Teams</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link to={`/teams/${detail.teamId}/registrations`} className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
          <ArrowLeft size={16} /> Back to Registrations
        </Link>

        {/* Header card */}
        <div className="mb-6 overflow-hidden rounded-xl border border-[#d7e0e5] bg-gradient-to-r from-[#064f5d] via-[#0a6e7d] to-[#0d8a9a] shadow-[0_4px_16px_rgba(6,79,93,0.12)]">
          <div className="relative px-6 py-6 sm:px-7 sm:py-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.03]" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[24px] font-bold text-white sm:text-[28px]">
                  <Link to={`/hackathons/${detail.eventId}`} className="hover:underline">{detail.eventName}</Link>
                </h1>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#80deea]">
                <Link to={`/teams/${detail.teamId}`} className="inline-flex items-center gap-1.5 hover:underline"><Users size={14} />{detail.teamName}</Link>
                {detail.roundName && <span className="inline-flex items-center gap-1.5"><Clock size={14} />Round {detail.roundNo}: {detail.roundName}</span>}
                {detail.trackTitle && <span className="inline-flex items-center gap-1.5"><FileText size={14} />{detail.trackTitle}</span>}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#b2ebf2]">
                <span>Registered {formatDate(detail.createdAt)}</span>
                {detail.members && <span>{detail.members.length} member{detail.members.length !== 1 ? 's' : ''}</span>}
                {detail.topicTitle && <span>Topic: {detail.topicTitle}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="rounded-xl border border-[#d7e0e5] bg-white">
          {/* Tab nav */}
          <div className="flex border-b border-[#d7e0e5] px-6 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium cursor-pointer whitespace-nowrap transition-colors sm:px-5',
                    activeTab === tab.key ? 'text-[#1565c0]' : 'text-[#7a8e99] hover:text-[#1f2f3a]',
                  )}
                >
                  <Icon size={16} />
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab detail={detail} />}
            {activeTab === 'rounds' && <RoundsTab eventId={detail.eventId} registerTeamId={registerTeamId} members={detail.members} currentUserId={currentUserId} />}
            {activeTab === 'awards' && <AwardsTab eventId={detail.eventId} />}
            {activeTab === 'assignments' && <AssignmentsTab eventId={detail.eventId} />}
            {activeTab === 'leaderboard' && <LeaderboardTab eventId={detail.eventId} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Overview                                                           */
/* ================================================================== */

function OverviewTab({ detail }) {
  return (
    <div className="space-y-5">
      <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
        <LinkRow icon={Calendar} label="Event" to={`/hackathons/${detail.eventId}`} value={detail.eventName} accent="#3b82f6" />
        <LinkRow icon={Users} label="Team" to={`/teams/${detail.teamId}`} value={detail.teamName} accent="#10b981" />
        {detail.roundName && <DetailRow icon={Clock} label="Round" value={`#${detail.roundNo} ${detail.roundName}`} accent="#f59e0b" />}
        {detail.trackTitle && <DetailRow icon={FileText} label="Track" value={detail.trackTitle} accent="#8b5cf6" />}
        {detail.topicTitle && <DetailRow icon={FileText} label="Topic" value={detail.topicTitle} accent="#8b5cf6" />}
        <DetailRow icon={Calendar} label="Registered" value={formatDateTime(detail.createdAt)} accent="#8a9ba6" />
      </div>

      {/* Members */}
      {detail.members && detail.members.length > 0 && (
        <div>
          <p className="mb-3 text-[13px] font-bold text-[#1f2f3a]">{detail.members.length} Member{detail.members.length !== 1 ? 's' : ''}</p>
          <div className="space-y-2.5">
            {detail.members.map((m) => (
              <div key={m.userId} className="flex items-center gap-4 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
                <Avatar src={m.avatarUrl} name={`${m.firstName} ${m.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{m.firstName} {m.lastName}</p>
                    {m.isLeader && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[10px] font-semibold text-[#e65100] ring-1 ring-orange-200/60">
                        <Crown size={10} />
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[12px] text-[#8a9ba6]">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="mb-3 text-[13px] font-bold text-[#1f2f3a]">Description</p>
        {detail.description ? (
          <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-5">
            <RichTextViewer content={detail.description} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#e8ecf0] bg-[#fafbfc] py-12">
            <FileText size={24} className="mb-2 text-[#8a9ba6]" />
            <p className="text-[13px] text-[#7a8e99]">No description provided.</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Rounds                                                             */
/* ================================================================== */

function RoundsTab({ eventId, registerTeamId, members, currentUserId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 10

  // Submissions state: roundId → submission info
  const [submissions, setSubmissions] = useState({})

  // Modal states
  const [viewRoundId, setViewRoundId] = useState(null)
  const [submitModalRound, setSubmitModalRound] = useState(null)
  const [viewSubModalRound, setViewSubModalRound] = useState(null)
  const [viewSubDetail, setViewSubDetail] = useState(null)
  const [viewSubLoading, setViewSubLoading] = useState(false)
  const [viewSubError, setViewSubError] = useState('')

  // Fetch rounds
  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchRounds() {
      setLoading(true)
      try {
        const result = await getStudentRounds(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) { setRounds(result.rounds || []); setTotalCount(result.totalCount || 0) }
      } catch { if (!cancelled) setRounds([]) }
      finally { if (!cancelled) setLoading(false) }
    }
    fetchRounds()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  // Fetch submissions for all rounds
  useEffect(() => {
    if (!registerTeamId) return
    let cancelled = false
    async function fetchSubmissions() {
      try {
        const result = await getStudentTeamSubmissions(registerTeamId)
        if (!cancelled && result?.items) {
          const map = {}
          result.items.forEach((item) => {
            if (item.roundId && item.lastSubmission) {
              map[item.roundId] = item
            }
          })
          setSubmissions(map)
        }
      } catch { /* ignore */ }
    }
    fetchSubmissions()
    return () => { cancelled = true }
  }, [registerTeamId])

  // Check if current user is team leader
  const isLeader = members?.some((m) => m.userId === currentUserId && m.isLeader) || false

  const totalPages = Math.ceil(totalCount / pageSize)

  function isRoundActive(round) {
    if (!round.startTime || !round.endTime) return true
    const now = new Date()
    return now >= new Date(round.startTime) && now <= new Date(round.endTime)
  }

  async function handleViewSubmission(roundId) {
    const sub = submissions[roundId]
    if (!sub?.lastSubmission?.id) return
    setViewSubModalRound(roundId)
    setViewSubDetail(null)
    setViewSubError('')
    setViewSubLoading(true)
    try {
      const detail = await getStudentSubmissionDetail(sub.lastSubmission.id)
      setViewSubDetail(detail)
    } catch (err) {
      setViewSubError(err?.response?.data?.message || 'Failed to load submission detail.')
    } finally {
      setViewSubLoading(false)
    }
  }

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />)}</div>

  if (rounds.length === 0) return (
    <div className="flex flex-col items-center justify-center py-12">
      <Layers size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No rounds yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-3">
        {rounds.map((round) => {
          const hasSubmission = !!submissions[round.id]?.lastSubmission
          const roundActive = isRoundActive(round)
          return (
            <div key={round.id} className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">#{round.roundNo} {round.name}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                  <span className="inline-flex items-center gap-1"><Calendar size={12} className="text-[#8a9ba6]" />{round.startTime ? formatDate(round.startTime) : '—'} – {round.endTime ? formatDate(round.endTime) : '—'}</span>
                  <span className="inline-flex items-center gap-1"><Users size={12} className="text-[#8a9ba6]" />{round.limitTeam ?? '—'} teams</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {/* View round detail — always active */}
                <button
                  type="button"
                  onClick={() => setViewRoundId(round.id)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#1f78d1] transition-colors hover:bg-[#f0f7ff] hover:border-[#1f78d1]/30"
                >
                  <Eye size={15} />
                  View
                </button>

                {/* Submit button — only for leader */}
                {isLeader && (
                  <button
                    type="button"
                    onClick={() => roundActive && setSubmitModalRound(round.id)}
                    disabled={!roundActive}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors',
                      roundActive
                        ? 'cursor-pointer bg-[#1565c0] text-white hover:bg-[#0d47a1]'
                        : 'cursor-not-allowed bg-[#90caf9] text-white',
                    )}
                  >
                    <Upload size={15} />
                    Submit
                  </button>
                )}

                {/* View submission button — only if submitted */}
                {hasSubmission && (
                  <button
                    type="button"
                    onClick={() => roundActive && handleViewSubmission(round.id)}
                    disabled={!roundActive}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors',
                      roundActive
                        ? 'cursor-pointer border-[#d7e0e5] bg-white text-[#10b981] hover:bg-[#f0fdf4] hover:border-[#10b981]/30'
                        : 'cursor-not-allowed border-[#e8ecf0] bg-gray-50 text-[#b0bec5]',
                    )}
                  >
                    <FileText size={15} />
                    View Submission
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {totalPages > 1 && <div className="mt-5"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}

      {/* Round Detail Modal */}
      <RoundDetailModal
        roundId={viewRoundId}
        onClose={() => setViewRoundId(null)}
      />

      {/* Submit Modal */}
      <SubmitModal
        open={!!submitModalRound}
        roundId={submitModalRound}
        registerTeamId={registerTeamId}
        onClose={() => setSubmitModalRound(null)}
        onSuccess={() => {
          setSubmitModalRound(null)
          // Re-fetch submissions
          getStudentTeamSubmissions(registerTeamId).then((result) => {
            if (result?.items) {
              const map = { ...submissions }
              result.items.forEach((item) => {
                if (item.roundId && item.lastSubmission) {
                  map[item.roundId] = item
                }
              })
              setSubmissions(map)
            }
          }).catch(() => {})
        }}
      />

      {/* View Submission Modal */}
      <ViewSubmissionModal
        open={!!viewSubModalRound}
        onClose={() => { setViewSubModalRound(null); setViewSubDetail(null); setViewSubError('') }}
        loading={viewSubLoading}
        error={viewSubError}
        submissionDetail={viewSubDetail}
      />
    </div>
  )
}

/* ================================================================== */
/*  Awards                                                             */
/* ================================================================== */

const AWARD_LEVELS = {
  1: { label: '1st Prize', color: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300/60' },
  2: { label: '2nd Prize', color: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300/60' },
  3: { label: '3rd Prize', color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300/60' },
}

function AwardsTab({ eventId }) {
  const [awards, setAwards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchAwards() {
      setLoading(true)
      try {
        const result = await getStudentAwards(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) { setAwards(result.awards || []); setTotalCount(result.totalCount || 0) }
      } catch { if (!cancelled) setAwards([]) }
      finally { if (!cancelled) setLoading(false) }
    }
    fetchAwards()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  function formatPrize(amount) {
    if (amount == null) return '—'
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />)}</div>

  if (awards.length === 0) return (
    <div className="flex flex-col items-center justify-center py-12">
      <Award size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No awards yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-3">
        {awards.map((award) => {
          const levelStyle = AWARD_LEVELS[award.levelAward] || { label: `${award.levelAward} Prize`, color: 'bg-white text-slate-500 ring-1 ring-slate-200/60' }
          return (
            <div key={award.id} className="flex items-center gap-4 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-sm">
                <Award size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{award.name}</h4>
                  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold', levelStyle.color)}>{levelStyle.label}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                  <span>{award.numberOfAward ?? '—'} winner{award.numberOfAward > 1 ? 's' : ''}</span>
                  <span className="font-semibold text-[#f59e0b]">{formatPrize(award.prize)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {totalPages > 1 && <div className="mt-5"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
    </div>
  )
}

/* ================================================================== */
/*  Assignments                                                        */
/* ================================================================== */

function AssignmentsTab({ eventId }) {
  const [judges, setJudges] = useState([])
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      try {
        const [j, m] = await Promise.all([
          getStudentEventAssignments(eventId, { EventRole: 'Judge', PageSize: 100 }),
          getStudentEventAssignments(eventId, { EventRole: 'Mentor', PageSize: 100 }),
        ])
        if (!cancelled) { setJudges(j.items || []); setMentors(m.items || []) }
      } catch { if (!cancelled) { setJudges([]); setMentors([]) } }
      finally { if (!cancelled) setLoading(false) }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [eventId])

  if (loading) return <div className="space-y-6">{[1, 2].map((g) => <div key={g}><div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200" /><div className="grid grid-cols-1 gap-2 lg:grid-cols-2">{[1, 2].map((i) => <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />)}</div></div>)}</div>

  if (!judges.length && !mentors.length) return (
    <div className="flex flex-col items-center justify-center py-12">
      <UsersRound size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No assignments yet.</p>
    </div>
  )

  function PersonCard({ person }) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
        <Avatar src={person.avatarUrl} name={`${person.firstName} ${person.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{person.firstName} {person.lastName}</p>
          <p className="truncate text-[12px] text-[#8a9ba6]">{person.email}</p>
          {person.assignTracks?.length > 0 && (
            <p className="mt-0.5 truncate text-[11px] text-[#1565c0]">{person.assignTracks.filter(t => !t.isDisable).map(t => t.title).join(', ')}</p>
          )}
        </div>
      </div>
    )
  }

  function GroupBlock({ title, items }) {
    if (!items.length) return null
    return (
      <div className="mb-6 last:mb-0">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">{title}</h3>
          <span className="rounded-md bg-[#f0f0f0] px-2 py-0.5 text-[12px] font-semibold text-[#5a6a73]">{items.length} person{items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((p) => <PersonCard key={p.assignEventId} person={p} />)}
        </div>
      </div>
    )
  }

  return <div className="space-y-6"><GroupBlock title="Judge" items={judges} /><GroupBlock title="Mentor" items={mentors} /></div>
}

/* ================================================================== */
/*  Leaderboard                                                        */
/* ================================================================== */

function LeaderboardTab({ eventId }) {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [expandedTeam, setExpandedTeam] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchLb() {
      setLoading(true)
      try {
        const result = await getStudentEventLeaderboard(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) { setItems(result.items || []); setTotalCount(result.totalCount || 0) }
      } catch { if (!cancelled) setItems([]) }
      finally { if (!cancelled) setLoading(false) }
    }
    fetchLb()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)
  const LB_COLORS = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-teal-600']

  function getInitials(name) { if (!name) return '?'; return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() }
  function getColor(id) { if (!id) return LB_COLORS[0]; const idx = String(id).split('').reduce((s, c) => s + c.charCodeAt(0), 0); return LB_COLORS[idx % LB_COLORS.length] }
  function RankIcon({ rank }) {
    if (rank === 1) return <Trophy size={20} className="text-[#d97706]" fill="#d97706" />
    if (rank === 2) return <Trophy size={20} className="text-[#64748b]" fill="#64748b" />
    if (rank === 3) return <Award size={20} className="text-[#ea580c]" />
    return <span className="text-[14px] font-bold text-[#5a6a73] w-5 text-center">#{rank}</span>
  }

  if (loading) return <div className="space-y-2.5">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />)}</div>

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center py-12">
      <MapPin size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No leaderboard data yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-2.5">
        {items.map((team) => {
          const isExpanded = expandedTeam === team.registerTeamId
          return (
            <div key={team.registerTeamId} className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white">
              <button type="button" onClick={() => setExpandedTeam(isExpanded ? null : team.registerTeamId)} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#fafbfc]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8]"><RankIcon rank={team.rank} /></div>
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-[13px] font-bold', getColor(team.teamId))}>{getInitials(team.teamName)}</div>
                <div className="flex-1 min-w-0"><p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{team.teamName}</p>{team.trackTitle && <p className="truncate text-[11px] text-[#8a9ba6]">{team.trackTitle}{team.topicTitle ? ` · ${team.topicTitle}` : ''}</p>}</div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className={cn('text-[20px] font-bold leading-none', team.rank === 1 ? 'text-[#b45309]' : team.rank === 2 ? 'text-[#475569]' : team.rank === 3 ? 'text-[#c2410c]' : 'text-[#064f5d]')}>{team.eventScore?.toFixed(1)}</span>
                  <span className="text-[9px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">PTS</span>
                </div>
              </button>
              {isExpanded && team.roundScores?.length > 0 && (
                <div className="border-t border-[#f0f4f8] bg-[#fafbfc] px-4 py-3">
                  <div className="space-y-1.5">
                    {team.roundScores.map((rs) => (
                      <div key={rs.roundNo} className="flex items-center justify-between px-2 py-1">
                        <span className="text-[12px] text-[#5a6a73]">Round {rs.roundNo}: {rs.roundName}</span>
                        <span className="text-[13px] font-semibold text-[#1f2f3a]">{rs.scopeScore?.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {totalPages > 1 && <div className="mt-5"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
    </div>
  )
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#1f2f3a]">{value}</span>
    </div>
  )
}

function LinkRow({ icon: Icon, label, value, to, accent }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <Link to={to} className="text-[13px] font-semibold text-[#1565c0] transition-colors hover:underline">{value} &rarr;</Link>
    </div>
  )
}

/* ================================================================== */
/*  Round Detail Modal                                                 */
/* ================================================================== */

function RoundDetailModal({ roundId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentRoundDetail(roundId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load round details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [roundId])

  if (!roundId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Layers className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.name || 'Round Detail'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              {/* Info rows */}
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Calendar} label="Start Time" value={formatDateTime(detail.startTime)} accent="#3b82f6" />
                <DetailRow icon={Calendar} label="End Time" value={formatDateTime(detail.endTime)} accent="#ef4444" />
                {detail.startSubmission && (
                  <DetailRow icon={Clock} label="Submission Start" value={formatDateTime(detail.startSubmission)} accent="#10b981" />
                )}
                {detail.endSubmission && (
                  <DetailRow icon={Clock} label="Submission End" value={formatDateTime(detail.endSubmission)} accent="#f59e0b" />
                )}
                <DetailRow icon={Users} label="Max Teams" value={detail.limitTeam ?? '—'} accent="#8b5cf6" />
              </div>

              {/* Description */}
              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Submit Modal                                                       */
/* ================================================================== */

function SubmitModal({ open, roundId, registerTeamId, onClose, onSuccess }) {
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setUrl('')
      setDescription('')
      setError('')
    }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a submission URL.')
      return
    }
    if (!roundId || !registerTeamId) return
    setSubmitting(true)
    setError('')
    try {
      await submitStudentSubmission({
        registerTeamId,
        roundId,
        url: url.trim(),
        description: description.trim() || undefined,
      })
      toast.success('Submission submitted successfully!')
      onSuccess()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit. Please try again.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Upload className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Submit Submission</h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
              Submission URL <span className="text-[#c62828]">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/submission.pdf"
              className="w-full rounded-lg border border-[#d7e0e5] px-4 py-2.5 text-[14px] text-[#1f2f3a] outline-none transition-colors placeholder:text-[#9aaab5] focus:border-[#1565c0] focus:ring-2 focus:ring-[#1565c0]/10"
              disabled={submitting}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
              Description <span className="text-[#7a8e99] text-[12px]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional notes about your submission..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#d7e0e5] px-4 py-2.5 text-[14px] text-[#1f2f3a] outline-none transition-colors placeholder:text-[#9aaab5] focus:border-[#1565c0] focus:ring-2 focus:ring-[#1565c0]/10"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5a6a73] transition-colors hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1565c0] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  View Submission Modal                                              */
/* ================================================================== */

function ViewSubmissionModal({ open, onClose, loading, error, submissionDetail }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f5e9]">
              <FileText className="h-5 w-5 text-[#10b981]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Submission</h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : submissionDetail ? (
            <div className="space-y-5">
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Layers} label="Round" value={submissionDetail.roundName || '—'} accent="#3b82f6" />
                <DetailRow icon={Users} label="Team" value={submissionDetail.teamName || '—'} accent="#10b981" />
                {submissionDetail.trackTitle && (
                  <DetailRow icon={FileText} label="Track" value={submissionDetail.trackTitle} accent="#8b5cf6" />
                )}
                {submissionDetail.topicTitle && (
                  <DetailRow icon={FileText} label="Topic" value={submissionDetail.topicTitle} accent="#8b5cf6" />
                )}
                <DetailRow icon={UserRound} label="Submitted by" value={`${submissionDetail.submittedBy?.firstName || ''} ${submissionDetail.submittedBy?.lastName || ''}`.trim() || '—'} accent="#f59e0b" />
                <DetailRow icon={Calendar} label="Submitted at" value={formatDateTime(submissionDetail.submittedAt)} accent="#8a9ba6" />
              </div>

              {/* URL */}
              <div>
                <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Submission URL</p>
                <a
                  href={submissionDetail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-[#fafbfc] px-4 py-2.5 text-[13px] font-medium text-[#1565c0] transition-colors hover:bg-[#f0f7ff] hover:border-[#1565c0]/30"
                >
                  <ExternalLink size={14} />
                  {submissionDetail.url}
                </a>
              </div>

              {/* Description */}
              {submissionDetail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <p className="text-[14px] text-[#5a6a73] leading-relaxed">{submissionDetail.description}</p>
                </div>
              )}

              {/* Status + Score */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 rounded-xl border border-[#e8ecf0] bg-[#fafbfc] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a9ba6]">Status</p>
                  <p className={cn(
                    'mt-1 text-[15px] font-bold',
                    submissionDetail.status === 'Graded' ? 'text-[#10b981]' : 'text-[#f59e0b]',
                  )}>
                    {submissionDetail.status === 'Graded' ? 'Graded' : 'Submitted'}
                  </p>
                </div>
                {submissionDetail.totalScore != null && (
                  <div className="flex-1 rounded-xl border border-[#e8ecf0] bg-[#fafbfc] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a9ba6]">Score</p>
                    <p className="mt-1 text-[18px] font-bold text-[#064f5d]">{submissionDetail.totalScore.toFixed(2)}</p>
                    {submissionDetail.judgeCount > 0 && (
                      <p className="text-[11px] text-[#8a9ba6]">{submissionDetail.judgeCount} judge{submissionDetail.judgeCount > 1 ? 's' : ''}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#7a8e99]">No submission data available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
