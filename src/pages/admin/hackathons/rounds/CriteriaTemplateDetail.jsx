import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Tag, Hash, CircleCheck, Edit, Target, AlertCircle, Pencil, X, Save, AlignLeft, Trash2, RotateCcw, Eye, Plus, Search, Ban, MoreHorizontal } from 'lucide-react'
import { getCriteriaTemplateDetail, getRoundDetail, updateCriteriaItem, deleteCriteriaItem, restoreCriteriaItem, getCriteriaItemDetail, createCriteriaItem } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import RichTextViewer from '../../../../components/RichTextViewer'
import RichTextEditor from '../../../../components/RichTextEditor'
import ScoreSlider from '../../../../components/ScoreSlider'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import { formatDateTime, formatDate } from '../../../../utils/format'
import { cn } from '../../../../utils/cn'
import { toast, confirm } from '../../../../utils/toast'

export default function CriteriaTemplateDetail() {
  const { roundId, templateId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [template, setTemplate] = useState(null)
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [itemSaving, setItemSaving] = useState(false)
  const [viewingItem, setViewingItem] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [creatingItem, setCreatingItem] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', description: '', score: 0 })
  const [itemCreating, setItemCreating] = useState(false)
  // Items filter (client-side)
  const [itemKeyword, setItemKeyword] = useState('')
  const [itemIsDisable, setItemIsDisable] = useState('')
  const [itemPage, setItemPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [activeTab, setActiveTab] = useState(tabParam === 'items' ? 'items' : 'description')

  useEffect(() => {
    if (tabParam === 'items' || tabParam === 'description') {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const setTab = useCallback((tab) => {
    setActiveTab(tab)
    setSearchParams({ tab }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const data = await getCriteriaTemplateDetail(templateId)
        if (cancelled) return
        setTemplate(data)
        try {
          const r = await getRoundDetail(roundId)
          if (!cancelled) setRound(r)
        } catch {}
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load template.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId, templateId])

  async function handleSaveItem() {
    if (!editingItem) return
    setItemSaving(true)
    try {
      const payload = {
        name: editingItem.name,
        description: editingItem.description,
        score: editingItem.score,
        isDisable: editingItem.isDisable,
      }
      await updateCriteriaItem(editingItem.id, payload)
      setTemplate((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === editingItem.id ? { ...it, ...payload } : it
        ),
      }))
      toast.success('Criteria item updated!')
      setEditingItem(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update item.')
    } finally {
      setItemSaving(false)
    }
  }

  async function handleDeleteItem(item) {
    const ok = await confirm('Delete Item', `Are you sure you want to delete "${item.name}"?`)
    if (!ok) return
    try {
      await deleteCriteriaItem(item.id)
      toast.success('Criteria item deleted')
      setTemplate((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === item.id ? { ...it, isDisable: true } : it
        ),
      }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete item.')
    }
  }

  async function handleRestoreItem(item) {
    const ok = await confirm('Restore Item', `Are you sure you want to restore "${item.name}"?`)
    if (!ok) return
    try {
      await restoreCriteriaItem(item.id)
      toast.success('Criteria item restored')
      setTemplate((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === item.id ? { ...it, isDisable: false } : it
        ),
      }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore item.')
    }
  }

  async function handleViewItem(item) {
    setViewLoading(true)
    try {
      const detail = await getCriteriaItemDetail(item.id)
      setViewingItem(detail)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load item detail.')
    } finally {
      setViewLoading(false)
    }
  }

  async function handleCreateItem() {
    if (!newItem.name.trim()) return
    setItemCreating(true)
    try {
      await createCriteriaItem(templateId, {
        name: newItem.name.trim(),
        description: newItem.description || undefined,
        score: newItem.score,
      })
      toast.success('Criteria item created!')
      const data = await getCriteriaTemplateDetail(templateId)
      setTemplate(data)
      setCreatingItem(false)
      setNewItem({ name: '', description: '', score: 0 })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create item.')
    } finally {
      setItemCreating(false)
    }
  }

  function openCreateItem() {
    setNewItem({ name: '', description: '', score: 0 })
    setCreatingItem(true)
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />))}
        </div>
      </div>
    )
  }

  if (error || !template) {
    const isNotFound = error?.includes('Not Found') || error === 'Resource Not Found'
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${isNotFound ? 'bg-amber-50 text-amber-400' : 'bg-rose-50 text-rose-400'}`}>
          {isNotFound ? <FileText className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
        </div>
        <h2 className="text-[20px] font-bold text-slate-700">{isNotFound ? 'Template Not Found' : 'Something went wrong'}</h2>
        <p className="mt-2 max-w-md text-[14px] text-slate-500">{isNotFound ? 'The criteria template does not exist.' : error}</p>
        <Link to={`/admin/rounds/${roundId}/criteria-templates`} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#05404a]">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>
      </div>
    )
  }

  const items = template.items || []
  const totalScore = items.reduce((sum, i) => sum + (Number(i.score) || 0), 0)
  const isDeleted = template.isDisable

  // Client-side filter items
  let filteredItems = items
  if (itemKeyword) {
    const kw = itemKeyword.toLowerCase()
    filteredItems = filteredItems.filter((it) => it.name.toLowerCase().includes(kw))
  }
  if (itemIsDisable !== '') {
    filteredItems = filteredItems.filter((it) => it.isDisable === (itemIsDisable === 'true'))
  }

  const itemHasActive = itemKeyword !== '' || itemIsDisable !== ''
  const itemFilters = [
    { type: 'search', key: 'keyword', label: 'Name', icon: Search, placeholder: 'Search item name...' },
    { type: 'select', key: 'isDisable', label: 'Disabled', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  ]

  function handleItemFilterChange(key, value) {
    if (key === 'keyword') setItemKeyword(value)
    if (key === 'isDisable') setItemIsDisable(value)
    setItemPage(1)
  }

  function handleItemFilterReset() {
    setItemKeyword('')
    setItemIsDisable('')
    setItemPage(1)
  }

  const actionBtnClass = 'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
  const restoreBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'
  const dangerBtnClass = 'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'

  const itemColumns = [
    {
      key: 'name',
      header: 'Name',
      headerIcon: FileText,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#064f5d]">{row.name}</span>
          <Badge label={row.isDisable ? 'Disabled' : 'Active'} className={row.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} />
        </div>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      headerIcon: Hash,
      render: (row) => {
        const s = Number(row.score) || 0
        const pct = Math.round((s / 100) * 100)
        const barColor = pct <= 30 ? 'bg-rose-400' : pct <= 60 ? 'bg-amber-400' : 'bg-emerald-400'
        const textColor = pct <= 30 ? 'text-rose-600' : pct <= 60 ? 'text-amber-600' : 'text-emerald-600'
        return (
          <div className="min-w-[120px] space-y-1">
            <span className={`text-[13px] font-bold ${textColor}`}>{s}/100 <span className="font-normal text-slate-300">({pct}%)</span></span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleViewItem(row)} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button onClick={() => setEditingItem({ ...row })} className={actionBtnClass}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          {row.isDisable ? (
            <button onClick={() => handleRestoreItem(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <button onClick={() => handleDeleteItem(row)} className={dangerBtnClass}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <Link to={`/admin/rounds/${roundId}/criteria-templates`} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Criteria Templates
        </Link>
      </nav>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#064f5d]/15 bg-gradient-to-br from-[#064f5d] via-[#0a6e7d] to-[#0d8a96] p-6 text-white shadow-lg shadow-[#064f5d]/10 sm:p-7">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-white/5" />
        <div className="absolute bottom-0 right-16 h-24 w-24 rounded-tl-full bg-white/5" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge label={isDeleted ? 'Deleted' : 'Active'} className={isDeleted ? 'bg-white/15 text-white border border-white/20' : 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'} />
              {round && (<span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80"><Target className="h-3 w-3" />{round.name}</span>)}
            </div>
            <h1 className="text-[24px] font-bold leading-tight break-words text-white sm:text-[30px]">{template.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-white/70">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Created {formatDate(template.createdAt)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Updated {formatDate(template.updatedAt)}</span>
            </div>
          </div>
          {!isDeleted && (
            <Link to={`/admin/rounds/${roundId}/criteria-templates/${templateId}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-[14px] font-semibold text-white backdrop-blur-sm border border-white/20 hover:bg-white/25 active:scale-[0.97] shrink-0 self-start">
              <Edit className="h-4 w-4" />Edit Template
            </Link>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<CircleCheck className="h-5 w-5" />} label="Total Score" value={totalScore} color="text-emerald-500" bg="bg-emerald-50" border="border-emerald-100" />
        <StatCard icon={<Hash className="h-5 w-5" />} label="Criteria Items" value={items.length} color="text-violet-500" bg="bg-violet-50" border="border-violet-100" />
        <StatCard icon={<Calendar className="h-5 w-5" />} label="Created" value={formatDateTime(template.createdAt)} color="text-amber-500" bg="bg-amber-50" border="border-amber-100" mono />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Last Updated" value={formatDateTime(template.updatedAt)} color="text-blue-500" bg="bg-blue-50" border="border-blue-100" mono />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        <div className="flex bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <TabBtn active={activeTab === 'description'} onClick={() => setTab('description')} icon={FileText} label="Template Description" />
          <TabBtn active={activeTab === 'items'} onClick={() => setTab('items')} icon={Tag} label="Criteria Items" />
        </div>

        {activeTab === 'description' && (
          <div className="px-6 py-5">
            {template.description ? (
              <RichTextViewer content={template.description} />
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"><FileText className="h-7 w-7 text-slate-300" /></div>
                <p className="text-[14px] font-medium text-slate-400">No description provided</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <FilterBar
                filters={itemFilters}
                values={{ keyword: itemKeyword, isDisable: itemIsDisable }}
                onChange={handleItemFilterChange}
                onReset={handleItemFilterReset}
                hasActive={itemHasActive}
              />
              <button
                onClick={openCreateItem}
                className="ml-4 inline-flex cursor-pointer shrink-0 items-center gap-1.5 rounded-lg bg-[#064f5d] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#05404a]"
              >
                <Plus className="h-3.5 w-3.5" />Add Item
              </button>
            </div>
            <BaseTable
              columns={itemColumns}
              data={filteredItems}
              page={itemPage}
              pageSize={ITEMS_PER_PAGE}
              total={filteredItems.length}
              onPageChange={setItemPage}
              loading={false}
              serverSide={false}
              emptyText={itemHasActive ? 'No criteria items match the current filters.' : 'No criteria items yet.'}
              keyExtractor={(row) => row.id}
              minWidth="600px"
            />
          </div>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingItem(null)} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-800">Edit Criteria Item</h3>
              <button onClick={() => setEditingItem(null)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Name</label>
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem((p) => ({ ...p, name: e.target.value }))} className="field-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Description</label>
                <div className="max-h-[220px] overflow-y-auto rounded-lg border border-[#d8e0e6]">
                  <RichTextEditor value={editingItem.description || ''} onChange={(v) => setEditingItem((p) => ({ ...p, description: v }))} placeholder="Item description..." />
                </div>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">Score (0-100)</label>
                <ScoreSlider value={editingItem.score} onChange={(v) => setEditingItem((p) => ({ ...p, score: v }))} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditingItem(null)} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSaveItem} disabled={itemSaving || !editingItem.name.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-4 w-4" />{itemSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewingItem(null)} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-800">Criteria Item Detail</h3>
              <button onClick={() => setViewingItem(null)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Name</label>
                <p className="text-[15px] font-bold text-slate-800">{viewingItem.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</label>
                  <Badge label={viewingItem.isDisable ? 'Disabled' : 'Active'} className={viewingItem.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Score</label>
                  <p className="text-[15px] font-semibold text-[#064f5d]">{viewingItem.score}/100</p>
                </div>
              </div>
              {viewingItem.description ? (
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</label>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4 text-[14px] leading-relaxed text-slate-600">
                    <RichTextViewer content={viewingItem.description} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</label>
                  <p className="text-[14px] italic text-slate-300">No description</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Created</label>
                  <p className="text-[13px] text-slate-500">{formatDateTime(viewingItem.createdAt)}</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Updated</label>
                  <p className="text-[13px] text-slate-500">{formatDateTime(viewingItem.updatedAt)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewingItem(null)} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a]">Close</button>
            </div>
          </div>
        </div>
      )}

      {creatingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreatingItem(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-800">Create Criteria Item</h3>
              <button onClick={() => setCreatingItem(false)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Name *</label>
                <input type="text" value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} className="field-input" placeholder="e.g. Creativity" maxLength={200} />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-slate-500">Description</label>
                <div className="max-h-[220px] overflow-y-auto rounded-lg border border-[#d8e0e6]">
                  <RichTextEditor value={newItem.description} onChange={(v) => setNewItem((p) => ({ ...p, description: v }))} placeholder="Item description..." />
                </div>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-500">Score (0-100)</label>
                <ScoreSlider value={newItem.score} onChange={(v) => setNewItem((p) => ({ ...p, score: v }))} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setCreatingItem(false)} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreateItem} disabled={itemCreating || !newItem.name.trim()} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50">
                <Plus className="h-4 w-4" />{itemCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button type="button" onClick={onClick} className={cn('relative flex-1 cursor-pointer px-5 py-3.5 text-[13px] font-semibold transition-all duration-200', active ? 'bg-white text-[#064f5d]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')}>
      <span className="inline-flex items-center gap-2"><Icon className={cn('h-4 w-4 transition-colors duration-200', active ? 'text-[#064f5d]' : 'text-slate-400')} />{label}</span>
      {active && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#064f5d]" />}
    </button>
  )
}

function StatCard({ icon, label, value, color, bg, border, mono = false }) {
  return (
    <div className={`rounded-2xl border ${border} ${bg} p-4 sm:p-5 flex flex-col gap-1.5 transition-shadow hover:shadow-sm`}>
      <div className="flex items-center gap-2"><span className={color}>{icon}</span><span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span></div>
      <p className={`font-bold text-slate-800 ${mono ? 'text-[12px] sm:text-[13px]' : 'text-[18px] sm:text-[22px]'}`}>{value}</p>
    </div>
  )
}
