import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Users, Calendar, Crown, Shield, Edit3, LogOut,
  UserMinus, UserCog, Check, X, FileText,
} from 'lucide-react'
import {
  getStudentTeamDetail,
  getStudentTeamEvents,
  updateStudentTeam,
  disbandStudentTeam,
  leaveStudentTeam,
  kickStudentTeamMember,
  changeStudentTeamLeader,
} from '../../../api/student'
import Pagination from '../../../components/Pagination'
import Avatar from '../../../components/Avatar'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'

export default function TeamDetailPage() {
  const { teamId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('members')
  const [actionMsg, setActionMsg] = useState('')

  // Edit name
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')

  // Change leader
  const [changingLeader, setChangingLeader] = useState(null)

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentTeamDetail(teamId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) setError('Team không tồn tại')
          else setError(err?.response?.data?.message || 'Không thể tải thông tin team.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [teamId])

  function refresh() {
    if (!teamId) return
    getStudentTeamDetail(teamId).then(setDetail).catch(() => {})
  }

  async function handleUpdateName() {
    if (!newName.trim() || !detail) return
    setActionMsg('')
    try {
      await updateStudentTeam(detail.id, { name: newName.trim() })
      setEditingName(false)
      setDetail((prev) => prev ? { ...prev, name: newName.trim() } : prev)
      setActionMsg('Team renamed successfully.')
    } catch (err) {
      setActionMsg(err?.response?.data?.message || 'Không thể cập nhật tên team.')
    }
  }

  async function handleDisband() {
    if (!detail) return
    setActionMsg('')
    try {
      await disbandStudentTeam(detail.id)
      setDetail(null)
    } catch (err) {
      setActionMsg(err?.response?.data?.message || 'Không thể giải thể team.')
    }
  }

  async function handleLeave() {
    if (!detail) return
    setActionMsg('')
    try {
      await leaveStudentTeam(detail.id)
      setDetail(null)
    } catch (err) {
      setActionMsg(err?.response?.data?.message || 'Không thể rời team.')
    }
  }

  async function handleKick(memberId) {
    if (!detail) return
    setActionMsg('')
    try {
      await kickStudentTeamMember(detail.id, memberId)
      refresh()
    } catch (err) {
      setActionMsg(err?.response?.data?.message || 'Không thể kick member.')
    }
  }

  async function handleChangeLeader(newLeaderUserId) {
    if (!detail) return
    setActionMsg('')
    try {
      await changeStudentTeamLeader(detail.id, newLeaderUserId)
      setChangingLeader(null)
      refresh()
    } catch (err) {
      setActionMsg(err?.response?.data?.message || 'Không thể chuyển quyền leader.')
    }
  }

  // Disbanded / left state
  if (detail === null && !loading && !error) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <Link to="/teams" className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
          <ArrowLeft size={16} /> Back to My Teams
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af]">
            <Users size={28} />
          </div>
          <p className="text-[17px] font-semibold text-[#1f2f3a]">You are no longer in this team.</p>
          <Link to="/teams" className="mt-2 text-[14px] font-medium text-[#1565c0] hover:underline">&larr; Back to My Teams</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-[60px] animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <Link to="/teams" className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
          <ArrowLeft size={16} /> Back to My Teams
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
            <FileText size={28} />
          </div>
          <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
          <Link to="/teams" className="mt-2 text-[14px] font-medium text-[#1565c0] hover:underline">&larr; Back to My Teams</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Back link */}
      <Link to="/teams" className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
        <ArrowLeft size={16} /> Back to My Teams
      </Link>

      {/* Action message */}
      {actionMsg && (
        <div className={cn('mb-4 rounded-lg border px-4 py-3 text-[14px]', actionMsg.includes('successfully') ? 'border-[#c8e6c9] bg-[#e8f5e9] text-[#2e7d32]' : 'border-[#fce4ec] bg-[#fff5f5] text-[#c62828]')}>
          {actionMsg}
        </div>
      )}

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#d7e0e5] bg-white">
        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-start sm:gap-6 sm:px-7 sm:py-7">
          {/* Avatar */}
          <div className="relative shrink-0 self-center sm:self-start">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#1565c0] to-[#42a5f5] text-[18px] font-bold leading-none tracking-wide text-white shadow-sm sm:h-[68px] sm:w-[68px] sm:text-[22px]">
              {detail?.name ? detail.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() : '?'}
            </div>
          </div>

          {/* Right */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Title row */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="rounded-lg border border-[#d7e0e5] px-3 py-1.5 text-[18px] font-bold text-[#1f2f3a] outline-none focus:border-[#1565c0] sm:text-[22px]"
                      autoFocus
                    />
                    <button onClick={handleUpdateName} className="cursor-pointer rounded-lg p-1.5 text-green-600 hover:bg-green-50"><Check size={18} /></button>
                    <button onClick={() => setEditingName(false)} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-[22px] font-bold leading-tight text-[#1f2f3a] sm:text-[26px]">{detail?.name}</h1>
                    <button
                      onClick={() => { setNewName(detail?.name || ''); setEditingName(true) }}
                      className="cursor-pointer rounded-lg p-1.5 text-[#8a9ba6] transition-colors hover:bg-gray-100 hover:text-[#1565c0]"
                      title="Rename team"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#5a6a73]">
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} className="text-[#8a9ba6]" />
                  {detail?.members?.length || 0} member{(detail?.members?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleLeave}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#e65100] transition-colors hover:bg-[#fff3e0]"
              >
                <LogOut size={14} />
                Leave
              </button>
              <button
                onClick={handleDisband}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#dc2626] transition-colors hover:bg-[#fee2e2]"
              >
                <Users size={14} />
                Disband
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="rounded-xl border border-[#d7e0e5] bg-white">
        {/* Tab nav */}
        <div className="flex border-b border-[#d7e0e5] px-6">
          <button
            onClick={() => setActiveTab('members')}
            className={cn('relative px-4 py-3 text-[13px] font-medium transition-colors cursor-pointer', activeTab === 'members' ? 'text-[#1565c0]' : 'text-[#7a8e99] hover:text-[#1f2f3a]')}
          >
            Members
            {activeTab === 'members' && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={cn('relative px-4 py-3 text-[13px] font-medium transition-colors cursor-pointer', activeTab === 'events' ? 'text-[#1565c0]' : 'text-[#7a8e99] hover:text-[#1f2f3a]')}
          >
            Events
            {activeTab === 'events' && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />}
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'members' && (
            <TeamMembersSection
              members={detail?.members}
              teamId={detail?.id}
              onKick={handleKick}
              changingLeader={changingLeader}
              setChangingLeader={setChangingLeader}
              onChangeLeader={handleChangeLeader}
            />
          )}
          {activeTab === 'events' && <TeamEventsSection teamId={detail?.id} />}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Members                                                            */
/* ------------------------------------------------------------------ */

function TeamMembersSection({ members, teamId, onKick, changingLeader, setChangingLeader, onChangeLeader }) {
  const leader = members?.find((m) => m.isLeader)

  return (
    <div className="space-y-3">
      {/* Change leader picker */}
      {changingLeader && (
        <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
          <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Select new leader:</p>
          <div className="space-y-1.5">
            {members.filter((m) => !m.isLeader).map((m) => (
              <button
                key={m.userId}
                type="button"
                onClick={() => onChangeLeader(m.userId)}
                className="w-full cursor-pointer text-left rounded-lg border border-[#d7e0e5] bg-white px-3 py-2 text-[13px] font-medium text-[#1f2f3a] transition-colors hover:border-[#1565c0]/30 hover:bg-[#f0f7ff]"
              >
                {m.firstName} {m.lastName}
              </button>
            ))}
          </div>
          <button onClick={() => setChangingLeader(null)} className="mt-2 cursor-pointer text-[12px] text-[#8a9ba6] hover:underline">Cancel</button>
        </div>
      )}

      {members && members.length > 0 ? (
        members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar src={member.avatarUrl} name={`${member.firstName} ${member.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{member.firstName} {member.lastName}</p>
                  {member.isLeader && <Crown size={12} className="shrink-0 text-[#f59e0b]" />}
                </div>
                <p className="truncate text-[12px] text-[#8a9ba6]">{member.email}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {member.isLeader && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0] px-2.5 py-1 text-[11px] font-semibold text-[#e65100]">
                  <Shield size={11} />
                  Leader
                </span>
              )}
              {leader && !member.isLeader && (
                <>
                  <button
                    type="button"
                    onClick={() => setChangingLeader(member.userId)}
                    title="Transfer leadership"
                    className="cursor-pointer rounded-lg p-1.5 text-[#8a9ba6] transition-colors hover:bg-[#f0f7ff] hover:text-[#1565c0]"
                  >
                    <UserCog size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onKick(member.userId)}
                    title="Kick member"
                    className="cursor-pointer rounded-lg p-1.5 text-[#8a9ba6] transition-colors hover:bg-[#fee2e2] hover:text-[#dc2626]"
                  >
                    <UserMinus size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-[13px] text-[#7a8e99]">No members found.</p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */

function TeamEventsSection({ teamId }) {
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetchEvents() {
      setLoading(true)
      try {
        const result = await getStudentTeamEvents(teamId, { PageIndex: pageIndex, PageSize: 5 })
        if (!cancelled) {
          setEvents(result.items || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch {
        if (!cancelled) setEvents([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchEvents()
    return () => { cancelled = true }
  }, [teamId, pageIndex])

  const totalPages = Math.ceil(totalCount / 5)

  if (loading) return <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-[56px] animate-pulse rounded-lg bg-gray-100" />)}</div>

  if (events.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8">
      <Calendar size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No events joined yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-2">
        {events.map((event) => (
          <Link
            key={event.registerTeamId}
            to={`/hackathons/${event.eventId}`}
            className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-white px-4 py-3 transition-colors hover:bg-[#f0f7ff]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{event.eventName}</p>
              <p className="text-[12px] text-[#8a9ba6]">Registered {formatDate(event.createdAt)}</p>
            </div>
            <span className="shrink-0 text-[12px] text-[#1565c0] font-medium">View &rarr;</span>
          </Link>
        ))}
      </div>
      {totalPages > 1 && <div className="mt-3"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
    </div>
  )
}
