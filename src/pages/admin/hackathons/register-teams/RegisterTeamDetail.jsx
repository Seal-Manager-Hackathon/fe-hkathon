import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, Trophy, User, Crown, CircleCheck, Shield, Ban, ExternalLink, Eye, CheckCircle as ApproveIcon, XCircle, ShieldOff, MoreHorizontal, Layers, ChevronDown, Send, FileDown } from 'lucide-react'
import { getRegisterTeamDetail, approveRegisterTeam, rejectRegisterTeam, banRegisterTeam, unbanRegisterTeam, getRegisterTeamSubmissions } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import Avatar from '../../../../components/Avatar'
import BaseTable from '../../../../components/BaseTable'
import PromptReason from '../../../../components/PromptReason'
import RoundSelectModal from '../../../../components/RoundSelectModal'
import { toast, confirm } from '../../../../utils/toast'

const SUB_PAGE_SIZE = 10

const statusBadge = { Pending: 'bg-amber-50 text-amber-700 border border-amber-200', Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Rejected: 'bg-rose-50 text-rose-700 border border-rose-200' }
const statusIcon = { Pending: <Clock className="h-4 w-4 text-amber-600" />, Approved: <CircleCheck className="h-4 w-4 text-emerald-600" />, Rejected: <Shield className="h-4 w-4 text-rose-600" /> }

