import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, FileText, GripVertical, Tag, AlignLeft, Hash } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import { createCriteriaTemplate, getRoundDetail } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'

const emptyItem = () => ({ name: '', description: '', score: 20 })

/* ───────── custom score slider ───────── */
const MARKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

function ScoreSlider({ value, onChange }) {
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef(null)

  const pct = Math.min(100, Math.max(0, value))

  const updateFromClientX = useCallback((clientX) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const w = rect.width
    const raw = Math.round((x / w) * 100)
    const clamped = Math.min(100, Math.max(0, raw))
    onChange(clamped)
  }, [onChange])

  const handlePointerDown = useCallback((e) => {
    setDragging(true)
    updateFromClientX(e.clientX)
  }, [updateFromClientX])

  useEffect(() => {
    if (!dragging) return
    const move = (e) => updateFromClientX(e.clientX)
    const up = () => setDragging(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dragging, updateFromClientX])

  return (
    <div className="space-y-1.5 select-none">
      {/* track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative h-3 w-full cursor-pointer rounded-full bg-slate-100"
      >
        {/* fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
        {/* marks */}
        {MARKS.map((m) => (
          <span
            key={m}
            className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full bg-white/60"
            style={{ left: `${m}%` }}
          />
        ))}
        {/* thumb */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-75"
          style={{ left: `${pct}%` }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#064f5d] shadow-lg shadow-[#064f5d]/25">
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
          {/* bubble */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg bg-[#064f5d] px-2.5 py-1 text-[12px] font-bold text-white shadow-lg">
            {pct}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#064f5d]" />
          </div>
        </div>
      </div>
      {/* scale labels */}
      <div className="flex justify-between px-0.5">
        {MARKS.filter((_, i) => i % 2 === 0).map((m) => (
          <span key={m} className="text-[10px] font-medium text-slate-400">{m}</span>
        ))}
      </div>
    </div>
  )
}

export default function CriteriaTemplateCreate() {
  const { roundId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([emptyItem()])
  const [saving, setSaving] = useState(false)
  const [round, setRound] = useState(null)

  useEffect(() => {
    getRoundDetail(roundId).then((d) => setRound(d)).catch(() => {})
  }, [roundId])

  const canSave = title.trim().length > 0 && items.length > 0 && items.every((i) => i.name.trim() && i.score >= 0)

  function updateItem(index, field, value) {
    setItems((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: field === 'score' ? Number(value) || 0 : value }
      return next
    })
  }

  function removeItem(index) {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        items: items.map((i) => ({ name: i.name.trim(), description: i.description.trim() || undefined, score: Number(i.score) })),
      }
      await createCriteriaTemplate(roundId, payload)
      toast.success('Criteria template created successfully')
      navigate(`/admin/rounds/${roundId}/criteria-templates`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create criteria template.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/rounds/${roundId}/criteria-templates`}
      backLabel="Back to Criteria Templates"
      title="Create Criteria Template"
      description={round?.name ? `Round: ${round.name}` : ''}
      saveLabel="Create Template"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-6">
        <FormField label="Template Title" required icon={FileText}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Idea Evaluation" maxLength={200} className="field-input" />
        </FormField>

        <FormField label="Description" icon={FileText}>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Template description..." rows={3} className="field-input" />
        </FormField>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1f2f3a] flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              Criteria Items
            </h3>
            <button type="button" onClick={addItem} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#e3f2fd] px-3 py-1.5 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#bbdefb]">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-[#e8ecf0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-lg bg-[#064f5d] px-3 py-1 text-[13px] font-bold text-white">Item #{i + 1}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#fce4ec] px-2.5 py-1 text-[12px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-gray-500"><Tag className="h-3 w-3" />Name</label>
                    <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="e.g. Creativity" className="field-input" />
                  </div>
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-gray-500"><AlignLeft className="h-3 w-3" />Description (optional)</label>
                    <input type="text" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Item description..." className="field-input" />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-gray-500"><Hash className="h-3 w-3" />Score</label>
                    <ScoreSlider value={item.score} onChange={(v) => updateItem(i, 'score', v)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EntityFormPage>
  )
}
