import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Eye, RotateCcw } from 'lucide-react'
import { allHackathons, statusBadge, visibilityBadge } from '../../data/mockAdminData'
import BaseTable from '../../components/BaseTable'
import Badge from '../../components/Badge'
import SearchInput from '../../components/SearchInput'
import SelectInput from '../../components/SelectInput'

const PAGE_SIZE = 10

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Published', label: 'Published' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Upcoming', label: 'Upcoming' },
]

const VISIBILITY_OPTIONS = [
  { value: '', label: 'All Visibilities' },
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

export default function HackathonManagement() {
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [visibilityFilter, setVisibilityFilter] = useState('')
  const [page, setPage] = useState(1)

  const hasActiveFilters = search || yearFilter || statusFilter || visibilityFilter

  function handleReset() {
    setSearch('')
    setYearFilter('')
    setStatusFilter('')
    setVisibilityFilter('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    return allHackathons.filter((h) => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false
      if (yearFilter && h.year !== yearFilter) return false
      if (statusFilter && h.status !== statusFilter) return false
      if (visibilityFilter && h.visibility !== visibilityFilter) return false
      return true
    })
  }, [search, yearFilter, statusFilter, visibilityFilter])

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <Link
          to={`/admin/hackathons/${row.id}`}
          className="text-[14px] font-semibold text-[#064f5d] hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    { key: 'year', header: 'Year' },
    {
      key: 'season',
      header: 'Season',
      render: (row) => (
        <p className="text-[13px] text-gray-500">{row.season}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge label={row.status} className={statusBadge[row.status]} />
      ),
    },
    {
      key: 'visibility',
      header: 'Visibility',
      render: (row) => (
        <Badge label={row.visibility} className={visibilityBadge[row.visibility]} />
      ),
    },
    {
      key: 'prize',
      header: 'Prize Pool',
      render: (row) => (
        <p className="text-[14px] font-bold text-[#064f5d]">{row.prize}</p>
      ),
    },
    { key: 'teams', header: 'Teams' },
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
            to={`/admin/hackathons/${row.id}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
          <Link
            to={`/admin/hackathons/${row.id}/edit`}
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
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">Hackathons</h1>
          <p className="mt-1 text-[15px] text-gray-500">
            Manage all {filtered.length} hackathon programs.
          </p>
        </div>
        <Link
          to="/admin/hackathons/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
        >
          <Plus className="h-4 w-4" />
          Create Hackathon
        </Link>
      </div>

      {/* Filter Row */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <SearchInput
          className="w-[300px]"
          placeholder="Search hackathons..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <SelectInput
          label="Year"
          options={YEAR_OPTIONS}
          value={yearFilter}
          onChange={(v) => { setYearFilter(v); setPage(1) }}
          className="w-[160px]"
        />
        <SelectInput
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1) }}
          className="w-[180px]"
        />
        <SelectInput
          label="Visibility"
          options={VISIBILITY_OPTIONS}
          value={visibilityFilter}
          onChange={(v) => { setVisibilityFilter(v); setPage(1) }}
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
            ? 'No hackathons match the current filters.'
            : 'No hackathons yet. Create your first one!'
        }
        keyExtractor={(row) => row.id}
      />
    </div>
  )
}
