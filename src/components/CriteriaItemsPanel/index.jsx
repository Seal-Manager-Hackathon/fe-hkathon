import { useState, useEffect, useCallback } from 'react'
import { Eye, Pencil, Trash2, RotateCcw, Plus, X, Hash, CircleCheck, FileText, Calendar, Search, MoreHorizontal } from 'lucide-react'
import {
  getCriteriaItems, getCriteriaItemDetail, createCriteriaItem,
  updateCriteriaItem, deleteCriteriaItem, restoreCriteriaItem
} from '../../api/admin'
import Badge from '../Badge'
import RichTextEditor from '../RichTextEditor'
import RichTextViewer from '../RichTextViewer'
import ScoreSlider from '../ScoreSlider'
import BaseTable from '../BaseTable'
import FilterBar from '../FilterBar'
import { formatDateTime } from '../../utils/format'
import { toast, confirm } from '../../utils/toast'

function ItemModal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function CriteriaItemsPanel({ templateId }) {
  const [items, setItems] = useState([])
  const [itemsTotal, setItemsTotal] = useState(0)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemKeyword, setItemKeyword] = useState('')
  const [itemIsDisable, setItemIsDisable] = useState('')
  const [itemPage, setItemPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [editingItem, setEditingItem] = useState(null)
  const [itemSaving, setItemSaving] = useState(false)
  const [viewingItem, setViewingItem] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [creatingItem, setCreatingItem] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '', score: 20 })
  const [itemCreating, setItemCreating] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!templateId) return
    setItemsLoading(true)
    try {
      const params = { pageIndex: itemPage, pageSize: ITEMS_PER_PAGE }
      if (itemKeyword) params.keyword = itemKeyword
      if (itemIsDisable !== '') params.isDisable = itemIsDisable === 'true'
      const result = await getCriteriaItems(templateId, params)
      setItems(result.items || [])
      setItemsTotal(result.totalCount || 0)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load items.')
    } finally { setItemsLoading(false) }
  }, [templateId, itemPage, itemKeyword, itemIsDisable])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function handleSaveItem() {
    if (!editingItem) return
    setItemSaving(true)
    try {
      await updateCriteriaItem(editingItem.id, {
        name: editingItem.name, description: editingItem.description,
        score: editingItem.score, isDisable: editingItem.isDisable,
      })
      toast.success('Criteria item updated!')
      setEditingItem(null)
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update item.')
    } finally { setItemSaving(false) }
  }

  async function handleDeleteItem(item) {
    const ok = await confirm('Delete Item', `Delete "${item.name}"?`)
    if (!ok) return
    try { await deleteCriteriaItem(item.id); toast.success('Deleted'); fetchItems() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  async function handleRestoreItem(item) {
    const ok = await confirm('Restore Item', `Restore "${item.name}"?`)
    if (!ok) return
    try { await restoreCriteriaItem(item.id); toast.success('Restored'); fetchItems() }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed.') }
  }

  async function handleViewItem(item) {
    setViewLoading(true)
    try { const detail = await getCriteriaItemDetail(item.id); setViewingItem(detail) }
    catch (err) { toast.error(err?.response?.data?.message || 'Failed to load.') }
    finally { setViewLoading(false) }
  }

  async function handleCreateItem() {
    if (!newItem.name.trim()) return
    setItemCreating(true)
    try {
      await createCriteriaItem(templateId, { name: newItem.name.trim(), description: newItem.description || undefined, score: newItem.score })
      toast.success('Criteria item created!')
      setCreatingItem(false)
      setNewItem({ name: '', description: '', score: 20 })
      fetchItems()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create item.')
    } finally { setItemCreating(false) }
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
  const btnClass = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]'
  const restoreClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] hover:bg-[#c8e6c9] w-[92px]'
  const dangerClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] hover:bg-[#ffcdd2] w-[92px]'

  const itemColumns = [
    { key: 'name', header: 'Name', headerIcon: FileText, render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.name}</span> },
    { key: 'score', header: 'Score', headerIcon: Hash, render: (row) => {
      const s = Number(row.score) || 0; const pct = Math.round((s / 100) * 100)
      const barColor = pct <= 30 ? 'bg-rose-400' : pct <= 60 ? 'bg-amber-400' : 'bg-emerald-400'
      const textColor = pct <= 30 ? 'text-rose-600' : pct <= 60 ? 'text-amber-600' : 'text-emerald-600'
      return <div className="min-w-[120px] space-y-1"><span className={`text-[13px] font-bold ${textColor}`}>{s}/100 <span className="font-normal text-slate-300">({pct}%)</span></span><div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} /></div></div>
    }},
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label={row.isDisable ? 'Deleted' : 'Active'} className={row.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p> },
    { key: 'actions', header: 'Actions', headerIcon: MoreHorizontal, headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => handleViewItem(row)} className={btnClass}><Eye className="h-3.5 w-3.5" />View</button>
        <button onClick={() => setEditingItem({ ...row })} className={btnClass}><Pencil className="h-3.5 w-3.5" />Edit</button>
        {row.isDisable
          ? <button onClick={() => handleRestoreItem(row)} className={restoreClass}><RotateCcw className="h-3.5 w-3.5" />Restore</button>
          : <button onClick={() => handleDeleteItem(row)} className={dangerClass}><Trash2 className="h-3.5 w-3.5" />Delete</button>
        }
      </div>
    )},
  ]

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <FilterBar filters={itemFilters} values={{ keyword: itemKeyword, isDisable: itemIsDisable }} onChange={handleFilterChange} onReset={handleFilterReset} hasActive={hasActive} />
        <button onClick={() => { setNewItem({ name: '', description: '', score: 20 }); setCreatingItem(true) }} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#05404a]"><Plus className="h-4 w-4" />Create Item</button>
      </div>
      <BaseTable columns={itemColumns} data={items} page={itemPage} pageSize={ITEMS_PER_PAGE} total={itemsTotal} onPageChange={setItemPage} loading={itemsLoading} emptyText="No criteria items found." keyExtractor={(row) => row.id} />

      {creatingItem && <ItemModal title="Create Criteria Item" onClose={() => setCreatingItem(false)}>
        <div><label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Name *</label><input type="text" value={newItem.name} onChange={(e) => setNewItem(p => ({ ...p, name: e.target.value }))} className="field-input" placeholder="e.g. Creativity" maxLength={200} /></div>
        <div className="mt-4"><label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Description</label><div className="max-h-[220px] overflow-y-auto rounded-lg border border-[#d8e0e6]"><RichTextEditor value={newItem.description} onChange={(v) => setNewItem(p => ({ ...p, description: v }))} placeholder="Item description..." /></div></div>
        <div className="mt-4"><label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">Score (0-100)</label><ScoreSlider value={newItem.score} onChange={(v) => setNewItem(p => ({ ...p, score: v }))} /></div>
        <div className="mt-6 flex justify-end gap-3"><button onClick={() => setCreatingItem(false)} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleCreateItem} disabled={itemCreating || !newItem.name.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"><Plus className="h-4 w-4" />{itemCreating ? 'Creating...' : 'Create'}</button></div>
      </ItemModal>}

      {editingItem && <ItemModal title="Edit Criteria Item" onClose={() => setEditingItem(null)}>
        <div><label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Name *</label><input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="field-input" placeholder="e.g. Creativity" maxLength={200} /></div>
        <div className="mt-4"><label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Description</label><div className="max-h-[220px] overflow-y-auto rounded-lg border border-[#d8e0e6]"><RichTextEditor value={editingItem.description || ''} onChange={(v) => setEditingItem({ ...editingItem, description: v })} placeholder="Item description..." /></div></div>
        <div className="mt-4"><label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">Score (0-100)</label><ScoreSlider value={editingItem.score ?? 20} onChange={(v) => setEditingItem({ ...editingItem, score: v })} /></div>
        <div className="mt-4 border-t border-slate-100 pt-4"><label className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Trash2 className="h-4 w-4" />Status</label><label className="inline-flex cursor-pointer items-center gap-2"><input type="checkbox" checked={!!editingItem.isDisable} onChange={(e) => setEditingItem({ ...editingItem, isDisable: e.target.checked })} className="form-checkbox h-4 w-4 rounded border-slate-300 text-[#c62828] focus:ring-[#c62828]" /><span className="text-[13px] text-slate-600">Disabled (soft-delete)</span></label></div>
        <div className="mt-6 flex justify-end gap-3"><button onClick={() => setEditingItem(null)} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button onClick={handleSaveItem} disabled={itemSaving || !editingItem.name.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50">{itemSaving ? 'Saving...' : 'Save Changes'}</button></div>
      </ItemModal>}

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
