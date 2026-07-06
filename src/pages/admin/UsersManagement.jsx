import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, UserPlus } from 'lucide-react'
import { allUsers, roleBadge, userStatusBadge } from '../../data/mockAdminData'
import BaseTable from '../../components/BaseTable'
import Badge from '../../components/Badge'
import SearchInput from '../../components/SearchInput'
import SelectInput from '../../components/SelectInput'
import TableActions from '../../components/TableActions'

const PAGE_SIZE = 10

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Student', label: 'Student' },
  { value: 'Lecturer', label: 'Lecturer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

export default function UsersManagement() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const hasActiveFilters = search || roleFilter || statusFilter

  function handleReset() {
    setSearch('')
    setRoleFilter('')
    setStatusFilter('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
      if (roleFilter && u.role !== roleFilter) return false
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [search, roleFilter, statusFilter])

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3f2fd] text-[13px] font-bold text-[#1565c0]">
            {row.avatar || row.name.charAt(0)}
          </div>
          <div>
            <Link
              to={`/admin/users/${row.id}`}
              className="text-[14px] font-semibold text-[#064f5d] hover:underline"
            >
              {row.name}
            </Link>
            <p className="text-[12px] text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge label={row.role} className={roleBadge[row.role]} />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge label={row.status} className={userStatusBadge[row.status]} />
      ),
    },
    {
      key: 'submissions',
      header: 'Submissions',
      render: (row) => (
        <p className="text-[14px] font-semibold text-[#1f2f3a]">{row.submissions}</p>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{row.joined}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <TableActions viewTo={`/admin/users/${row.id}`} editTo={`/admin/users/${row.id}/edit`} />
      ),
    },
  ]

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">Users</h1>
          <p className="mt-1 text-[15px] text-gray-500">
            Manage all {filtered.length} user accounts.
          </p>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <SearchInput
          className="w-[300px]"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <SelectInput
          label="Role"
          options={ROLE_OPTIONS}
          value={roleFilter}
          onChange={(v) => { setRoleFilter(v); setPage(1) }}
          className="w-[160px]"
        />
        <SelectInput
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1) }}
          className="w-[160px]"
        />
        <button
          onClick={handleReset}
          disabled={!hasActiveFilters}
          className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <BaseTable
        columns={columns}
        data={filtered}
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
        loading={false}
        emptyText={
          hasActiveFilters
            ? 'No users match the current filters.'
            : 'No users in the system yet.'
        }
        keyExtractor={(row) => row.id}
      />
    </div>
  )
}
