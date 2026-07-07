import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { getUsers, deleteUser, restoreUser, banUser, unbanUser } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { usersColumns } from './UsersColumns'
import { usersFilters } from './UsersFilters'
import { toast, confirm, promptReason } from '../../../utils/toast'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  role: '',
  isDisable: '',
  isVerified: '',
  fromDate: '',
  toDate: '',
}

export default function UsersManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasActive = Object.entries(filters).some(
    ([, v]) => v !== ''
  )

  const buildParams = useCallback(() => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, role, isDisable, isVerified, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (role) params.Role = role
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (isVerified !== '') params.IsVerified = isVerified === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getUsers(buildParams())
      setUsers(result.users || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users.')
      setUsers([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  async function handleDelete(user) {
    const ok = await confirm('Delete User', `Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try {
      await deleteUser(user.id)
      toast.success('User deleted')
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user.')
    }
  }

  async function handleRestore(user) {
    const ok = await confirm('Restore User', `Are you sure you want to restore "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try {
      await restoreUser(user.id)
      toast.success('User restored')
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore user.')
    }
  }

  async function handleBan(user) {
    const reason = await promptReason('Ban User', 'Ban Reason', `Why are you banning ${user.firstName} ${user.lastName}?`, 'Ban')
    if (!reason) return
    try {
      await banUser(user.id, reason)
      toast.success('User banned')
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to ban user.')
    }
  }

  async function handleUnban(user) {
    const ok = await confirm('Unban User', `Are you sure you want to unban "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try {
      await unbanUser(user.id)
      toast.success('User unbanned')
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to unban user.')
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Users</h1>

        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />Create User
        </Link>
      </div>

      <FilterBar
        filters={usersFilters}
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
        columns={usersColumns(handleDelete, handleRestore, handleBan, handleUnban)}
        data={users}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No users match the current filters.' : 'No users in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="900px"
      />
    </div>
  )
}
