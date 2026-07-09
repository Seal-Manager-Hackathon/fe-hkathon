# 05 — Code Patterns

## Pattern 1: Server-Side Paginated List Page (The Core Admin Pattern)

Every admin list page follows this exact pattern. Use it as the template for any new CRUD list page.

### Structure

```
MyEntityManagement.jsx  — page component
MyEntityFilters.jsx     — filter descriptor array (exported as constant)
MyEntityColumns.jsx     — column definitions with render functions
```

### Management Page Template

```jsx
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { getEntities, deleteEntity } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { entityFilters } from './EntityFilters'
import { entityColumns } from './EntityColumns'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast, confirm } from '../../../utils/toast'

const PAGE_SIZE = 10
const DEFAULT_VALUES = { keyword: '', status: '', /* ...filter keys */ }

export default function EntityManagement() {
  // buildParams: maps filter state to API params
  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    if (filters.keyword) params.Keyword = filters.keyword
    // ... map each filter key
    return params
  }, [])

  const {
    data, totalCount, loading, error,
    filters, pageIndex, hasActive,
    setPageIndex, handleFilterChange, handleReset, refetch,
  } = useServerPagination({ fetchFn: getEntities, defaultFilters: DEFAULT_VALUES, pageSize: PAGE_SIZE, buildParams })

  // Delete handler with confirmation
  async function handleDelete(entity) {
    const ok = await confirm('Delete', `Delete "${entity.name}"?`)
    if (!ok) return
    try { await deleteEntity(entity.id); toast.success('Deleted'); refetch() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Header: title + create button */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Entities</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">Manage all {totalCount} entities.</p>
        </div>
        <Link to="/admin/entities/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Plus className="h-4 w-4" />Create Entity
        </Link>
      </div>

      <FilterBar filters={entityFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />
      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}
      <BaseTable columns={entityColumns(handleDelete)} data={data} page={pageIndex} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPageIndex} loading={loading} serverSide keyExtractor={row => row.id} minWidth="800px" />
    </div>
  )
}
```

### Filters File Template

```jsx
import { Search, CircleDot } from 'lucide-react'
import { STATUS_OPTIONS_ALL } from '../../../constants/adminOptions'

export const entityFilters = [
  { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search...', className: 'w-full sm:w-[280px]' },
  { type: 'select', key: 'status', label: 'Status', icon: CircleDot, options: STATUS_OPTIONS_ALL, className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'fromDate', label: 'From', icon: Calendar, className: 'w-full sm:w-[180px]' },
  { type: 'date', key: 'toDate', label: 'To', icon: Calendar, className: 'w-full sm:w-[180px]' },
]
```

### Columns File Template

```jsx
import { Link } from 'react-router-dom'
import { Eye, Edit, Trash2, Trophy } from 'lucide-react'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const actionBtnClass = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const dangerBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'

export function entityColumns(onDelete) {
  return [
    { key: 'name', header: 'Name', headerIcon: Trophy,
      render: (row) => <Link to={`/admin/entities/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.name}</Link>
    },
    { key: 'status', header: 'Status', headerIcon: CircleDot,
      render: (row) => <Badge label={row.status} className={statusBadge[row.status]} />
    },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>
    },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/entities/${row.id}`} className={actionBtnClass}><Eye className="h-3.5 w-3.5" />View</Link>
          <Link to={`/admin/entities/${row.id}/edit`} className={actionBtnClass}><Edit className="h-3.5 w-3.5" />Edit</Link>
          <button onClick={() => onDelete?.(row)} className={dangerBtnClass}><Trash2 className="h-3.5 w-3.5" />Delete</button>
        </div>
      )
    },
  ]
}
```


## Pattern 2: Create/Edit Form Page

Uses `EntityFormPage` wrapper with `FormField` components and `field-input` CSS class.

```jsx
<EntityFormPage backUrl="/admin/entities" backLabel="Back" title="Create"
  saveLabel="Create" canSave={canSave} onSave={handleSave} saving={saving}>
  <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
    <FormField label="Name" required>
      <input type="text" value={form.name} onChange={...} className="field-input" />
    </FormField>
  </div>
</EntityFormPage>
```

Always use `field-input` CSS class on inputs. Always use `FormField` wrapper. `canSave` checks required fields. `saving` boolean = loading.

## Pattern 3: Detail Page with Tabs

URL search params control active tab. Use `useSearchParams()` to set `?tab=Rounds`.

```jsx
const [searchParams, setSearchParams] = useSearchParams()
const tab = searchParams.get('tab') || 'Overview'
// switch: setSearchParams({ tab: key }, { replace: true })
```

Handle: loading (skeleton), error (message + back link), not-found, success states.

## Pattern 4: useServerPagination Hook

Returns: `{ data, totalCount, loading, error, filters, pageIndex, hasActive, setPageIndex, handleFilterChange, handleReset, refetch }`.

```jsx
useServerPagination({
  fetchFn: apiFunction,       // async(params) => { data, totalCount }
  defaultFilters: { k: '' },   // initial values
  pageSize: 10,
  buildParams: (filters, pageIndex) => ({ ...filters, PageIndex: pageIndex, PageSize: 10 }),
})
```

## Pattern 5: Toast & Confirm

```js
import { toast, confirm } from '../utils/toast'
toast.success('Done')  // also: .error(), .warning(), .info()
const ok = await confirm('Title', 'Are you sure?')
```

## Pattern 6: Error Handling

```js
try { await apiCall() }
catch (err) { toast.error(err?.response?.data?.message || 'Failed') }
```

## Pattern 7: API Functions

Always extract `data.data`:
```js
export async function getItems(params) {
  const { data } = await api.get('/admin/items', { params })
  return data.data  // { items: [], totalCount: N }
}
```
