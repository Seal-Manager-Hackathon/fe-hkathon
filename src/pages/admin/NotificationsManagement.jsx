import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BellPlus, RotateCcw, Eye, Edit } from 'lucide-react'
import { allNotifications, notificationTypeBadge, notificationStatusBadge } from '../../data/mockAdminData'
import BaseTable from '../../components/BaseTable'
import Badge from '../../components/Badge'
import SearchInput from '../../components/SearchInput'
import SelectInput from '../../components/SelectInput'

const PAGE_SIZE = 10

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Announcement', label: 'Announcement' },
  { value: 'Update', label: 'Update' },
  { value: 'Alert', label: 'Alert' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Draft', label: 'Draft' },
]

const AUDIENCE_OPTIONS = [
  { value: '', label: 'All Audiences' },
  { value: 'All Users', label: 'All Users' },
  { value: 'Participants', label: 'Participants' },
  { value: 'Staff', label: 'Staff' },
]

export default function NotificationsManagement() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [audienceFilter, setAudienceFilter] = useState('')
  const [page, setPage] = useState(1)

  const hasActiveFilters = search || typeFilter || statusFilter || audienceFilter

  function handleReset() {
    setSearch('')
    setTypeFilter('')
    setStatusFilter('')
    setAudienceFilter('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    return allNotifications.filter((n) => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter && n.type !== typeFilter) return false
      if (statusFilter && n.status !== statusFilter) return false
      if (audienceFilter && n.audience !== audienceFilter) return false
      return true
    })
  }, [search, typeFilter, statusFilter, audienceFilter])

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (row) => (
        <Link
          to={`/admin/notifications/${row.id}`}
          className="block max-w-[280px] truncate text-[14px] font-semibold text-[#064f5d] hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <Badge label={row.type} className={notificationTypeBadge[row.type]} />
      ),
    },
    {
      key: 'audience',
      header: 'Audience',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{row.audience}</p>
      ),
    },
    {
      key: 'sentBy',
      header: 'Sent By',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{row.sentBy}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge label={row.status} className={notificationStatusBadge[row.status]} />
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{row.date}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/admin/notifications/${row.id}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
          <Link
            to={`/admin/notifications/${row.id}/edit`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="px-8 py-8">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">Notifications</h1>
          <p className="mt-1 text-[15px] text-gray-500">
            Manage system-wide notifications for all users.
          </p>
        </div>
        <Link
          to="/admin/notifications/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <BellPlus className="h-4 w-4" />
          Create Notification
        </Link>
      </div>

      {/* Filter Row */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <SearchInput
          className="w-[300px]"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <SelectInput
          label="Type"
          options={TYPE_OPTIONS}
          value={typeFilter}
          onChange={(v) => { setTypeFilter(v); setPage(1) }}
          className="w-[180px]"
        />
        <SelectInput
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1) }}
          className="w-[160px]"
        />
        <SelectInput
          label="Audience"
          options={AUDIENCE_OPTIONS}
          value={audienceFilter}
          onChange={(v) => { setAudienceFilter(v); setPage(1) }}
          className="w-[180px]"
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

      {/* Table */}
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
            ? 'No notifications match the current filters.'
            : 'No notifications in the system yet.'
        }
        keyExtractor={(row) => row.id}
      />
    </div>
  )
}