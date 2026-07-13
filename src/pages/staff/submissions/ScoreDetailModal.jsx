import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { getScoreDetail, getScoreItems, getScoreItemDetail } from '../../../api/staff'
import { formatDateTime } from '../../../utils/format'
import Avatar from '../../../components/Avatar'
import Badge from '../../../components/Badge'
import RichTextViewer from '../../../components/RichTextViewer'

export default function ScoreDetailModal({ scoreId, onClose }) {
  const [score, setScore] = useState(null)
  const [items, setItems] = useState([])
  const [itemDetails, setItemDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!scoreId) return
    setLoading(true); setError('')
    Promise.all([
      getScoreDetail(scoreId),
      getScoreItems(scoreId, { pageIndex: 1, pageSize: 100 }),
    ])
      .then(([scoreData, itemsData]) => {
        setScore(scoreData)
        const scoreItems = itemsData.items || []
        setItems(scoreItems)
        if (scoreItems.length > 0) {
          return Promise.all(
            scoreItems.map((item) =>
              getScoreItemDetail(item.scoreItemId)
                .then((detail) => ({ [item.scoreItemId]: detail }))
                .catch(() => ({ [item.scoreItemId]: {} }))
            )
          ).then((details) => {
            setItemDetails(Object.assign({}, ...details))
          })
        }
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load score detail.'))
      .finally(() => setLoading(false))
  }, [scoreId])

  if (!scoreId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[70%] max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col">
        <div className="shrink-0 px-6 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-slate-800">Score Detail</h3>
            <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-slate-100" />
              <div className="h-32 animate-pulse rounded bg-slate-100" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
          ) : score ? (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#f4f6f8] p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Score</p>
                    <p className="mt-1 text-[24px] font-bold text-[#064f5d]">{score.totalScore ?? '—'}</p>
                  </div>
                  {score.gradedBy && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Graded By</p>
                      <div className="mt-1 flex items-center gap-3">
                        <Avatar src={score.gradedBy.avatarUrl} name={`${score.gradedBy.firstName || ''} ${score.gradedBy.lastName || ''}`} size="h-10 w-10" textSize="text-[14px]" />
                        <div>
                          <Link to={`/staff/users/${score.gradedBy.userId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
                            {score.gradedBy.firstName} {score.gradedBy.lastName}
                          </Link>
                          <p className="text-[12px] text-gray-400">{score.gradedBy.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {score.isRetake && <Badge label="Retake" className="bg-[#fce4ec] text-[#c62828]" />}
                  {score.isMock && <Badge label="Mock" className="bg-[#fff3e0] text-[#e65100]" />}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-semibold text-slate-500">Criteria Scores ({items.length})</p>
                {items.length === 0 ? (
                  <p className="text-[13px] text-gray-400 italic">No criteria scores.</p>
                ) : (
                  <div className="rounded-lg border border-[#e8ecf0] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#fafbfc]">
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500 min-w-[180px]">Criteria</th>
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500 w-24">Score</th>
                          <th className="px-5 py-2.5 text-left text-[12px] font-bold uppercase text-slate-500">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f0]">
                        {items.map((item) => {
                          const detail = itemDetails[item.scoreItemId] || {}
                          const criteriaLink = detail.roundId && detail.criteriaTemplateId
                            ? `/staff/rounds/${detail.roundId}/criteria-templates/${detail.criteriaTemplateId}`
                            : null
                          return (
                          <tr key={item.scoreItemId} className="hover:bg-[#fafbfc]">
                            <td className="px-5 py-3 text-[14px] font-semibold text-[#1f2f3a]">
                              {criteriaLink ? (
                                <Link to={criteriaLink} className="text-[#064f5d] hover:underline">{item.criteriaName || '—'}</Link>
                              ) : (
                                item.criteriaName || '—'
                              )}
                            </td>
                            <td className="px-5 py-3 text-[15px] font-bold text-[#064f5d]">
                              {detail.maxScore != null ? `${item.score ?? '—'} / ${detail.maxScore}` : (item.score ?? '—')}
                            </td>
                            <td className="px-5 py-3 min-w-[300px]">
                              {item.comment ? (
                                <div className="max-h-[120px] overflow-y-auto rounded-lg bg-[#f4f6f8] p-3">
                                  <RichTextViewer content={item.comment} />
                                </div>
                              ) : <span className="italic text-gray-400">—</span>}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-[12px] text-slate-400">
                <span>Created {formatDateTime(score.createdAt)}</span>
                <span>Updated {formatDateTime(score.updatedAt)}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 px-6 pb-6 pt-3">
          <div className="flex justify-end">
            <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
