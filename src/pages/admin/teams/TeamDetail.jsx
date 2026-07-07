import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Edit, Calendar, Clock, Users, CheckCircle, XCircle, Crown, User, Shield, CircleCheck, ArrowLeft, Lock,
} from 'lucide-react'
import { getTeamDetail } from '../../../api/admin'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import Avatar from '../../../components/Avatar'
import BaseTable from '../../../components/BaseTable'

const memberColumns = [
  {
    key: 'member',
    header: 'Member',
    headerIcon: User,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div>
          <p className="text-[14px] font-semibold text-[#1f2f3a]">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-[12px] text-gray-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    headerIcon: Shield,
    render: (row) =>
      row.isLeader ? (
        <div className="inline-flex items-center gap-1.5">
          <Crown className="h-4 w-4 text-[#ffca28]" />
          <span className="text-[13px] font-semibold text-[#e65100]">Leader</span>
        </div>
      ) : (
        <span className="text-[13px] text-gray-500">Member</span>
      ),
  },
  {
    key: 'status',
    header: 'Status',
    headerIcon: CircleCheck,
    render: (row) =>
      row.status === 'Active' ? (
        <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
      ) : (
        <Badge label={row.status} className="bg-[#f5f5f5] text-[#757575]" />
      ),
  },
]


export default function TeamDetail() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getTeamDetail(id)
        if (!cancelled) setTeam(data)
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message || 'Failed to load team detail.'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 flex items-center gap-5">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    const isNotFound = error === 'Team Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Team không tồn tại' : error}
        </p>
        <Link to="/admin/teams" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Teams
        </Link>
      </div>
    )
  }

  const members = team?.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/admin/teams"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Teams
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
          <p className="mt-2 text-[12px] sm:text-[13px] text-gray-400">
            Created {formatDateTime(team.createdAt)}
          </p>
        </div>
        <Link
          to={`/admin/teams/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Team
        </Link>
      </div>

      <CardPanel title="Team Information">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Team Name" icon={Users}>
            <p className="text-[14px] font-medium text-[#1f2f3a]">{team.name}</p>
          </InfoRow>
          <InfoRow label="Lock" icon={Lock}>
            {team.canEdit ? (
              <Badge label="No" className="bg-[#e8f5e9] text-[#2e7d32]" />
            ) : (
              <Badge label="Yes" className="bg-[#ffcdd2] text-[#e65100]" />
            )}
          </InfoRow>
          <InfoRow label="Status" icon={CircleCheck}>
            {team.isDisable ? (
              <Badge label="Disabled" className="bg-[#f5f5f5] text-[#757575]" />
            ) : (
              <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
            )}
          </InfoRow>
          <InfoRow label="Created At" icon={Calendar}>
            <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(team.createdAt)}</p>
          </InfoRow>
          <InfoRow label="Last Updated" icon={Clock}>
            <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(team.updatedAt)}</p>
          </InfoRow>
        </div>
      </CardPanel>

      <div className="mt-5">
        <CardPanel title="Members">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-[14px] text-gray-400">No members in this team.</p>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <BaseTable
                columns={memberColumns}
                data={members}
                page={1}
                pageSize={members.length}
                total={members.length}
                emptyText="No members."
                keyExtractor={(row) => row.userId}
                minWidth="500px"
              />
            </div>
          )}
        </CardPanel>
      </div>
    </div>
  )
}
