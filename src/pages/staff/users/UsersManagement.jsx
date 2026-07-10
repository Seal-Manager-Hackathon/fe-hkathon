import { useCallback } from 'react'
import { getUsers } from '../../../api/staff'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { usersColumns } from './UsersColumns'
import { usersFilters } from './UsersFilters'
import { useServerPagination } from '../../../hooks/useServerPagination'

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
  } = useServerPagination({
    fetchFn: getUsers,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Users</h1></div>
      </div>
      <FilterBar filters={usersFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <BaseTable columns={usersColumns()} data={users} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide emptyText={hasActive ? 'No users match the current filters.' : 'No users in the system yet.'} keyExtractor={(row) => row.id} minWidth="900px" />
    </div>
  )
}
