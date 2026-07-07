import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../FilterBar'
import BaseTable from '../BaseTable'

/**
 * Reusable client-side data management page with search, selects, and reset.
 * Renders entity list using BaseTable.
 * For server-side pagination use a custom page instead.
 */
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
    filters.forEach((f) => { initial[f.key] = '' })
    return initial
  })
  const [page, setPage] = useState(1)

  const allValues = { search, ...filterValues }
  const hasActiveFilters =
    allValues.search !== '' || Object.values(filterValues).some((v) => v !== '')

  function handleFilterChange(key, value) {
    if (key === 'search') setSearch(value)
    else setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  function handleReset() {
    setSearch('')
    const reset = {}
    filters.forEach((f) => { reset[f.key] = '' })
    setFilterValues(reset)
    setPage(1)
  }

  const filterBarItems = [
    { type: 'search', key: 'search', placeholder: searchPlaceholder, className: 'w-full sm:w-[300px]' },
    ...filters.map((f) => ({ type: 'select', key: f.key, label: f.label, options: f.options, className: f.className })),
  ]

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (search) {
        const matches = searchKeys.some((key) => {
          const val = item[key]
          return val && String(val).toLowerCase().includes(search.toLowerCase())
        })
        if (!matches) return false
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

      <FilterBar
        filters={filterBarItems}
        values={allValues}
        onChange={handleFilterChange}
        onReset={handleReset}
        hasActive={hasActiveFilters}
      />

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
