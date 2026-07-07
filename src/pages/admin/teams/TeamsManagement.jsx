import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Users, Trash2, RotateCcw, CircleCheck, UserRound, Calendar, Edit, MoreHorizontal, Lock, LockOpen } from 'lucide-react'
import { getTeams, deleteTeam, restoreTeam, lockTeam, unlockTeam } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import { teamsFilters } from './TeamsFilters'
import { formatDate } from '../../../utils/format'
import { toast, confirm } from '../../../utils/toast'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  canEdit: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

const dangerBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9]'

function teamColumns(onDelete, onRestore, onLock, onUnlock) {
  return [
    {
      key: 'name',
      header: 'Team Name',
      headerIcon: UserRound,
      render: (row) => (
        <Link to={`/admin/teams/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDate(row.createdAt)}</p>,
    },
    {
      key: 'canEdit',
      header: 'Lock',
      headerIcon: Lock,
      render: (row) => (
        <Badge label={row.canEdit ? 'No' : 'Yes'} className={row.canEdit ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#ffcdd2] text-[#e65100]'} />
      ),
    },
    {
      key: 'isDisable',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => {
        if (row.isDisable) return <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
        return <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/teams/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] hover:bg-[#e8e8e8]">
            <Users className="h-3.5 w-3.5" /> View
          </Link>
          {!row.isDisable && (
            <>
              <Link to={`/admin/teams/${row.id}/edit`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] hover:bg-[#bbdefb]">
                <Edit className="h-3.5 w-3.5" /> Edit
              </Link>
              {row.canEdit ? (
                <button onClick={() => onLock?.(row)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#fff3e0] px-3 py-1.5 text-[13px] font-semibold text-[#e65100] hover:bg-[#ffe0b2]">
                  <Lock className="h-3.5 w-3.5" /> Lock
                </button>
              ) : (
                <button onClick={() => onUnlock?.(row)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9]">
                  <LockOpen className="h-3.5 w-3.5" /> Unlock
                </button>
              )}
            </>
          )}
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]
}

export default function TeamsManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasActive = Object.entries(filters).some(
    ([, v]) => v !== ''
  )

  const buildParams = useCallback(() => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, canEdit, isDisable, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (canEdit !== '') params.CanEdit = canEdit === 'true'
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getTeams(buildParams())
      setTeams(result.teams || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load teams.'
      setError(msg)
      setTeams([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  async function handleDelete(team) {
    const ok = await confirm('Delete Team', `Are you sure you want to delete "${team.name}"?`)
    if (!ok) return
    try {
      await deleteTeam(team.id)
      toast.success('Team deleted')
      fetchTeams()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete team.')
    }
  }

  async function handleRestore(team) {
    const ok = await confirm('Restore Team', `Are you sure you want to restore "${team.name}"?`)
    if (!ok) return
    try {
      await restoreTeam(team.id)
      toast.success('Team restored')
      fetchTeams()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore team.')
    }
  }

  async function handleLock(team) {
    try {
      await lockTeam(team.id)
      toast.success('Team locked')
      fetchTeams()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to lock team.')
    }
  }

  async function handleUnlock(team) {
    try {
      await unlockTeam(team.id)
      toast.success('Team unlocked')
      fetchTeams()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to unlock team.')
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Teams</h1>
      </div>

      <FilterBar
        filters={teamsFilters}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        hasActive={hasActive}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <BaseTable
        columns={teamColumns(handleDelete, handleRestore, handleLock, handleUnlock)}
        data={teams}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No teams match the current filters.' : 'No teams in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="700px"
      />
    </div>
  )
}
