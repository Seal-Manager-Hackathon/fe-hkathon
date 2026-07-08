import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Users, Trophy, User, Crown, CircleCheck, Shield, BadgeCheck } from 'lucide-react'
import { getRegisterTeamDetail } from '../../../../api/admin'
import { formatDateTime } from '../../../../utils/format'
import Badge from '../../../../components/Badge'
import CardPanel from '../../../../components/CardPanel'
import InfoRow from '../../../../components/InfoRow'
import Avatar from '../../../../components/Avatar'
import BaseTable from '../../../../components/BaseTable'

const statusBadge = { Pending: 'bg-amber-50 text-amber-700 border border-amber-200', Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200', Rejected: 'bg-rose-50 text-rose-700 border border-rose-200' }

const memberColumns = [
  { key: 'member', header: 'Member', headerIcon: User, render: (row) => (<div className="flex items-center gap-3"><Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" /><div><p className="text-[14px] font-semibold text-[#1f2f3a]">{row.firstName} {row.lastName}</p><p className="text-[12px] text-gray-400">{row.email}</p></div></div>) },
  { key: 'role', header: 'Role', headerIcon: Shield, render: (row) => row.isLeader ? (<div className="inline-flex items-center gap-1.5"><Crown className="h-4 w-4 text-[#ffca28]" /><span className="text-[13px] font-semibold text-[#e65100]">Leader</span></div>) : <span className="text-[13px] text-gray-500">Member</span> },
]

export default function RegisterTeamDetail() {
  const { registerTeamId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const result = await getRegisterTeamDetail(registerTeamId)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load register team detail.')
      } finally { if (!cancelled) setLoading(false) }
    }
    fetch(); return () => { cancelled = true }
  }, [registerTeamId])

  if (loading) return (<div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" /><div className="h-80 animate-pulse rounded-xl bg-gray-100" /></div>)

  if (error) {
    const nf = error.includes('Not Found')
    return (<div className="flex min-h-[60vh] flex-col items-center justify-center"><p className="text-[18px] font-semibold text-gray-500">{nf ? 'Register team not found' : error}</p><Link to="/admin/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link></div>)
  }

  if (!data) return null

  const members = data.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={eventBackUrl} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Event
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{data.teamName}</h1>
            <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
          </div>
          <p className="mt-2 text-[12px] sm:text-[13px] text-gray-400">Registered {formatDateTime(data.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CardPanel title="Registration Info">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Status" icon={BadgeCheck}><Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} /></InfoRow>
            {data.status === 'Rejected' && data.rejectionReason && <InfoRow label="Rejection Reason" icon={FileText}><p className="text-[14px] text-rose-600">{data.rejectionReason}</p></InfoRow>}
            <InfoRow label="Description" icon={FileText}><p className="text-[14px] text-[#1f2f3a]">{data.description || '—'}</p></InfoRow>
            <InfoRow label="Banned" icon={CircleCheck}>{data.isBanned ? <Badge label="Yes" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />}</InfoRow>
            <InfoRow label="Registered At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.createdAt)}</p></InfoRow>
            <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</p></InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Event & Track">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Event" icon={Trophy}>
              {data.eventId ? <Link to={`/admin/hackathons/${data.eventId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.eventName}</Link> : <span className="text-[14px] text-gray-400">—</span>}
            </InfoRow>
            <InfoRow label="Track" icon={FileText}><p className="text-[14px] text-[#1f2f3a]">{data.trackTitle || '—'}</p></InfoRow>
            <InfoRow label="Topic" icon={FileText}><p className="text-[14px] text-[#1f2f3a]">{data.topicTitle || '—'}</p></InfoRow>
          </div>
        </CardPanel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CardPanel title="Team Info">
          <div className="divide-y divide-[#f5f5f5]">
            <InfoRow label="Team Name" icon={Users}>
              {data.teamId ? <Link to={`/admin/teams/${data.teamId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{data.teamName}</Link> : <span className="text-[14px] text-[#1f2f3a]">{data.teamName || '—'}</span>}
            </InfoRow>
            <InfoRow label="Locked" icon={CircleCheck}>{data.teamCanEdit ? <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />}</InfoRow>
            <InfoRow label="Team Status" icon={CircleCheck}>{data.teamIsDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}</InfoRow>
            <InfoRow label="Team Created" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{data.teamCreatedAt ? formatDateTime(data.teamCreatedAt) : '—'}</p></InfoRow>
          </div>
        </CardPanel>

        <CardPanel title="Members">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12"><Users className="mb-3 h-10 w-10 text-gray-300" /><p className="text-[14px] text-gray-400">No members.</p></div>
          ) : (
            <BaseTable borderless columns={memberColumns} data={members} page={1} pageSize={members.length} total={members.length} emptyText="No members." keyExtractor={(row) => row.userId} minWidth="400px" />
          )}
        </CardPanel>
      </div>
    </div>
  )
}

