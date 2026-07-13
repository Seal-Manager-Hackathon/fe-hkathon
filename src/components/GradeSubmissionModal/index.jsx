import { useState, useEffect, useCallback } from 'react'
import { X, Star, Loader2, FileText, CheckCircle } from 'lucide-react'
import { getLecturerCriteriaTemplates, getLecturerCriteriaItems, gradeJudgeSubmission, regradeJudgeSubmission } from '../../api/lecturer'
import ScoreSlider from '../ScoreSlider'
import RichTextEditor from '../RichTextEditor'
import { toast } from '../../utils/toast'

export default function GradeSubmissionModal({ open, onClose, submissionId, roundId, onSuccess, mode = 'grade', scoreId = null }) {
  const [templates, setTemplates] = useState([])
  const [criteriaMap, setCriteriaMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scores, setScores] = useState({})
  const [comments, setComments] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Reset state and fetch criteria on open
  useEffect(() => {
    if (!open || !roundId) return
    setScores({}); setComments({}); setError('')
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const result = await getLecturerCriteriaTemplates(roundId, { PageSize: 100 })
        const tpls = (result.templates || []).filter(t => t.isActive)
        if (cancelled) return
        setTemplates(tpls)
        const map = {}
        await Promise.all(tpls.map(async (tpl) => {
          try {
            const itemsResult = await getLecturerCriteriaItems(tpl.id, { PageSize: 100 })
            map[tpl.id] = (itemsResult.items || []).filter(item => !item.isDisable)
          } catch {}
        }))
        if (!cancelled) {
          setCriteriaMap(map)
          // Initialize all scores to 0 by default so API always sends them
          const initialScores = {}
          Object.values(map).flat().forEach(item => { initialScores[item.id] = 0 })
          setScores(initialScores)
        }
      } catch {} finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [open, roundId])

  function handleScore(itemId, value) {
    setScores(prev => ({ ...prev, [itemId]: value }))
  }

  function handleComment(itemId, value) {
    setComments(prev => ({ ...prev, [itemId]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const allItems = Object.values(criteriaMap).flat()
    const missing = allItems.filter(item => scores[item.id] === undefined || scores[item.id] === '' || scores[item.id] === null)
    if (missing.length > 0) {
      toast.error(`Please enter scores for all criteria: ${missing.map(i => i.name || i.criteriaName).join(', ')}`)
      return
    }

    const payload = {
      scores: allItems.map(item => ({
        criteriaItemId: item.id,
        score: Number(scores[item.id]),
        comment: comments[item.id] || '',
      })),
    }

    setSubmitting(true)
    try {
      if (mode === 'regrade' && scoreId) {
        await regradeJudgeSubmission(scoreId, payload)
        toast.success('Grades updated successfully!')
      } else {
        await gradeJudgeSubmission(submissionId, payload)
        toast.success('Graded successfully!')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit grades.'
      if (msg.toLowerCase().includes('end submission') || msg.toLowerCase().includes('cannot grade before')) {
        toast.error('The submission period has not ended yet. Cannot grade before EndSubmission.')
      } else if (msg.toLowerCase().includes('event has ended')) {
        toast.error('The event has ended. Cannot grade.')
      } else if (msg.toLowerCase().includes('missing criteria')) {
        toast.error('Please fill in scores for all criteria items.')
      } else if (msg.toLowerCase().includes('no active criteria template')) {
        toast.error('No active criteria template found for this round.')
      } else {
        toast.error(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const allItems = Object.values(criteriaMap).flat()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-[92%] sm:max-w-[680px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Star className="h-5 w-5 text-[#e65100]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">{mode === 'regrade' ? 'Regrade Submission' : 'Grade Submission'}</h3>
              <p className="text-[12px] text-gray-400">Score each criteria below.</p>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <FileText className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-[14px] text-gray-400">No active criteria templates for this round.</p>
            </div>
          ) : (
            <form id="grade-form" onSubmit={handleSubmit}>
              {templates.map((tpl) => {
                const items = criteriaMap[tpl.id] || []
                return (
                  <div key={tpl.id} className="mb-5 last:mb-0">
                    <h4 className="mb-3 text-[14px] font-bold text-[#064f5d]">{tpl.title || tpl.name}</h4>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-[#e8ecf0] bg-white p-5 shadow-sm">
                          {/* Header: name + max score */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-[15px] font-bold text-[#1f2f3a]">{item.name || item.criteriaName || '—'}</span>
                            <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[12px] font-semibold text-gray-500">Max: {item.score ?? '—'}</span>
                          </div>

                          {/* Score slider */}
                          <div className="mb-4">
                            <label className="mb-1.5 block text-[12px] font-semibold text-gray-500">Score</label>
                            <ScoreSlider
                              value={scores[item.id] ?? 0}
                              max={item.score ?? 100}
                              onChange={(v) => handleScore(item.id, v)}
                            />
                          </div>

                          {/* Description — RichTextEditor */}
                          <div>
                            <label className="mb-1.5 block text-[12px] font-semibold text-gray-500">Description</label>
                            <RichTextEditor
                              value={comments[item.id] || ''}
                              onChange={(v) => handleComment(item.id, v)}
                              placeholder="Add a comment..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#f0f0f0] px-6 py-3.5 flex items-center justify-end gap-3">
          {allItems.length > 0 && (
            <p className="mr-auto text-[12px] text-gray-400">
              <CheckCircle className="inline h-3.5 w-3.5 text-green-500 mr-1" />
              {Object.keys(scores).filter(k => scores[k] !== '' && scores[k] != null).length}/{allItems.length} scored
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#d8e0e6] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          {templates.length > 0 && (
            <button
              type="submit"
              form="grade-form"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              {submitting ? 'Submitting...' : mode === 'regrade' ? 'Update Grades' : 'Submit Grades'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
