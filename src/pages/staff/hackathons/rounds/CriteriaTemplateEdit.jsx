import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, Save, ListChecks } from 'lucide-react'
import FormField from '../../../../components/FormField'
import RichTextEditor from '../../../../components/RichTextEditor'
import StaffCriteriaItemsPanel from '../../../../components/StaffCriteriaItemsPanel'
import { getCriteriaTemplateDetail, getRoundDetail, updateCriteriaTemplate } from '../../../../api/staff'
import { toast } from '../../../../utils/toast'

const TABS = [
  { key: 'info', label: 'Template Info', icon: <FileText className="h-4 w-4" /> },
  { key: 'items', label: 'Criteria Items', icon: <ListChecks className="h-4 w-4" /> },
]

export default function CriteriaTemplateEdit() {
  const { roundId, templateId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [round, setRound] = useState(null)
  const [tab, setTab] = useState('info')

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const [tpl, r] = await Promise.all([
          getCriteriaTemplateDetail(templateId),
          getRoundDetail(roundId).catch(() => null),
        ])
        if (cancelled) return
        setTitle(tpl.title || '')
        setDescription(tpl.description || '')
        if (r) setRound(r)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load template.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [roundId, templateId])

  const canSave = title.trim().length > 0 && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      await updateCriteriaTemplate(templateId, { title: title.trim(), description })
      toast.success('Template updated!')
      navigate(`/staff/rounds/${roundId}/criteria-templates/${templateId}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update template.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-[18px] font-semibold text-[#c62828]">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 cursor-pointer text-[14px] font-medium text-[#064f5d] hover:underline">Go back</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <button onClick={() => navigate(`/staff/rounds/${roundId}/criteria-templates/${templateId}`)} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Template
        </button>
      </nav>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit Template</h1>
        {round && <p className="mt-1 text-[13px] text-gray-400">Round: {round.name}</p>}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[#f5f5f5] p-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all cursor-pointer ${tab === t.key ? 'bg-white text-[#1f2f3a] shadow-sm' : 'text-gray-500 hover:text-[#1f2f3a]'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Tab: Template Info */}
      {tab === 'info' && (
        <div className="rounded-2xl border border-[#e8ecf0] bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <FormField label="Template Title" required icon={FileText}>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Idea Evaluation" maxLength={200} className="field-input" />
            </FormField>
            <FormField label="Description" icon={FileText}>
              <RichTextEditor value={description} onChange={setDescription} placeholder="Template description..." />
            </FormField>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <button onClick={() => navigate(`/staff/rounds/${roundId}/criteria-templates/${templateId}`)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={!canSave} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#05404a] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Criteria Items */}
      {tab === 'items' && (
        <StaffCriteriaItemsPanel templateId={templateId} />
      )}
    </div>
  )
}
