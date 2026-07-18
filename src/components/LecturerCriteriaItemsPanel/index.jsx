import { useState, useEffect, useCallback } from 'react'
import { Hash, CircleCheck, FileText, Calendar, Search, Trash2 } from 'lucide-react'
import { getLecturerCriteriaItems } from '../../api/lecturer'
import Badge from '../Badge'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import { formatDateTime } from '../../utils/format'
import { toast } from '../../utils/toast'

/**
 * Criteria items panel — Lecturer version.
 * Read-only view against lecturer API.
 */
export default function LecturerCriteriaItemsPanel({ templateId }) {
  const [items, setItems] = useState([])
  const [itemsTotal, setItemsTotal] = useState(0)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemKeyword, setItemKeyword] = useState('')
  const [itemIsDisable, setItemIsDisable] = useState('')
  const [itemPage, setItemPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const fetchItems = useCallback(async () => {
    if (!templateId) return
    setItemsLoading(true)
    try {
      const params = { PageIndex: itemPage, PageSize: ITEMS_PER_PAGE }
      if (itemKeyword) params.Keyword = itemKeyword
      if (itemIsDisable !== '') params.IsDisable = itemIsDisable === 'true'
      const result = await getLecturerCriteriaItems(templateId, params)
      setItems(result.items || [])
      setItemsTotal(result.totalCount || 0)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load items.')
    } finally { setItemsLoading(false) }
  }, [templateId, itemPage, itemKeyword, itemIsDisable])

  useEffect(() => { fetchItems() }, [fetchItems])

  const itemFilters = [
    { type: 'search', key: 'keyword', label: 'Name', icon: Search, placeholder: 'Search item name...' },
    { type: 'select', key: 'isDisable', label: 'Deleted', icon: Trash2, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  ]

  function handleFilterChange(key, value) {
    if (key === 'keyword') setItemKeyword(value)
    if (key === 'isDisable') setItemIsDisable(value)
    setItemPage(1)
  }

  function handleFilterReset() { setItemKeyword(''); setItemIsDisable(''); setItemPage(1) }

  const hasActive = itemKeyword !== '' || itemIsDisable !== ''

  const columns = [
    { key: 'name', header: 'Name', headerIcon: FileText, render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.name}</span> },
    { key: 'score', header: 'Score', headerIcon: Hash, render: (row) => {
      const s = Number(row.score) || 0; const pct = Math.round((s / 100) * 100)
      const barColor = pct <= 30 ? 'bg-rose-400' : pct <= 60 ? 'bg-amber-400' : 'bg-emerald-400'
      const textColor = pct <= 30 ? 'text-rose-600' : pct <= 60 ? 'text-amber-600' : 'text-emerald-600'
      return <div className="min-w-[120px] space-y-1"><span className={`text-[13px] font-bold ${textColor}`}>{s}/100 <span className="font-normal text-slate-300">({pct}%)</span></span><div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} /></div></div>
    }},
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label={row.isDisable ? 'Deleted' : 'Active'} className={row.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <FilterBar filters={itemFilters} values={{ keyword: itemKeyword, isDisable: itemIsDisable }} onChange={handleFilterChange} onReset={handleFilterReset} hasActive={hasActive} />
      </div>
      <BaseTable columns={columns} data={items} page={itemPage} pageSize={ITEMS_PER_PAGE} total={itemsTotal} onPageChange={setItemPage} loading={itemsLoading} emptyText="No criteria items found." keyExtractor={(row) => row.id} />
    </>
  )
}
