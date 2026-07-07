import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import BaseTable from '../BaseTable'
import SearchInput from '../SearchInput'
import SelectInput from '../SelectInput'

export default function DataManagementPage({
  entityName,
  entityRouteBase,
  createLabel,
  createIcon: CreateIcon,
  countLabel,
  searchPlaceholder,
  searchKeys = [],
  filters = [],
  data = [],
  columns = [],
  pageSize = 10,
  loading = false,
  emptyText = 'No items match the current filters.',
  emptyFallbackText = 'No items yet.',
  keyExtractor,
  minWidth,
}) {
  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState(() => {
    const initial = {}
    filters.forEach((f) => {
      initial[f.key] = ''
    })
    return initial
  })
  const [page, setPage] = useState(1)

  const hasActiveFilters =
    search !== '' || Object.values(filterValues).some((v) => v !== '')

  function handleReset() {
    setSearch('')
    const reset = {}
    filters.forEach((f) => {
      reset[f.key] = ''
    })
    setFilterValues(reset)
    setPage(1)
  }

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const matchesSearch = searchKeys.some((key) => {
          const val = item[key]
          return val && String(val).toLowerCase().includes(search.toLowerCase())
        })
        if (!matchesSearch) return false
      }
      for (const f of filters) {
        const fv = filterValues[f.key]
        if (fv && item[f.key] !== fv) return false
      }
      return true
    })
  }, [data, search, filterValues, searchKeys, filters])

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
            {entityName}
          </h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">
            Manage all {filtered.length} {countLabel}
          </p>
        </div>
        <Link
          to={`/admin/${entityRouteBase}/create`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <CreateIcon className="h-4 w-4" />
          {createLabel}
        </Link>
      </div>

      {/* Filter Row */}
      <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        <SearchInput
          className="w-full sm:w-[300px]"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        {filters.map((f) => (
          <SelectInput
            key={f.key}
            label={f.label}
            options={f.options}
            value={filterValues[f.key]}
            onChange={(v) => {
              setFilterValues((prev) => ({ ...prev, [f.key]: v }))
              setPage(1)
            }}
            className={f.className}
          />
        ))}
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
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        loading={loading}
        emptyText={hasActiveFilters ? emptyText : emptyFallbackText}
        keyExtractor={keyExtractor}
        minWidth={minWidth}
      />
    </div>
  )
}
