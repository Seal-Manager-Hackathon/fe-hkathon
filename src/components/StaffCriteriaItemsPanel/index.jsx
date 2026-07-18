import { useState, useEffect, useCallback } from 'react'
import { Eye, X, Hash, CircleCheck, FileText, Calendar, Search, Trash2 } from 'lucide-react'
import { getCriteriaItems, getCriteriaItemDetail } from '../../api/staff'
import Badge from '../Badge'
import RichTextViewer from '../RichTextViewer'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import { formatDateTime } from '../../utils/format'
import { toast } from '../../utils/toast'

function ItemModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/**
 * Criteria items panel — Staff version.
 * Read-only view against staff API.
 */
export default function StaffCriteriaItemsPanel({ templateId }) {
  const [items, setItems] = useState([])
  const [itemsTotal, setItemsTotal] = useState(0)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemKeyword, setItemKeyword] = useState('')
  const [itemIsDisable, setItemIsDisable] = useState('')
  const [itemPage, setItemPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [viewingItem, setViewingItem] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!templateId) return
    setItemsLoading(true)
    try {
      const params = { PageIndex: itemPage, PageSize: ITEMS_PER_PAGE }
      if (itemKeyword) params.Keyword = itemKeyword
      if (itemIsDisable !== '') params.IsDisable = itemIsDisable === 'true'
      const result = await getCriteriaItems(templateId, params)
      setItems(result.items || [])
      setItemsTotal(result.totalCount || 0)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load items.')
    } finally { setItemsLoading(false) }
  }, [templateId, itemPage, itemKeyword, itemIsDisable])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function handleViewItem(item) {
    setViewLoading(true)
    try { const detail = await getCriteriaItemDetail(item.id); setViewingItem(detail) }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to load.') }
    finally { setViewLoading(false) }
  }

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
    {
      key: 'actions', header: 'Actions', headerIcon: Eye, headerClassName: 'text-right', className: 'text-right', render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleViewItem(row)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"><Eye className="h-3.5 w-3.5" />View</button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <FilterBar filters={itemFilters} values={{ keyword: itemKeyword, isDisable: itemIsDisable }} onChange={handleFilterChange} onReset={handleFilterReset} hasActive={hasActive} />
      </div>
      <BaseTable columns={columns} data={items} page={itemPage} pageSize={ITEMS_PER_PAGE} total={itemsTotal} onPageChange={setItemPage} loading={itemsLoading} emptyText="No criteria items found." keyExtractor={(row) => row.id} />

      {viewingItem && <ItemModal title="Criteria Item Detail" onClose={() => setViewingItem(null)}>
        {viewLoading ? <div className="space-y-3"><div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" /><div className="h-20 animate-pulse rounded bg-slate-100" /></div> : <div className="space-y-4">
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Name</p><p className="mt-1 text-[15px] font-bold text-slate-800">{viewingItem.name}</p></div>
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Score</p><p className="mt-1 text-[24px] font-bold text-[#064f5d]">{viewingItem.score}/100</p></div>
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</p><div className="mt-2 rounded-xl border border-slate-100 bg-[#fafbfc] p-4"><RichTextViewer content={viewingItem.description || 'No description.'} /></div></div>
          <div className="flex flex-wrap gap-4 text-[12px] text-slate-400"><span>Created {formatDateTime(viewingItem.createdAt)}</span><span>Updated {formatDateTime(viewingItem.updatedAt)}</span></div>
        </div>}
      </ItemModal>}
    </>
  )
}
