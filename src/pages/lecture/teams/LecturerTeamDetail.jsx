import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Users, Lock, CircleCheck } from 'lucide-react'
import { getLecturerTeamDetail } from '../../../api/lecturer'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import BaseTable from '../../../components/BaseTable'

const memberColumns = [
  {
    key: 'member', header: 'Member', headerIcon: Users,
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
    key: 'role', header: 'Role', headerIcon: Lock,
    render: (row) => row.isLeader
      ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[12px] font-semibold text-[#e65100]">Leader</span>
      : <span className="text-[13px] text-gray-400">Member</span>,
  },
  {
    key: 'status', header: 'Status', headerIcon: CircleCheck,
    render: (row) => row.status === 'Active'
      ? <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
      : <Badge label="Inactive" className="bg-[#f5f5f5] text-[#757575]" />,
  },
]

export default function LecturerTeamDetail() {
  const { teamId } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getLecturerTeamDetail(teamId)
        if (!cancelled) setTeam(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load team.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [teamId])

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
        <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Team not found' : error}</p>
        <Link to="/lecture/hackathons" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Hackathons</Link>
      </div>
    )
  }

  if (!team) return null

  const members = team?.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to="/lecture/hackathons" className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Hackathons
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{team.name}</h1>
            {team.isDisable ? (
              <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
            ) : (
              <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
            )}
          </div>
          <p className="mt-2 text-[12px] sm:text-[13px] text-gray-400">Created {formatDateTime(team.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-5">
          <CardPanel title="Team Information">
            <div className="divide-y divide-[#f5f5f5]">
              <InfoRow label="Team Name" icon={Users}><p className="text-[14px] font-medium text-[#1f2f3a]">{team.name}</p></InfoRow>
              <InfoRow label="Lock" icon={Lock}>{team.canEdit ? <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" /> : <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />}</InfoRow>
              <InfoRow label="Status" icon={CircleCheck}>{team.isDisable ? <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />}</InfoRow>
              <InfoRow label="Created At" icon={Calendar}><p className="text-[14px] text-[#1f2f3a]">{formatDateTime(team.createdAt)}</p></InfoRow>
              <InfoRow label="Last Updated" icon={Clock}><p className="text-[14px] text-[#1f2f3a]">{team.updatedAt ? formatDateTime(team.updatedAt) : '—'}</p></InfoRow>
            </div>
          </CardPanel>

          {members.length > 0 && (
            <div className="rounded-xl border border-[#e8ecf0] bg-white">
              <div className="border-b border-[#f0f0f0] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#064f5d]" />
                  <h3 className="text-[15px] font-bold text-[#1f2f3a]">Members ({members.length})</h3>
                </div>
              </div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
