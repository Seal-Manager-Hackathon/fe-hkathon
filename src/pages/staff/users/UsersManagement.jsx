import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { getUsers, deleteUser, restoreUser, banUser, unbanUser } from '../../../api/staff'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { usersColumns } from './UsersColumns'
import { usersFilters } from './UsersFilters'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast, confirm } from '../../../utils/toast'
import PromptReason from '../../../components/PromptReason'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  role: '',
  isDisable: '',
  isVerified: '',
  isBanned: '',
  fromDate: '',
  toDate: '',
}

export default function UsersManagement() {
  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, role, isDisable, isVerified, isBanned, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (role) params.Role = role
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (isVerified !== '') params.IsVerified = isVerified === 'true'
    if (isBanned !== '') params.IsBanned = isBanned === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [])

  const {
    data: users,
    totalCount,
    loading,
    error,
    filters,
    pageIndex,
    hasActive,
    setPageIndex,
    handleFilterChange,
    handleReset,
    refetch,
  } = useServerPagination({
    fetchFn: getUsers,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  const [banTarget, setBanTarget] = useState(null)
  const [banning, setBanning] = useState(false)

  async function handleDelete(user) {
    const ok = await confirm('Delete User', `Are you sure you want to delete "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try { await deleteUser(user.id); toast.success('User deleted'); refetch() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to delete user.') }
  }

  async function handleRestore(user) {
    const ok = await confirm('Restore User', `Are you sure you want to restore "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try { await restoreUser(user.id); toast.success('User restored'); refetch() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to restore user.') }
  }

  function handleBan(user) {
    setBanTarget(user)
  }

  async function handleBanSubmit(reason) {
    const user = banTarget
    setBanTarget(null)
    if (!user) return
    setBanning(true)
    try { await banUser(user.id, reason); toast.success('User banned'); refetch() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to ban user.') }
    finally { setBanning(false) }
  }

  async function handleUnban(user) {
    const ok = await confirm('Unban User', `Are you sure you want to unban "${user.firstName} ${user.lastName}"?`)
    if (!ok) return
    try { await unbanUser(user.id); toast.success('User unbanned'); refetch() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to unban user.') }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Users</h1></div>
        <Link to="/staff/users/create" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"><UserPlus className="h-4 w-4" />Create User</Link>
      </div>
      <FilterBar filters={usersFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <BaseTable columns={usersColumns(handleDelete, handleRestore, handleBan, handleUnban)} data={users} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No users match the current filters.' : 'No users in the system yet.'} keyExtractor={(row) => row.id} minWidth="900px" />

      <PromptReason
        open={!!banTarget}
        onClose={() => { if (!banning) setBanTarget(null) }}
        onSubmit={handleBanSubmit}
        title="Ban User"
        description={`Ban "${banTarget?.firstName} ${banTarget?.lastName}"?`}
        confirmText="Ban"
        placeholder="Enter ban reason..."
        submitting={banning}
        confirmVariant="danger"
      />
    </div>
  )
}
