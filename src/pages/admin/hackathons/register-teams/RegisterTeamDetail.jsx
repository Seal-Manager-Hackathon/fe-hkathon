import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, Trophy, User, Crown, CircleCheck, Shield, Ban, ExternalLink, CheckCircle as CheckCircleIcon, XCircle } from 'lucide-react'
import { getRegisterTeamDetail, approveRegisterTeam, rejectRegisterTeam } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import Avatar from '../../../../components/Avatar'
import BaseTable from '../../../../components/BaseTable'
import PromptReason from '../../../../components/PromptReason'
import { toast, confirm } from '../../../../utils/toast'

const statusBadge = { Pending: 'bg-amber-50 text-amber-700 border border-amber-200', Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Rejected: 'bg-rose-50 text-rose-700 border border-rose-200' }
const statusIcon = { Pending: <Clock className="h-4 w-4 text-amber-600" />, Approved: <CircleCheck className="h-4 w-4 text-emerald-600" />, Rejected: <Shield className="h-4 w-4 text-rose-600" /> }

const memberColumns = [
  { key: 'member', header: 'Member', headerIcon: User, render: (row) => (<div className="flex items-center gap-3"><Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" /><div><p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p><p className="text-[12px] text-gray-400">{row.email}</p></div></div>) },
  { key: 'role', header: 'Role', headerIcon: Shield, render: (row) => row.isLeader ? (<div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5"><Crown className="h-3.5 w-3.5 text-[#ffca28]" /><span className="text-[12px] font-semibold text-[#e65100]">Leader</span></div>) : <span className="text-[13px] text-gray-400">Member</span> },
]

export default function RegisterTeamDetail() {
  const { registerTeamId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejecting, setRejecting] = useState(false)
  const [acting, setActing] = useState(false)

  async function fetchData() {
    setLoading(true); setError('')
    try {
      const result = await getRegisterTeamDetail(registerTeamId)
      setData(result)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load.')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [registerTeamId])

  async function handleApprove() {
    const ok = await confirm('Approve Registration', `Approve "${data.teamName}"?`)
    if (!ok) return
    setActing(true)
    try {
      await approveRegisterTeam(registerTeamId)
      toast.success('Registration approved')
      fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve.')
    } finally { setActing(false) }
  }

  function openReject() { setRejectTarget(data) }

  async function handleRejectSubmit(reason) {
    setRejecting(true)
    try {
      await rejectRegisterTeam(registerTeamId, { reason })
      toast.success('Registration rejected')
      setRejectTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject.')
    } finally { setRejecting(false) }
  }

  if (loading) return (<div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" /><div className="mb-6 flex items-center gap-5"><div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200" /><div className="space-y-2"><div className="h-7 w-48 animate-pulse rounded bg-gray-200" /><div className="h-4 w-72 animate-pulse rounded bg-gray-200" /></div></div><div className="h-80 animate-pulse rounded-xl bg-gray-100" /></div>)

  if (error) {
    const nf = error.includes('Not Found')
    return (<div className="flex min-h-[60vh] flex-col items-center justify-center"><div className="mb-4 rounded-full bg-rose-50 p-4"><Shield className="h-8 w-8 text-rose-400" /></div><p className="text-[18px] font-semibold text-gray-500">{nf ? 'Register team not found' : error}</p><Link to="/admin/hackathons" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Hackathons</Link></div>)
  }

  if (!data) return null

  const members = data.members || []
  const showApproval = data.status === 'Pending' && !data.isBanned

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-5">
        <Link to={`/admin/hackathons/${data.eventId}?tab=Register+Teams`} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Event
        </Link>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl font-bold text-white shadow-inner">
                {data.teamName?.charAt(0) || '?'}
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-white sm:text-[26px]">{data.teamName}</h1>
                <p className="mt-0.5 text-[13px] text-white/70">Registered {formatDateTime(data.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white">
                {statusIcon[data.status] || null}
                {data.status}
              </span>
              {data.isBanned && (
                <Badge label="Banned" className="bg-[#fce4ec] text-[#c62828]" />
              )}
              {showApproval && (
                <>
                  <button onClick={handleApprove} disabled={acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                    <CheckCircleIcon className="h-3.5 w-3.5" />{acting ? '...' : 'Approve'}
                  </button>
                  <button onClick={openReject} disabled={acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-rose-600 disabled:opacity-50">
                    <XCircle className="h-3.5 w-3.5" />Reject
                  </button>
                </>
              )}
              <Link to={`/admin/register-teams/${registerTeamId}/edit`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-white/30">
                Edit
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 border-t border-[#e8ecf0] bg-[#fafbfc] px-6 py-3 sm:px-8">
          <QuickStat icon={Trophy} label="Event" value={data.eventName || '—'} href={data.eventId ? `/admin/hackathons/${data.eventId}` : null} />
          <QuickStat icon={FileText} label="Track" value={data.trackTitle || '—'} href={data.trackId ? `/admin/hackathons/${data.eventId}/tracks/${data.trackId}` : null} />
          <QuickStat icon={FileText} label="Topic" value={data.topicTitle || '—'} href={data.topicId && data.trackId ? `/admin/hackathons/${data.eventId}/tracks/${data.trackId}/topics` : null} />
          <QuickStat icon={Users} label="Team" value={data.teamName || '—'} href={data.teamId ? `/admin/teams/${data.teamId}` : null} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CardPanel title="Registration Details">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Status" icon={CircleCheck}>
                <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
              </InfoRow>
              {data.status === 'Rejected' && data.rejectionReason && (
                <InfoRow label="Rejection Reason" icon={Shield}>
                  <p className="text-[14px] text-rose-600">{data.rejectionReason}</p>
                </InfoRow>
              )}
              <InfoRow label="Description" icon={FileText}>
                <p className="text-[14px] text-[#1f2f3a] whitespace-pre-wrap">{data.description || '—'}</p>
              </InfoRow>
              <InfoRow label="Banned" icon={Ban}>
                {data.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title={`Members (${members.length})`}>
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Users className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-[14px] text-gray-400">No members yet.</p>
              </div>
            ) : (
              <BaseTable borderless columns={memberColumns} data={members} page={1} pageSize={members.length} total={members.length} emptyText="No members." keyExtractor={(row) => row.userId} minWidth="400px" />
            )}
          </CardPanel>
        </div>

        <div className="space-y-5">
          <CardPanel title="Event" viewAllTo={data.eventId ? `/admin/hackathons/${data.eventId}` : null}>
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Event" icon={Trophy}>
                {data.eventId ? <Link to={`/admin/hackathons/${data.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.eventName}</Link> : <span className="text-[14px] text-gray-400">—</span>}
              </InfoRow>
              <InfoRow label="Track" icon={FileText}><span className="text-[14px] text-[#1f2f3a]">{data.trackTitle || '—'}</span></InfoRow>
              <InfoRow label="Topic" icon={FileText}>
                {data.topicId && data.trackId ? <Link to={`/admin/hackathons/${data.eventId}/tracks/${data.trackId}/topics`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.topicTitle}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.topicTitle || '—'}</span>}
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Team">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Team" icon={Users}>
                {data.teamId ? <Link to={`/admin/teams/${data.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.teamName}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.teamName || '—'}</span>}
              </InfoRow>
              <InfoRow label="Locked" icon={CircleCheck}>
                {data.teamCanEdit ? <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />}
              </InfoRow>
              <InfoRow label="Status" icon={CircleCheck}>
                {data.teamIsDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
              <InfoRow label="Created" icon={Calendar}>
                <span className="text-[14px] text-[#1f2f3a]">{data.teamCreatedAt ? formatDateTime(data.teamCreatedAt) : '—'}</span>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Timestamps">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Registered" icon={Calendar}><span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.createdAt)}</span></InfoRow>
              <InfoRow label="Last Updated" icon={Clock}><span className="text-[14px] text-[#1f2f3a]">{data.updatedAt ? formatDateTime(data.updatedAt) : '—'}</span></InfoRow>
            </div>
          </CardPanel>
        </div>
      </div>

      <PromptReason
        open={!!rejectTarget}
        onClose={() => { if (!rejecting) setRejectTarget(null) }}
        onSubmit={handleRejectSubmit}
        title="Reject Registration"
        description={`Reject "${rejectTarget?.teamName}" from this event.`}
        confirmText="Reject"
        placeholder="Why is this team being rejected?"
        submitting={rejecting}
        confirmVariant="danger"
      />
    </div>
  )
}

function QuickStat({ icon: Icon, label, value, href }) {
  const content = (
    <div className={`flex items-center gap-2 ${href ? 'cursor-pointer' : ''}`}>
      <Icon className="h-3.5 w-3.5 text-[#064f5d] shrink-0" />
      <span className="text-[12px] text-gray-400">{label}:</span>
      <span className={`text-[12px] font-semibold ${href ? 'text-[#064f5d] hover:underline' : 'text-[#1f2f3a]'}`}>{value}</span>
      {href && <ExternalLink className="h-3 w-3 text-gray-300" />}
    </div>
  )
  return href ? <Link to={href}>{content}</Link> : content
}
