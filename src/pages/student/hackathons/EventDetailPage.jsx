import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, Clock, Users, Flag, UserPlus, FileText,
  Layers, Award, MapPin, BarChart3, Eye, X, ListChecks, ArrowRight,
  Trophy, UsersRound, Loader2, Search,
} from 'lucide-react'
import { getStudentEventDetail, getStudentRounds, getStudentRoundDetail, getStudentRoundCriteriaTemplates, getStudentCriteriaTemplateDetail, getStudentAwards, getStudentAwardDetail, getStudentEventLeaderboard, getStudentEventAssignments, getStudentMyTeams, createStudentRegisterTeam } from '../../../api/student'
import RichTextViewer from '../../../components/RichTextViewer'
import Pagination from '../../../components/Pagination'
import Avatar from '../../../components/Avatar'
import { formatDate, formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import { toast } from '../../../utils/toast'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name) {
  if (!name) return '?'
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getRelativeStatus(startTime, endTime) {
  const now = Date.now()
  const start = startTime ? new Date(startTime).getTime() : null
  const end = endTime ? new Date(endTime).getTime() : null
  if (start && now < start) return { label: 'Upcoming', color: 'text-blue-600', dot: 'bg-blue-500' }
  if (end && now > end) return { label: 'Ended', color: 'text-slate-500', dot: 'bg-slate-400' }
  return { label: 'In Progress', color: 'text-emerald-600', dot: 'bg-emerald-500' }
}

/* ------------------------------------------------------------------ */
/*  Style maps                                                         */
/* ------------------------------------------------------------------ */

const STATUS_STYLES = {
  Draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60' },
  Published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' },
  Closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60' },
}

const TABS = [
  { key: 'description', label: 'Description', icon: FileText },
  { key: 'rounds', label: 'Rounds', icon: Layers },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'assignments', label: 'Assignments', icon: UsersRound },
  { key: 'leaderboard', label: 'Leaderboard', icon: MapPin },
]

