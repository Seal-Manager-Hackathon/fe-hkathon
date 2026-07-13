import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, FileText, Eye, Info, Calendar, Clock, User, FolderKanban, CircleCheck, ExternalLink } from 'lucide-react'
import { getCriteriaTemplates, getCriteriaItems } from '../../../api/admin'
import { formatDateTime } from '../../../utils/format'
import Badge from '../../../components/Badge'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import InfoRow from '../../../components/InfoRow'
import BaseTable from '../../../components/BaseTable'
import TabBtn from './TabBtn'
import ScoreDetailModal from './ScoreDetailModal'

const GRADER_PAGE_SIZE = 5

const statusBadge = {
  Submitted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Graded: 'bg-blue-50 text-blue-700 border border-blue-200',
  Failed: 'bg-rose-50 text-rose-700 border border-rose-200',
}

export default function SubmissionTabs({ data, graderScores, graderTotal, graderPage, graderLoading, onGraderPageChange, eventId }) {
  const [tab, setTab] = useState('content')
  const [selectedScoreId, setSelectedScoreId] = useState(null)
  const [criteriaTemplates, setCriteriaTemplates] = useState([])
  const [criteriaTemplateItems, setCriteriaTemplateItems] = useState({})
  const [criteriaLoading, setCriteriaLoading] = useState(false)

  useEffect(() => {
    if (tab !== 'criteria' || !data?.roundId) return
    let cancelled = false
    async function fetch() {
      setCriteriaLoading(true)
      try {
        const result = await getCriteriaTemplates(data.roundId, { PageSize: 100 })
        const templates = result.templates || []
        if (cancelled) return
        setCriteriaTemplates(templates)
        // Fetch items for each template
        const itemsMap = {}
        await Promise.all(templates.map(async (tpl) => {
          try {
            const itemsResult = await getCriteriaItems(tpl.id, { PageSize: 100 })
            itemsMap[tpl.id] = itemsResult.items || []
          } catch {}
        }))
        if (!cancelled) setCriteriaTemplateItems(itemsMap)
      } catch {} finally {
        if (!cancelled) setCriteriaLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [tab, data?.roundId])

  const graderColumns = [
    { key: 'grader', header: 'Grader', headerIcon: User,
      render: (row) => {
        const gb = row.gradedBy
        if (gb) {
          const name = ((gb.firstName || '') + ' ' + (gb.lastName || '')).trim()
          return (
            <Link to={`/admin/users/${gb.userId}`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-1 py-0.5 transition-colors hover:bg-[#e3f2fd]/60">
              <Avatar src={gb.avatarUrl} name={name} size="h-7 w-7" textSize="text-[10px]" />
              <span className="text-[14px] font-semibold text-[#064f5d] hover:underline">{name}</span>
            </Link>
          )
        }
        if (row.graderName) return (
          <div className="inline-flex items-center gap-2 rounded-lg px-1 py-0.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eceff1]">
              <User className="h-3.5 w-3.5 text-[#78909c]" />
            </div>
            <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.graderName}</span>
          </div>
        )
        return <span className="text-[14px] text-gray-400">—</span>
      },
    },
    { key: 'trackTitle', header: 'Track', headerIcon: FolderKanban,
      render: (row) => row.assignTrackId && eventId ? (
        <Link to={`/admin/tracks/${row.assignTrackId}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.trackTitle || '—'}
        </Link>
      ) : <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.trackTitle || '—'}</span>
    },
    { key: 'totalScore', header: 'Score', headerIcon: Star, render: (row) => <span className="text-[15px] font-bold text-[#064f5d]">{row.totalScore}</span> },
    { key: 'flags', header: '', render: (row) => <div className="flex items-center gap-1.5">{row.isRetake && <Badge label="Retake" className="bg-[#fce4ec] text-[#c62828]" />}{row.isMock && <Badge label="Mock" className="bg-[#fff3e0] text-[#e65100]" />}</div> },
    { key: 'createdAt', header: 'Graded At', headerIcon: Calendar, render: (row) => <span className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</span> },
    { key: 'actions', header: 'Action', headerClassName: 'text-right', className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setSelectedScoreId(row.scoreId)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]"
          >
            <Eye className="h-3.5 w-3.5" />View
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      {selectedScoreId && <ScoreDetailModal scoreId={selectedScoreId} onClose={() => setSelectedScoreId(null)} />}
      <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
      <div className="flex bg-gradient-to-r from-slate-50 to-white">
        <TabBtn active={tab === 'content'} icon={Eye} label="Content" color="blue" onClick={() => setTab('content')} />
        <TabBtn active={tab === 'info'} icon={Info} label="Information" color="amber" onClick={() => setTab('info')} />
        <TabBtn active={tab === 'score'} icon={Star} label="Judge Scores" color="green" onClick={() => setTab('score')} />
        <TabBtn active={tab === 'criteria'} icon={FileText} label="Criteria Template" color="purple" onClick={() => setTab('criteria')} />
      </div>

      {tab === 'content' && (
        <div className="divide-y divide-[#f5f5f5]">
          <div className="px-5 py-4">
            <span className="text-[13px] font-semibold text-gray-400">URL</span>
            <div className="mt-1">
              {data.url ? (
                <a href={data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> Open Submission
                </a>
              ) : <span className="text-[14px] text-gray-400">—</span>}
            </div>
          </div>
          <div className="px-5 py-4">
            <span className="text-[13px] font-semibold text-gray-400">Description</span>
            <div className="mt-2"><RichTextViewer content={data.description} /></div>
          </div>
        </div>
      )}

      {tab === 'info' && (
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Status" icon={CircleCheck}>
            <Badge label={data.status} className={statusBadge[data.status] || 'bg-gray-50 text-gray-600'} />
          </InfoRow>
          {data.isRegrade && (
            <InfoRow label="Regrade" icon={Star}><Badge label="Yes" className="bg-[#fff3e0] text-[#e65100]" /></InfoRow>
          )}
          {data.totalScore != null && (
            <InfoRow label="Total Score" icon={Star}><span className="text-[16px] font-bold text-[#064f5d]">{data.totalScore}</span></InfoRow>
          )}
          <InfoRow label="Submitted At" icon={Calendar}>
            <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.submittedAt || data.createdAt)}</span>
          </InfoRow>
          <InfoRow label="Last Updated" icon={Clock}>
            <span className="text-[14px] text-[#1f2f3a]">{formatDateTime(data.updatedAt)}</span>
          </InfoRow>
        </div>
      )}

      {tab === 'score' && (
        graderTotal === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Star className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-[14px] text-gray-400">No judge scores yet.</p>
          </div>
        ) : (
          <BaseTable borderless columns={graderColumns} data={graderScores} page={graderPage} pageSize={GRADER_PAGE_SIZE}
            total={graderTotal} onPageChange={onGraderPageChange} loading={graderLoading}
            serverSide emptyText="No scores." keyExtractor={(row) => row.scoreId} minWidth="600px" />
        )
      )}

      {tab === 'criteria' && (
        criteriaLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-3 w-full max-w-md px-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
              <div className="h-16 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ) : !data?.roundId ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-[14px] text-gray-400">No round associated with this submission.</p>
          </div>
        ) : criteriaTemplates.filter(tpl => tpl.isActive).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-[14px] text-gray-400">No active criteria templates for this round.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f0f0]">
            {criteriaTemplates.filter(tpl => tpl.isActive).map((tpl) => {
              const items = (criteriaTemplateItems[tpl.id] || []).filter(item => !item.isDisable)
              return (
                <div key={tpl.id} className="px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <Link
                      to={`/admin/rounds/${data.roundId}/criteria-templates/${tpl.id}`}
                      className="text-[15px] font-bold text-[#064f5d] hover:underline"
                    >
                      {tpl.title || tpl.name}
                    </Link>
                    <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />
                  </div>
                  {items.length > 0 ? (
                    <div className="rounded-lg border border-[#e8ecf0] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#fafbfc]">
                            <th className="px-4 py-2 text-left text-[12px] font-bold uppercase text-slate-500">Criteria</th>
                            <th className="px-4 py-2 text-left text-[12px] font-bold uppercase text-slate-500 w-32">Max Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0f0f0]">
                          {items.map((item) => (
                            <tr key={item.id} className="hover:bg-[#fafbfc]">
                              <td className="px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a]">{item.name || item.criteriaName || '—'}</td>
                              <td className="px-4 py-2.5 text-[14px] font-bold text-[#064f5d]">{item.score != null ? item.score : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[13px] text-gray-400 italic">No criteria items.</p>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
    </>
  )
}
