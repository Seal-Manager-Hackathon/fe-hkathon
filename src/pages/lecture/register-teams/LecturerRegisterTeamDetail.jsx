import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, Trophy, User, Crown, Shield, Ban, Layers, Lock, ExternalLink } from 'lucide-react'
import { getLecturerRegisterTeamDetail } from '../../../api/lecturer'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import BaseTable from '../../../components/BaseTable'

const statusBadge = { Pending: 'bg-amber-50 text-amber-700 border border-amber-200', Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Rejected: 'bg-rose-50 text-rose-700 border border-rose-200' }

const statusIcon = { Pending: <Clock className="h-4 w-4 text-amber-600" />, Approved: <CheckIcon className="h-4 w-4 text-emerald-600" />, Rejected: <Shield className="h-4 w-4 text-rose-600" /> }

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

const memberColumns = [
  {
    key: 'member', header: 'Member', headerIcon: User,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p>
          <p className="text-[12px] text-gray-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role', header: 'Role', headerIcon: Crown,
    render: (row) => row.isLeader
      ? <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5"><Crown className="h-3.5 w-3.5 text-[#ffca28]" /><span className="text-[12px] font-semibold text-[#e65100]">Leader</span></div>
      : <span className="text-[13px] text-gray-400">Member</span>,
  },
]

export default function LecturerRegisterTeamDetail() {
  const { registerTeamId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const result = await getLecturerRegisterTeamDetail(registerTeamId)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load register team.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [registerTeamId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    const nf = error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Registration not found' : error}</p>
        <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
    )
  }

  if (!data) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <p className="text-[18px] font-semibold text-[#1f2f3a]">Not found.</p>
      <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
    </div>
  )

  const members = data?.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={data.eventId ? `/lecture/hackathons/${data.eventId}?tab=Register%20Teams` : '/lecture/hackathons'} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-6 rounded-2xl border border-[#e8ecf0] bg-white overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#064f5d] to-[#0a7b8a] px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[20px] font-bold text-white sm:text-[26px]">{data.teamName || 'Untitled'}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white">
                {statusIcon[data.status]}{data.status}
              </span>
              {data.isBanned && <Badge label="Banned" className="bg-[#fce4ec] text-[#c62828]" />}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 border-t border-[#e8ecf0] bg-[#fafbfc] px-6 py-3 sm:px-8">
          <QuickStat icon={Trophy} label="Event" value={data.eventName || '—'} href={data.eventId ? `/lecture/hackathons/${data.eventId}` : null} />
          <QuickStat icon={Users} label="Team" value={data.teamName || '—'} href={data.teamId ? `/lecture/teams/${data.teamId}` : null} />
          <QuickStat icon={FileText} label="Track" value={data.trackTitle || '—'} />
          <QuickStat icon={FileText} label="Topic" value={data.topicTitle || '—'} />
          <QuickStat icon={Layers} label="Round" value={data.roundName || '—'} href={data.roundId ? `/lecture/rounds/${data.roundId}` : null} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <CardPanel title="Registration Details">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Status" icon={Shield}>
                <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
              </InfoRow>
              {data.status === 'Rejected' && data.rejectionReason && (
                <InfoRow label="Rejection Reason" icon={Ban}>
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
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-[14px] text-gray-400">No members.</p>
              </div>
            ) : (
              <BaseTable
                borderless
                columns={memberColumns}
                data={members}
                page={1}
                pageSize={members.length}
                total={members.length}
                emptyText="No members."
                keyExtractor={(row) => row.userId}
                minWidth="600px"
              />
            )}
          </CardPanel>
        </div>

        <div className="space-y-5">
          <CardPanel title="Event & Track">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Event" icon={Trophy}>
                {data.eventId ? <Link to={`/lecture/hackathons/${data.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.eventName}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.eventName || '—'}</span>}
              </InfoRow>
              <InfoRow label="Track" icon={FileText}>
                <span className="text-[14px] text-[#1f2f3a]">{data.trackTitle || '—'}</span>
              </InfoRow>
              <InfoRow label="Topic" icon={FileText}>
                <span className="text-[14px] text-[#1f2f3a]">{data.topicTitle || '—'}</span>
              </InfoRow>
              <InfoRow label="Round" icon={Layers}>
                {data.roundId ? <Link to={`/lecture/rounds/${data.roundId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.roundName || '—'}</Link> : <span className="text-[14px] text-gray-400">—</span>}
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Team">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Team" icon={Users}>
                {data.teamId ? <Link to={`/lecture/teams/${data.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.teamName}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.teamName || '—'}</span>}
              </InfoRow>
              <InfoRow label="Locked" icon={Lock}>
                {data.teamCanEdit ? <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />}
              </InfoRow>
              <InfoRow label="Status" icon={Shield}>
                {data.teamIsDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}
              </InfoRow>
              <InfoRow label="Created" icon={Calendar}>
                <span className="text-[14px] text-[#1f2f3a]">{data.teamCreatedAt ? formatDateTime(data.teamCreatedAt) : '—'}</span>
              </InfoRow>
            </div>
          </CardPanel>

          <CardPanel title="Timestamps">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Registered" icon={Calendar}>
                <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.createdAt)}</span>
              </InfoRow>
              <InfoRow label="Last Updated" icon={Clock}>
                <span className="text-[14px] text-[#1f2f3a]">{data.updatedAt ? formatDateTime(data.updatedAt) : '—'}</span>
              </InfoRow>
            </div>
          </CardPanel>
        </div>
      </div>
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