const LEVEL_LABELS = {
  1: { label: '1st Prize', color: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300/60', icon: 'from-[#f59e0b] to-[#f97316]' },
  2: { label: '2nd Prize', color: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300/60', icon: 'from-[#94a3b8] to-[#64748b]' },
  3: { label: '3rd Prize', color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300/60', icon: 'from-[#d97706] to-[#b45309]' },
}

function getLevelLabel(level) {
  return LEVEL_LABELS[level] || { label: `${level} Prize`, color: 'bg-white text-slate-500 ring-1 ring-slate-200/60', icon: 'from-[#cbd5e1] to-[#94a3b8]' }
}

const ITEM_META = {
  startTime: { label: 'Start', icon: Calendar },
  endTime: { label: 'End', icon: Calendar },
  registerLimitTime: { label: 'Reg. Deadline', icon: Clock },
  limitTeam: { label: 'Max Teams', icon: Users },
  teamSize: { label: 'Team Size', icon: UserPlus },
  numberRound: { label: 'Rounds', icon: Layers },
}

const GROUP_INFO = [
  { key: 'timeline', items: ['startTime', 'registerLimitTime', 'endTime'] },
  { key: 'constraints', items: ['limitTeam', 'teamSize'] },
]


function getCardValue(event, key) {
  switch (key) {
    case 'startTime':
    case 'endTime':
    case 'registerLimitTime':
      return event[key] ? formatDateTime(event[key]) : '—'
    case 'limitTeam':
    case 'numberRound':
      return event[key] ?? '—'
    case 'teamSize':
      return `${event.minMember ?? '?'}–${event.maxMember ?? '?'}`
    default:
      return event[key] ?? '—'
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ScheduleRow({ icon: Icon, label, value, accent = '#8a9ba6' }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#1f2f3a]">{label}</span>
      </div>
      <span className="shrink-0 text-right text-[13px] font-semibold text-[#1f2f3a]">
        {value}
      </span>
    </div>
  )
}

function SidebarSection({ title, icon: Icon, children, className }) {
  return (
    <div className={cn('rounded-xl border border-[#d7e0e5] bg-white overflow-hidden', className)}>
      <div className="flex items-center gap-2 border-b border-[#e8ecf0] bg-[#fafbfc] px-5 py-3">
        {Icon && <Icon size={15} className="text-[#8a9ba6]" />}
        <h4 className="text-[13px] font-bold text-[#1f2f3a]">{title}</h4>
      </div>
      <div className="px-5 py-2.5">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab content components                                             */
/* ------------------------------------------------------------------ */

function TabDescription({ description }) {
  return (
    <div className="rounded-xl border border-[#d7e0e5] bg-white p-5 shadow-sm sm:p-6">
      <RichTextViewer content={description} />
    </div>
  )
}

function TabRounds({ eventId }) {
  const [rounds, setRounds] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailRoundId, setDetailRoundId] = useState(null)
  const [criteriaRoundId, setCriteriaRoundId] = useState(null)
  const pageSize = 10

  useEffect(() => {
    let cancelled = false
    async function fetchRounds() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentRounds(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) {
          setRounds(result.rounds || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message
          if (msg?.toLowerCase().includes('page index must be greater than 0')) {
            setError('Trang không hợp lệ')
          } else if (msg?.toLowerCase().includes('page size must be between')) {
            setError('Kích thước trang không hợp lệ')
          } else {
            setError(msg || 'Không thể tải danh sách vòng.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRounds()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
    )
  }

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
          <Layers size={22} />
        </div>
        <p className="text-[15px] font-medium text-[#1f2f3a]">No rounds yet</p>
        <p className="mt-1 text-[13px] text-[#7a8e99]">Rounds will appear here once created.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {rounds.map((round) => (
          <div
            key={round.id}
            className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">#{round.roundNo} {round.name}</h4>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} className="text-[#8a9ba6]" />
                  {round.startTime ? formatDate(round.startTime) : '—'} – {round.endTime ? formatDate(round.endTime) : '—'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} className="text-[#8a9ba6]" />
                  {round.limitTeam ?? '—'} teams
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setCriteriaRoundId(round.id)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#1f78d1] transition-colors hover:bg-[#f0f7ff] hover:border-[#1f78d1]/30"
              >
                <ListChecks size={15} />
                Criteria
              </button>
              <button
                type="button"
                onClick={() => setDetailRoundId(round.id)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
              >
                <Eye size={15} />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
      )}

      <RoundDetailModal
        roundId={detailRoundId}
        onClose={() => setDetailRoundId(null)}
      />

      <CriteriaModal
        roundId={criteriaRoundId}
        onClose={() => setCriteriaRoundId(null)}
      />
    </div>
  )
}

function RoundDetailModal({ roundId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentRoundDetail(roundId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy vòng')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin vòng.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [roundId])

  if (!roundId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Layers className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.name || 'Round Detail'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              {/* Info rows */}
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Calendar} label="Start Time" value={formatDateTime(detail.startTime)} accent="#3b82f6" />
                <DetailRow icon={Calendar} label="End Time" value={formatDateTime(detail.endTime)} accent="#ef4444" />
                {detail.startSubmission && (
                  <DetailRow icon={Clock} label="Submission Start" value={formatDateTime(detail.startSubmission)} accent="#10b981" />
                )}
                {detail.endSubmission && (
                  <DetailRow icon={Clock} label="Submission End" value={formatDateTime(detail.endSubmission)} accent="#f59e0b" />
                )}
                <DetailRow icon={Users} label="Max Teams" value={detail.limitTeam ?? '—'} accent="#8b5cf6" />
              </div>

              {/* Description */}
              <div>
                <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                  <RichTextViewer content={detail.description} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#1f2f3a]">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Criteria templates                                                 */
/* ------------------------------------------------------------------ */

function CriteriaModal({ roundId, onClose }) {
  const [templates, setTemplates] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!roundId) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentRoundCriteriaTemplates(roundId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) {
          setTemplates(result.templates || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy vòng')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải tiêu chí.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId, pageIndex, pageSize])

  if (!roundId) return null

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
                <ListChecks className="h-5 w-5 text-[#1f78d1]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">Criteria Templates</h3>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto px-6 py-5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[60px] animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            ) : error ? (
              <p className="text-[14px] text-[#c62828]">{error}</p>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
                  <ListChecks size={22} />
                </div>
                <p className="text-[15px] font-medium text-[#1f2f3a]">No criteria yet</p>
                <p className="mt-1 text-[13px] text-[#7a8e99]">Criteria will appear here once created.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
                    className="w-full cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d7e0e5] bg-white px-4 py-3.5 transition-colors hover:border-[#1f78d1]/30 hover:bg-[#f0f7ff]">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f7ff]">
                          <ListChecks size={16} className="text-[#1f78d1]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{template.title}</p>
                          {template.description && (
                            <p className="mt-0.5 line-clamp-1 text-[12px] text-[#7a8e99]">{template.description.replace(/<[^>]*>/g, '')}</p>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#f0f7ff] px-3 py-1.5 text-[12px] font-semibold text-[#1f78d1]">
                        View
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && templates.length > 0 && (
            <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex items-center justify-between">
              <span className="text-[12px] text-[#7a8e99]">{totalCount} template{totalCount !== 1 ? 's' : ''}</span>
              {totalPages > 1 ? (
                <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
              ) : (
                <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
              )}
            </div>
          )}
        </div>
      </div>

      <CriteriaTemplateDetailModal
        templateId={selectedTemplateId}
        onClose={() => setSelectedTemplateId(null)}
      />
    </>
  )
}

function CriteriaTemplateDetailModal({ templateId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!templateId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentCriteriaTemplateDetail(templateId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy tiêu chí')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin tiêu chí.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [templateId])

  if (!templateId) return null

  return (
    <>
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <ListChecks className="h-5 w-5 text-[#1f78d1]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.title || 'Template Detail'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              {/* Criteria items */}
              <div>
                {detail.items && detail.items.length > 0 ? (
                  <div className="space-y-2.5">
                    {detail.items.map((item, idx) => {
                      const maxScore = Math.max(...detail.items.map(i => i.score), 1)
                      const pct = (item.score / maxScore) * 100
                      return (
                        <div key={item.id} className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white">
                          <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f7ff] text-[11px] font-bold text-[#1f78d1]">
                                {idx + 1}
                              </span>
                              <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{item.name}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-lg bg-[#e3f2fd] px-2.5 py-1.5 text-[12px] font-bold text-[#1f78d1]">
                                {item.score}<span className="text-[10px] font-medium text-[#64b5f6]">pts</span>
                              </span>
                            </div>
                          </div>
                          {/* Score bar */}
                          <div className="h-1.5 w-full bg-[#f0f4f8]">
                            <div
                              className="h-full rounded-r-full bg-gradient-to-r from-[#64b5f6] to-[#1f78d1] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-[#e8ecf0] py-8">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#8a9ba6]">
                      <ListChecks size={20} />
                    </div>
                    <p className="text-[13px] text-[#7a8e99]">No criteria items defined.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </>
  )
}

function TabAwards({ eventId }) {
  const [awards, setAwards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAwardId, setSelectedAwardId] = useState(null)
  const pageSize = 10

  useEffect(() => {
    let cancelled = false
    async function fetchAwards() {
      setLoading(true)
      setError('')
      try {
        const params = { PageIndex: pageIndex, PageSize: pageSize }
        const result = await getStudentAwards(eventId, params)
        if (!cancelled) {
          setAwards(result.awards || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message
          if (msg?.toLowerCase().includes('page index must be greater than zero')) {
            setError('Trang không hợp lệ')
          } else if (msg?.toLowerCase().includes('page size must be between')) {
            setError('Kích thước trang không hợp lệ')
          } else if (err?.response?.status === 404) {
            setError('Không tìm thấy sự kiện')
          } else {
            setError(msg || 'Không thể tải danh sách giải thưởng.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAwards()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  function formatPrize(amount) {
    if (amount == null) return '—'
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[80px] animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
    )
  }

  if (awards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
          <Award size={22} />
        </div>
        <p className="text-[15px] font-medium text-[#1f2f3a]">No awards yet</p>
        <p className="mt-1 text-[13px] text-[#7a8e99]">Awards will appear here once created.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {awards.map((award) => {
          const levelStyle = getLevelLabel(award.levelAward)
          return (
            <div
              key={award.id}
              className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm', levelStyle.icon)}>
                  <Award size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{award.name}</h4>
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', levelStyle.color)}>
                      {levelStyle.label}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                    <span className="inline-flex items-center gap-1">
                      {award.numberOfAward ?? '—'} winner{award.numberOfAward > 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#f59e0b]">
                      {formatPrize(award.prize)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAwardId(award.id)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[#f59e0b] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#e69009]"
              >
                <Eye size={15} />
                View
              </button>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
      )}

      <AwardDetailModal
        awardId={selectedAwardId}
        onClose={() => setSelectedAwardId(null)}
      />
    </div>
  )
}

function AwardDetailModal({ awardId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!awardId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentAwardDetail(awardId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setError('Không tìm thấy')
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin giải thưởng.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [awardId])

  if (!awardId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff3e0]">
              <Award className="h-5 w-5 text-[#f59e0b]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">
              {loading ? 'Loading...' : detail?.name || 'Award Detail'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-white shadow-sm">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-[17px] font-bold text-[#1f2f3a]">{detail.name}</p>
                  <p className="text-[13px] text-[#f59e0b] font-semibold">
                    {detail.prize ? new Intl.NumberFormat('vi-VN').format(detail.prize) + ' ₫' : '—'}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Award} label="Level" value={getLevelLabel(detail.levelAward).label} accent="#f59e0b" />
                <DetailRow icon={Users} label="Winners" value={detail.numberOfAward ?? '—'} accent="#10b981" />
              </div>

              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end">
          <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
        </div>
      </div>
    </div>
  )
}

const LB_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-teal-600',
]

function getLbInitials(name) {
  if (!name) return '?'
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function getLbColor(id) {
  if (!id) return LB_COLORS[0]
  const idx = String(id).split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return LB_COLORS[idx % LB_COLORS.length]
}

function TabEventLeaderboard({ eventId }) {
  const [data, setData] = useState(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedTeam, setExpandedTeam] = useState(null)
  const pageSize = 10

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchLb() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentEventLeaderboard(eventId, { PageIndex: pageIndex, PageSize: pageSize })
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Không thể tải bảng xếp hạng.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchLb()
    return () => { cancelled = true }
  }, [eventId, pageIndex, pageSize])

  const items = data?.items || []
  const totalPages = data ? Math.ceil((data.totalCount || 0) / pageSize) : 0

  if (loading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
          <MapPin size={22} />
        </div>
        <p className="text-[15px] font-medium text-[#1f2f3a]">No leaderboard data</p>
        <p className="mt-1 text-[13px] text-[#7a8e99]">Leaderboard will appear once scores are published.</p>
      </div>
    )
  }

  function RankIcon({ rank }) {
    if (rank === 1) return <Trophy size={20} className="text-[#d97706]" fill="#d97706" />
    if (rank === 2) return <Trophy size={20} className="text-[#64748b]" fill="#64748b" />
    if (rank === 3) return <Award size={20} className="text-[#ea580c]" />
    return <span className="text-[14px] font-bold text-[#5a6a73] w-5 text-center">#{rank}</span>
  }

  return (
    <div>
      <div className="space-y-2.5">
        {items.map((team) => {
          const isExpanded = expandedTeam === team.registerTeamId
          return (
            <div key={team.registerTeamId} className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white transition-all">
              <button
                type="button"
                onClick={() => setExpandedTeam(isExpanded ? null : team.registerTeamId)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#fafbfc]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f6f8]">
                  <RankIcon rank={team.rank} />
                </div>
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-[13px] font-bold', getLbColor(team.teamId))}>
                  {getLbInitials(team.teamName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{team.teamName}</p>
                  {team.trackTitle && <p className="truncate text-[11px] text-[#8a9ba6]">{team.trackTitle}{team.topicTitle ? ` · ${team.topicTitle}` : ''}</p>}
                </div>
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className={cn('text-[20px] font-bold leading-none', team.rank === 1 ? 'text-[#b45309]' : team.rank === 2 ? 'text-[#475569]' : team.rank === 3 ? 'text-[#c2410c]' : 'text-[#064f5d]')}>
                    {team.eventScore?.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-0.5">PTS</span>
                </div>
              </button>
              {isExpanded && team.roundScores && team.roundScores.length > 0 && (
                <div className="border-t border-[#f0f4f8] bg-[#fafbfc] px-4 py-3">
                  <div className="space-y-1.5">
                    {team.roundScores.map((rs) => (
                      <div key={rs.roundNo} className="flex items-center justify-between px-2 py-1">
                        <span className="text-[12px] text-[#5a6a73]">Round {rs.roundNo}: {rs.roundName}</span>
                        <span className="text-[13px] font-semibold text-[#1f2f3a]">{rs.scopeScore?.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-5">
          <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Assignments                                                        */
/* ------------------------------------------------------------------ */

function TabAssignments({ eventId }) {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId) return
    let cancelled = false
    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        // Fetch judges and mentors in parallel
        const [judges, mentors] = await Promise.all([
          getStudentEventAssignments(eventId, { EventRole: 'Judge', PageSize: 100 }),
          getStudentEventAssignments(eventId, { EventRole: 'Mentor', PageSize: 100 }),
        ])
        if (!cancelled) {
          const combined = [
            ...(judges.items || []).map(i => ({ ...i, _group: 'Judge' })),
            ...(mentors.items || []).map(i => ({ ...i, _group: 'Mentor' })),
          ]
          setAllItems(combined)
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Không thể tải danh sách phân công.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [eventId])

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((g) => (
          <div key={g}>
            <div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {[1, 2].map((i) => <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
    )
  }

  const judges = allItems.filter(i => i._group === 'Judge')
  const mentors = allItems.filter(i => i._group === 'Mentor')

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
          <UsersRound size={22} />
        </div>
        <p className="text-[15px] font-medium text-[#1f2f3a]">No assignments</p>
        <p className="mt-1 text-[13px] text-[#7a8e99]">Judges and mentors will appear here once assigned.</p>
      </div>
    )
  }

  function PersonCard({ person }) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
        <Avatar src={person.avatarUrl} name={`${person.firstName} ${person.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{person.firstName} {person.lastName}</p>
          <p className="truncate text-[12px] text-[#8a9ba6]">{person.email}</p>
          {person.assignTracks && person.assignTracks.length > 0 && (
            <p className="mt-0.5 truncate text-[11px] text-[#1565c0]">
              {person.assignTracks.filter(t => !t.isDisable).map(t => t.title).join(', ')}
            </p>
          )}
        </div>
      </div>
    )
  }

  function RoleGroup({ title, items }) {
    if (items.length === 0) return null
    return (
      <div className="mb-6 last:mb-0">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#1f2f3a]">{title}</h3>
          <span className="rounded-md bg-[#f0f0f0] px-2 py-0.5 text-[12px] font-semibold text-[#5a6a73]">{items.length} person{items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {items.map((person) => (
            <PersonCard key={person.assignEventId} person={person} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RoleGroup title="Judge" items={judges} />
      <RoleGroup title="Mentor" items={mentors} />
    </div>
  )
}

function TabPlaceholder({ label, icon: Icon = FileText, accent = '#1565c0' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-20">
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: `${accent}12` }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <p className="text-[15px] font-medium text-[#1f2f3a]">{label}</p>
      <p className="mt-1 text-[13px] text-[#7a8e99]">Coming soon</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Register Event Modal                                               */
/* ------------------------------------------------------------------ */

function RegisterEventModal({ eventId, open, onClose, onSuccess }) {
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [teamPageIndex, setTeamPageIndex] = useState(1)
  const TEAM_PAGE_SIZE = 5

  /* ---- fetch teams from API on mount / search / page change ---- */
  useEffect(() => {
    if (!open) return
    setLoadingTeams(true)
    let cancelled = false
    async function fetchTeams() {
      try {
        const result = await getStudentMyTeams({
          Keyword: searchKeyword || undefined,
          PageIndex: teamPageIndex,
          PageSize: TEAM_PAGE_SIZE,
        })
        if (!cancelled) {
          setTeams(result.teams || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch {
        if (!cancelled) toast.error('Failed to load your teams.')
      } finally {
        if (!cancelled) setLoadingTeams(false)
      }
    }
    fetchTeams()
    return () => { cancelled = true }
  }, [open, searchKeyword, teamPageIndex])

  /* ---- reset to page 1 when search changes ---- */
  useEffect(() => {
    if (!open) return
    setTeamPageIndex(1)
  }, [searchKeyword, open])

  /* ---- reset state when modal opens ---- */
  useEffect(() => {
    if (!open) return
    setSelectedTeamId('')
    setDescription('')
  }, [open])

  const totalTeamPages = Math.ceil(totalCount / TEAM_PAGE_SIZE)

  async function handleRegister() {
    if (!selectedTeamId) {
      toast.error('Please select a team.')
      return
    }
    setSubmitting(true)
    try {
      await createStudentRegisterTeam({
        teamId: selectedTeamId,
        eventId,
        description: description || undefined,
      })
      toast.success('Registered successfully! Pending approval.')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to register.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <UserPlus className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">Register Event</h3>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="space-y-5">
            {/* Team select */}
            <div className="space-y-3">
              <label className="block text-[13px] font-semibold text-[#1f2f3a]">Select Team *</label>

              {/* Search input — always visible */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6] pointer-events-none"
                />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search teams..."
                  className="w-full rounded-xl border border-[#d8e0e6] bg-white pl-9 pr-4 py-2.5 text-[13px] outline-none transition-all focus:border-[#064f5d] focus:ring-1 focus:ring-[#064f5d]/20"
                />
              </div>

              {/* Result area — loading skeleton or content */}
              {loadingTeams ? (
                <div className="space-y-2">
                  <div className="h-[52px] animate-pulse rounded-xl bg-gray-100" />
                  <div className="h-[52px] animate-pulse rounded-xl bg-gray-100" />
                </div>
              ) : teams.length === 0 ? (
                <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4 text-center">
                  <p className="text-[13px] text-[#7a8e99]">
                    {searchKeyword
                      ? "No teams match your search."
                      : "You don't have any team yet. "}
                    {!searchKeyword && (
                      <Link to="/teams/create" className="text-[#1565c0] hover:underline font-medium">Create one</Link>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <label
                      key={team.teamId}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                        selectedTeamId === team.teamId
                          ? 'border-[#1565c0] bg-[#f0f7ff]'
                          : 'border-[#e8ecf0] bg-white hover:bg-[#fafbfc]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="teamSelect"
                        value={team.teamId}
                        checked={selectedTeamId === team.teamId}
                        onChange={() => setSelectedTeamId(team.teamId)}
                        className="h-4 w-4 accent-[#1565c0]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-[#1f2f3a]">{team.name}</p>
                        {team.description && (
                          <p className="truncate text-[12px] text-[#7a8e99]">{team.description}</p>
                        )}
                      </div>
                    </label>
                  ))}

                  {/* Pagination */}
                  {totalTeamPages > 1 && (
                    <Pagination
                      currentPage={teamPageIndex}
                      totalPages={totalTeamPages}
                      onPageChange={setTeamPageIndex}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes about your team's registration..."
                rows={3}
                className="w-full rounded-xl border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#064f5d] focus:ring-1 focus:ring-[#064f5d]/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#d8e0e6] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={submitting || !selectedTeamId || teams.length === 0}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Main page                                                          */
/* ================================================================== */

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isForbidden, setIsForbidden] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [registerEventModalOpen, setRegisterEventModalOpen] = useState(false)

  /* ---- data fetching ---- */

  useEffect(() => {
    let cancelled = false

    async function fetchEvent() {
      setLoading(true)
      setError('')
      setIsForbidden(false)
      try {
        const data = await getStudentEventDetail(id)
        if (!cancelled) setEvent(data)
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status
          if (status === 403) {
            setIsForbidden(true)
          } else if (status === 404) {
            setError('Không tìm thấy sự kiện')
          } else if (status === 401) {
            // api.js interceptor handles redirect
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin sự kiện.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvent()
    return () => { cancelled = true }
  }, [id])

  /* ---- early returns ---- */

  if (isForbidden) return null

  /* ---- loading skeleton ---- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mb-8 overflow-hidden rounded-xl border border-[#d7e0e5] bg-white">
            <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:gap-7 sm:px-8 sm:py-7">
              <div className="mx-auto h-[68px] w-[68px] shrink-0 animate-pulse rounded-2xl bg-gray-200 sm:mx-0 sm:h-[76px] sm:w-[76px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div className="space-y-3">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-5">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-24 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
              <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
            </div>
            <div className="space-y-5">
              <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---- error state ---- */

  if (!loading && error) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/hackathons"
            className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]"
          >
            <ArrowLeft size={16} />
            Back to hackathons
          </Link>

          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
              <FileText size={28} />
            </div>
            <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
            <Link
              to="/hackathons"
              className="mt-2 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1] hover:underline"
            >
              &larr; Back to hackathons
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ---- main content ---- */

  if (!loading && !error && event) {
    const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.Draft
    const initials = getInitials(event.name)
    const relative = getRelativeStatus(event.startTime, event.endTime)

    return (<>
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          {/* ---------- Back link ---------- */}
          <Link
            to="/hackathons"
            className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]"
          >
            <ArrowLeft size={16} />
            Back to hackathons
          </Link>

          {/* ========== Info card ========== */}
          <div className="mb-8 overflow-hidden rounded-xl border border-[#d7e0e5] bg-gradient-to-r from-[#064f5d] via-[#0a6e7d] to-[#0d8a9a] shadow-[0_4px_16px_rgba(6,79,93,0.12)]">
            <div className="relative px-6 py-6 sm:px-8 sm:py-7">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.03]" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
                {/* Avatar */}
                <div className="relative shrink-0 self-center sm:self-start">
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-white/20 text-[22px] font-bold leading-none tracking-wide text-white shadow-md backdrop-blur sm:h-[76px] sm:w-[76px] sm:text-[26px] sm:rounded-[18px]">
                    {initials}
                  </div>
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-white',
                      relative.dot,
                    )}
                  />
                </div>

                {/* Right content */}
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  {/* Title section */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-[24px] font-bold leading-tight text-white sm:text-[28px]">
                        {event.name}
                      </h1>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          statusStyle.cls,
                        )}
                      >
                        {statusStyle.label}
                      </span>
                      {event.isDisable && (
                        <span className="inline-flex items-center rounded-full bg-[#fce4ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#c62828] ring-1 ring-[#ef9a9a]">
                          Deleted
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#80deea]">
                      {event.season && (
                        <span className="inline-flex items-center gap-1.5">
                          <Flag size={14} className="text-[#ffca28]" />
                          {event.season}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-[#80deea]" />
                        {event.numberRound ?? 0} {event.numberRound === 1 ? 'Round' : 'Rounds'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 rounded-full', relative.dot)} />
                        <span className={cn('font-medium', relative.color === 'text-blue-600' ? 'text-blue-200' : relative.color === 'text-emerald-600' ? 'text-emerald-200' : 'text-slate-300')}>{relative.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Info rows: Timeline + Constraints */}
                  <div className="space-y-2">
                    {GROUP_INFO.map((group) => (
                      <div key={group.key} className="flex flex-wrap gap-x-5 gap-y-1">
                        {group.items.map((key) => {
                          const meta = ITEM_META[key]
                          const Icon = meta.icon
                          return (
                            <span key={key} className="inline-flex items-center gap-1.5">
                              <Icon size={12} className="shrink-0 text-[#80deea]" />
                              <span className="text-[12px] text-[#b2ebf2]">{meta.label}:</span>
                              <span className="text-[13px] font-semibold text-white">{getCardValue(event, key)}</span>
                            </span>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Register Event button — inside the card */}
                  {event.status === 'Published' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setRegisterEventModalOpen(true)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/30 active:scale-[0.98]"
                      >
                        <UserPlus className="h-4 w-4" />
                        Register Event
                      </button>
                    </div>
                  )}

              </div>
            </div>
          </div>

          {/* ========== Tabs + sidebar layout ========== */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ---- Left: tabs ---- */}
            <div className="lg:col-span-2">
              {/* Tab nav */}
              <div className="flex border-b border-[#d7e0e5]">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'relative flex cursor-pointer items-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors sm:px-5',
                        activeTab === tab.key
                          ? 'text-[#1565c0]'
                          : 'text-[#7a8e99] hover:text-[#1f2f3a]',
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                      {activeTab === tab.key && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Tab content */}
              <div className="mt-5">
                {activeTab === 'description' && (
                  <TabDescription description={event.description} />
                )}
                {activeTab === 'rounds' && (
                  <TabRounds eventId={event.id} />
                )}
                {activeTab === 'awards' && (
                  <TabAwards eventId={event.id} />
                )}
                {activeTab === 'assignments' && (
                  <TabAssignments eventId={event.id} />
                )}
                {activeTab === 'leaderboard' && (
                  <TabEventLeaderboard eventId={event.id} />
                )}
              </div>
            </div>

            {/* ---- Right: sidebar ---- */}
            <div className="space-y-5 self-start lg:sticky lg:top-8">
              {/* Schedule */}
              <SidebarSection title="Schedule" icon={Calendar}>
                <div className="divide-y divide-[#f0f4f8]">
                  <ScheduleRow
                    icon={Calendar}
                    label="Start Date"
                    value={event.startTime ? formatDate(event.startTime) : '—'}
                    accent="#3b82f6"
                  />
                  <ScheduleRow
                    icon={Calendar}
                    label="End Date"
                    value={event.endTime ? formatDate(event.endTime) : '—'}
                    accent="#ef4444"
                  />
                  <ScheduleRow
                    icon={Clock}
                    label="Reg. Deadline"
                    value={event.registerLimitTime ? formatDate(event.registerLimitTime) : '—'}
                    accent="#f59e0b"
                  />
                </div>
              </SidebarSection>

              {/* Team Rules */}
              <SidebarSection title="Team Rules" icon={UserPlus}>
                <div className="divide-y divide-[#f0f4f8]">
                  <ScheduleRow icon={Users} label="Max Teams" value={event.limitTeam ?? '—'} accent="#10b981" />
                  <ScheduleRow icon={UserPlus} label="Members / Team" value={`${event.minMember ?? '—'} – ${event.maxMember ?? '—'}`} accent="#8b5cf6" />
                </div>
              </SidebarSection>

            </div>
          </div>
        </div>
      </div>

      <RegisterEventModal
        eventId={event.id}
        open={registerEventModalOpen}
        onClose={() => setRegisterEventModalOpen(false)}
        onSuccess={() => {
          // Refresh event data to reflect new registration status
          getStudentEventDetail(id).then(setEvent).catch(() => {})
        }}
      />
    </>
    )
  }
}