const memberColumns = [
  { key: 'member', header: 'Member', headerIcon: User, render: (row) => (<div className="flex items-center gap-3"><Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" /><div><p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p><p className="text-[12px] text-gray-400">{row.email}</p></div></div>) },
  { key: 'role', header: 'Role', headerIcon: Shield, render: (row) => row.isLeader ? (<div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5"><Crown className="h-3.5 w-3.5 text-[#ffca28]" /><span className="text-[12px] font-semibold text-[#e65100]">Leader</span></div>) : <span className="text-[13px] text-gray-400">Member</span> },
  { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
    <Link to={`/admin/users/${row.userId}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2 py-1.5 text-[12px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"><Eye className="h-3.5 w-3.5" />View</Link>
  )},
]

const submissionColumns = [
  { key: 'round', header: 'Round', headerIcon: Layers, render: (row) => (
    <div>
      <Link to={`/admin/hackathons/${row.eventId}/rounds/${row.roundId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.roundName}</Link>
      <p className="text-[12px] text-gray-400">{row.trackTitle}{row.topicTitle ? ` / ${row.topicTitle}` : ''}</p>
    </div>
  )},
  { key: 'lastSubmission', header: 'Last Submission', headerIcon: FileDown, render: (row) => {
    const sub = row.lastSubmission
    if (!sub) return <span className="text-[13px] text-gray-400">—</span>
    return (
      <div>
        <Link to={`/admin/submissions/${sub.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{sub.description || sub.url || 'View'}</Link>
        <p className="text-[12px] text-gray-400">{formatDateTime(sub.submittedAt)}</p>
      </div>
    )
  }},
  { key: 'submittedBy', header: 'Submitted By', headerIcon: User, render: (row) => {
    const by = row.submittedBy
    if (!by) return <span className="text-[13px] text-gray-400">—</span>
    return (
      <Link to={`/admin/users/${by.userId}`} className="flex items-center gap-3 hover:opacity-80">
        <Avatar src={by.avatarUrl} name={`${by.firstName} ${by.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#064f5d] hover:underline">{by.firstName} {by.lastName}</p>
          <p className="text-[12px] text-[#1f2f3a]">{by.email}</p>
        </div>
      </Link>
    )
  }},
]

export default function RegisterTeamDetail() {
  const { registerTeamId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejecting, setRejecting] = useState(false)
  const [banTarget, setBanTarget] = useState(null)
  const [banning, setBanning] = useState(false)
  const [acting, setActing] = useState(false)

  // Submissions
  const [submissions, setSubmissions] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [subPage, setSubPage] = useState(1)
  const [subLoading, setSubLoading] = useState(false)
  const [roundId, setRoundId] = useState('')
  const [roundName, setRoundName] = useState('')
  const [roundModalOpen, setRoundModalOpen] = useState(false)

  async function fetchData() {
    setLoading(true); setError('')
    try { const result = await getRegisterTeamDetail(registerTeamId); setData(result) }
    catch (err) { setError(err?.response?.data?.message || 'Failed to load.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [registerTeamId])

  const fetchSubmissions = useCallback(async () => {
    setSubLoading(true)
    try {
      const params = { pageIndex: subPage, pageSize: SUB_PAGE_SIZE }
      if (roundId) params.roundId = roundId
      const result = await getRegisterTeamSubmissions(registerTeamId, params)
      setSubmissions(result.items || [])
      setSubTotal(result.totalCount || 0)
    } catch { setSubmissions([]); setSubTotal(0) }
    finally { setSubLoading(false) }
  }, [registerTeamId, subPage, roundId])

  useEffect(() => { if (data) fetchSubmissions() }, [fetchSubmissions, data])

  async function handleApprove() {
    const ok = await confirm('Approve', `Approve "${data.teamName}"?`)
    if (!ok) return
    setActing(true)
    try { await approveRegisterTeam(registerTeamId); toast.success('Approved'); fetchData() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setActing(false) }
  }

  function openReject() { setRejectTarget(data) }

  async function handleRejectSubmit(reason) {
    setRejecting(true)
    try { await rejectRegisterTeam(registerTeamId, { reason }); setRejectTarget(null); toast.success('Rejected'); fetchData() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setRejecting(false) }
  }

  function openBan() { setBanTarget(data) }

  async function handleBanSubmit(reason) {
    setBanning(true)
    try { await banRegisterTeam(registerTeamId, { reason }); setBanTarget(null); toast.success('Banned'); fetchData() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setBanning(false) }
  }

  async function handleUnban() {
    const ok = await confirm('Unban', `Unban "${data.teamName}"?`)
    if (!ok) return
    setActing(true)
    try { await unbanRegisterTeam(registerTeamId); toast.success('Unbanned'); fetchData() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setActing(false) }
  }

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" /><div className="h-80 animate-pulse rounded-xl bg-gray-100" /></div>

  if (error) {
    const nf = error.includes('Not Found')
    return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Registration not found' : error}</p><Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link></div>
  }

  if (!data) return <div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-[#1f2f3a]">Not found.</p></div>

  const members = data?.members || []
  const showApproval = data?.status === 'Pending'
  const roundHasActive = roundId !== ''

  function handleRoundSelect(id, name) {
    setRoundId(id)
    setRoundName(name)
    setRoundModalOpen(false)
    setSubPage(1)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={data.eventId ? `/admin/hackathons/${data.eventId}?tab=Register Teams` : '/admin/hackathons'} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline"><ArrowLeft className="h-4 w-4" /> Back</Link>
      </div>

      <div className="mb-6 rounded-2xl border border-[#e8ecf0] bg-white overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a7b8a] px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] font-bold text-white sm:text-[26px]">{data.teamName || 'Untitled'}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white">
                {statusIcon[data.status]}{data.status}
              </span>
              {data.isBanned && <Badge label="Banned" className="bg-[#fce4ec] text-[#c62828]" />}
              {showApproval && (
                <>
                  <button onClick={handleApprove} disabled={acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                    <ApproveIcon className="h-3.5 w-3.5" />{acting ? '...' : 'Approve'}
                  </button>
                  <button onClick={openReject} disabled={acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-rose-600 disabled:opacity-50">
                    <XCircle className="h-3.5 w-3.5" />Reject
                  </button>
                </>
              )}
              {data.isBanned ? (
                <button onClick={handleUnban} disabled={acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                  <ShieldOff className="h-3.5 w-3.5" />{acting ? '...' : 'Unban'}
                </button>
              ) : (
                <button onClick={openBan} disabled={banning || acting} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-rose-600 disabled:opacity-50">
                  <ShieldOff className="h-3.5 w-3.5" />{banning ? '...' : 'Ban'}
                </button>
              )}
              <Link to={`/admin/register-teams/${registerTeamId}/edit`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-white/30">Edit</Link>
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
                <p className="text-[14px] text-[#1f2f3a]">{data.description || '—'}</p>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Members">
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12"><Users className="mb-3 h-10 w-10 text-gray-300" /><p className="text-[14px] text-gray-400">No members.</p></div>
            ) : (
              <BaseTable borderless columns={memberColumns} data={members} page={1} pageSize={members.length} total={members.length} emptyText="No members." keyExtractor={(row) => row.userId} minWidth="600px" />
            )}
          </CardPanel>

          <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
            <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1f2f3a] flex items-center gap-2"><Send className="h-4 w-4" /> Submissions</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoundModalOpen(true)}
                    className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#d8e0e6] bg-white px-3 py-2 text-[13px] font-medium transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
                  >
                    <Layers className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#064f5d]" />
                    <span className={roundName ? 'text-[#1f2f3a]' : 'text-gray-400'}>{roundName || 'All Rounds'}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#064f5d]" />
                  </button>
                </div>
                {roundHasActive && (
                  <button onClick={() => { setRoundId(''); setRoundName(''); setSubPage(1) }} className="cursor-pointer text-[12px] text-gray-400 hover:text-[#c62828] underline">Clear</button>
                )}
              </div>
            </div>
            <BaseTable borderless columns={submissionColumns} data={submissions} page={subPage} pageSize={SUB_PAGE_SIZE} total={subTotal} onPageChange={setSubPage} loading={subLoading} serverSide emptyText="No submissions found." keyExtractor={(row) => row.roundId} minWidth="700px" />
          </div>
        </div>

        <div className="space-y-5">
          <CardPanel title="Event & Track">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Event" icon={Trophy}>
                {data.eventId ? <Link to={`/admin/hackathons/${data.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.eventName}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.eventName || '—'}</span>}
              </InfoRow>
              <InfoRow label="Track" icon={FileText}>
                {data.trackId ? <Link to={`/admin/hackathons/${data.eventId}/tracks/${data.trackId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.trackTitle}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.trackTitle || '—'}</span>}
              </InfoRow>
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

      <PromptReason
        open={!!banTarget}
        onClose={() => { if (!banning) setBanTarget(null) }}
        onSubmit={handleBanSubmit}
        title="Ban Team"
        description={`Ban "${banTarget?.teamName}" from participating in this event.`}
        confirmText="Ban"
        placeholder="Why is this team being banned?"
        submitting={banning}
        confirmVariant="danger"
      />

      <RoundSelectModal
        open={roundModalOpen}
        onClose={() => setRoundModalOpen(false)}
        eventId={data?.eventId}
        selectedRoundId={roundId}
        onSelect={handleRoundSelect}
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
