import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Users, Calendar, Crown, FileText, Clock,
  Info, UserRound, Layers, Award, MapPin, UsersRound,
  Trophy,
} from 'lucide-react'
import {
  getStudentRegisterTeamDetail,
  getStudentRounds,
  getStudentAwards,
  getStudentEventLeaderboard,
  getStudentEventAssignments,
} from '../../../api/student'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import { formatDate, formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import Pagination from '../../../components/Pagination'

const TABS = [
  { key: 'overview', label: 'Overview', icon: Info },
  { key: 'description', label: 'Description', icon: FileText },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'rounds', label: 'Rounds', icon: Layers },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'assignments', label: 'Assignments', icon: UsersRound },
  { key: 'leaderboard', label: 'Leaderboard', icon: MapPin },
]

export default function RegisterTeamDetailPage() {
  const { registerTeamId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

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
          if (err?.response?.status === 404) setError('Không tìm thấy')
          else setError(err?.response?.data?.message || 'Không thể tải thông tin.')
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
            {activeTab === 'description' && <DescriptionTab detail={detail} />}
            {activeTab === 'members' && <MembersTab members={detail.members} />}
            {activeTab === 'rounds' && <RoundsTab eventId={detail.eventId} />}
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
        <DetailRow icon={Users} label="Members" value={detail.members?.length || 0} accent="#10b981" />
        <DetailRow icon={Calendar} label="Registered" value={formatDateTime(detail.createdAt)} accent="#8a9ba6" />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Description                                                        */
/* ================================================================== */

function DescriptionTab({ detail }) {
  return (
    <div>
      {detail.description ? (
        <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-5">
          <RichTextViewer content={detail.description} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText size={24} className="mb-2 text-[#8a9ba6]" />
          <p className="text-[13px] text-[#7a8e99]">No description provided.</p>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Members                                                            */
/* ================================================================== */

function MembersTab({ members }) {
  return (
    <div className="space-y-2.5">
      {members && members.length > 0 ? (
        members.map((m) => (
          <div key={m.userId} className="flex items-center gap-4 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3 transition-colors hover:border-[#d7e0e5]">
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
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <UserRound size={24} className="mb-2 text-[#8a9ba6]" />
          <p className="text-[13px] text-[#7a8e99]">No members found.</p>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Rounds                                                             */
/* ================================================================== */

function RoundsTab({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 10

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

  const totalPages = Math.ceil(totalCount / pageSize)

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
        {rounds.map((round) => (
          <div key={round.id} className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{round.name}</h4>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                <span className="inline-flex items-center gap-1"><Calendar size={12} className="text-[#8a9ba6]" />{round.startTime ? formatDate(round.startTime) : '—'} – {round.endTime ? formatDate(round.endTime) : '—'}</span>
                <span className="inline-flex items-center gap-1"><Users size={12} className="text-[#8a9ba6]" />{round.limitTeam ?? '—'} teams</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && <div className="mt-5"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
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
