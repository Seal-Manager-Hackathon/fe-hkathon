import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Users, Calendar, Edit3, LogOut,
  UserCog, Check, X, FileText, Send,
} from 'lucide-react'
import {
  getStudentTeamDetail,
  updateStudentTeam,
  disbandStudentTeam,
  leaveStudentTeam,
  kickStudentTeamMember,
  changeStudentTeamLeader,
} from '../../../api/student'
import { cn } from '../../../utils/cn'
import { toast, confirm } from '../../../utils/toast'
import { useAuth } from '../../../context/AuthContext'
import TeamMembersSection from './TeamMembersSection'
import TeamEventsSection from './TeamEventsSection'
import InviteModal from './InviteModal'
import ChangeLeaderModal from './ChangeLeaderModal'
import TeamInvitationsSection from './TeamInvitationsSection'
import TeamRegistrationsSection from './TeamRegistrationsSection'

const TABS = [
  { key: 'members', label: 'Members', icon: Users },
  { key: 'events', label: 'Events', icon: Calendar },
  { key: 'registrations', label: 'Registrations', icon: FileText },
  { key: 'invitations', label: 'Invitations', icon: Send },
]

export default function TeamDetailPage() {
  const { teamId } = useParams()
  const { user } = useAuth()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('members')

  const currentUserId = user?.id
  const isCurrentUserLeader = detail?.members?.some((m) => m.userId === currentUserId && m.isLeader) ?? false

  // Edit name
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')

  // Change leader
  const [showChangeLeader, setShowChangeLeader] = useState(false)

  // Invitations
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteVersion, setInviteVersion] = useState(0)

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
          if (err?.response?.status === 404) setError('Team does not exist')
          else setError(err?.response?.data?.message || 'Cannot load team information.')
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
    try {
      await updateStudentTeam(detail.id, { name: newName.trim() })
      setEditingName(false)
      setDetail((prev) => prev ? { ...prev, name: newName.trim() } : prev)
      toast.success('Team renamed successfully.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot update team name.')
    }
  }

  async function handleDisband() {
    if (!detail) return
    const ok = await confirm('Disband Team', `Are you sure you want to disband "${detail.name}"? This cannot be undone.`)
    if (!ok) return
    try {
      await disbandStudentTeam(detail.id)
      toast.success('Team disbanded successfully.')
      setDetail(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot disband team.')
    }
  }

  async function handleLeave() {
    if (!detail) return
    const ok = await confirm('Leave Team', `Are you sure you want to leave "${detail.name}"?`)
    if (!ok) return
    try {
      await leaveStudentTeam(detail.id)
      toast.success('You left the team.')
      setDetail(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot leave team.')
    }
  }

  async function handleKick(memberId) {
    if (!detail) return
    const memberName = detail.members?.find((m) => m.userId === memberId)
    const nameStr = memberName ? `${memberName.firstName} ${memberName.lastName}` : 'this member'
    const ok = await confirm('Kick Member', `Are you sure you want to kick ${nameStr} from "${detail.name}"?`)
    if (!ok) return
    try {
      await kickStudentTeamMember(detail.id, memberId)
      toast.success('Member removed from team.')
      refresh()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot kick member.')
    }
  }

  async function handleChangeLeader(newLeaderUserId) {
    if (!detail) return
    const ok = await confirm('Change Team Leader', 'Are you sure you want to transfer leadership to this member?')
    if (!ok) return
    try {
      await changeStudentTeamLeader(detail.id, newLeaderUserId)
      setShowChangeLeader(false)
      toast.success('Team leader changed successfully.')
      refresh()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cannot transfer leader role.')
    }
  }

  function handleInviteSent() {
    setActiveTab('invitations')
    setInviteVersion((v) => v + 1)
    toast.success('Invitation sent successfully.')
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

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#d7e0e5] bg-gradient-to-r from-[#064f5d] via-[#0a6e7d] to-[#0d8a9a] shadow-[0_4px_16px_rgba(6,79,93,0.12)]">
        <div className="relative px-6 py-6 sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.03]" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="relative shrink-0 self-center sm:self-start">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/20 text-[18px] font-bold leading-none tracking-wide text-white shadow-sm backdrop-blur sm:h-[68px] sm:w-[68px] sm:text-[22px]">
                {detail?.name ? detail.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() : '?'}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-[18px] font-bold text-white outline-none backdrop-blur focus:border-white/60 sm:text-[22px]" autoFocus />
                      <button onClick={handleUpdateName} className="cursor-pointer rounded-lg p-1.5 text-green-300 hover:bg-white/10"><Check size={18} /></button>
                      <button onClick={() => setEditingName(false)} className="cursor-pointer rounded-lg p-1.5 text-white/60 hover:bg-white/10"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-[22px] font-bold leading-tight text-white sm:text-[26px]">{detail?.name}</h1>
                      {isCurrentUserLeader && (
                        <button onClick={() => { setNewName(detail?.name || ''); setEditingName(true) }} className="cursor-pointer rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white" title="Rename team"><Edit3 size={15} /></button>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#80deea]">
                  <span className="inline-flex items-center gap-1.5"><Users size={14} />{detail?.members?.length || 0} member{(detail?.members?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {isCurrentUserLeader && (
                  <button onClick={() => setShowInviteModal(true)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/30">
                    <Send size={14} /> Invite
                  </button>
                )}
                {isCurrentUserLeader && (
                  <button onClick={() => setShowChangeLeader(true)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/30">
                    <UserCog size={14} /> Change Leader
                  </button>
                )}
                <button onClick={handleLeave} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/20">
                  <LogOut size={14} /> Leave
                </button>
                {isCurrentUserLeader && (
                  <button onClick={handleDisband} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-400/30 bg-red-500/20 px-4 py-2 text-[13px] font-semibold text-red-200 backdrop-blur transition-colors hover:bg-red-500/30">
                    <Users size={14} /> Disband
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="rounded-xl border border-[#d7e0e5] bg-white">
        <div className="flex border-b border-[#d7e0e5] px-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn('relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium cursor-pointer whitespace-nowrap transition-colors', activeTab === tab.key ? 'text-[#1565c0]' : 'text-[#7a8e99] hover:text-[#1f2f3a]')}
              >
                <Icon size={16} />
                {tab.label}
                {activeTab === tab.key && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'members' && (
            <TeamMembersSection members={detail?.members} teamId={detail?.id} isCurrentUserLeader={isCurrentUserLeader} onKick={handleKick} />
          )}
          {activeTab === 'events' && <TeamEventsSection teamId={detail?.id} />}
          {activeTab === 'registrations' && <TeamRegistrationsSection teamId={detail?.id} />}
          {activeTab === 'invitations' && <TeamInvitationsSection key={inviteVersion} teamId={detail?.id} />}
        </div>
      </div>

      <InviteModal teamId={detail?.id} open={showInviteModal} onClose={() => setShowInviteModal(false)} onSent={handleInviteSent} />
      <ChangeLeaderModal open={showChangeLeader} members={detail?.members} onClose={() => setShowChangeLeader(false)} onSelect={handleChangeLeader} />
    </div>
  )
}

/* ================================================================== */
/*  Members                                                            */
/* ================================================================== */



