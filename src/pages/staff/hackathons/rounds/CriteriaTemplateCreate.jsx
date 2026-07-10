import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, FileText, GripVertical, Tag, AlignLeft, Hash } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import ScoreSlider from '../../../../components/ScoreSlider'
import { createCriteriaTemplate, getRoundDetail } from '../../../../api/staff'
import { toast } from '../../../../utils/toast'

const emptyItem = () => ({ name: '', description: '', score: 20 })

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

  const updateItem = (i, field, val) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)))
  }

  const addItem = () => setItems((prev) => [...prev, emptyItem()])
  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i))

  const canSave = title.trim().length > 0 && items.length > 0 && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      await createCriteriaTemplate(roundId, { title: title.trim(), description, items })
      toast.success('Criteria template created!')
      navigate(`/staff/rounds/${roundId}/criteria-templates`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create criteria template.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/staff/rounds/${roundId}/criteria-templates`}
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
          <RichTextEditor value={description} onChange={setDescription} placeholder="Template description..." />
        </FormField>

        <div>
          <div className="mb-3">
            <h3 className="text-[15px] font-bold text-[#1f2f3a] flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400" />
              Criteria Items
            </h3>
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
                    <label className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-gray-500"><AlignLeft className="h-3 w-3" />Description</label>
                    <RichTextEditor value={item.description} onChange={(v) => updateItem(i, 'description', v)} placeholder="Item description..." />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-gray-500"><Hash className="h-3 w-3" />Score</label>
                    <ScoreSlider value={item.score} onChange={(v) => updateItem(i, 'score', v)} />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#d8e0e6] bg-white px-4 py-4 text-[14px] font-semibold text-gray-400 transition-colors hover:border-[#064f5d] hover:text-[#064f5d]"
            >
              <Plus className="h-5 w-5" />
              Add Item
            </button>
          </div>
        </div>
      </div>
    </EntityFormPage>
  )
}
