import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, Clock, Users, Flag, UserPlus, FileText,
  Layers, Award, MapPin, BarChart3, Eye, X, ListChecks,
} from 'lucide-react'
import { getStudentEventDetail, getStudentRounds, getStudentRoundDetail, getStudentRoundCriteriaTemplates, getStudentCriteriaTemplateDetail } from '../../../api/student'
import RichTextViewer from '../../../components/RichTextViewer'
import Pagination from '../../../components/Pagination'
import { formatDate, formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'

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
  { key: 'description', label: 'Description' },
  { key: 'rounds', label: 'Rounds' },
  { key: 'criteria', label: 'Criteria' },
  { key: 'awards', label: 'Awards' },
  { key: 'leaderboard', label: 'Leaderboard' },
]

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
                <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{round.name}</h4>
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
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#8b5cf6] transition-colors hover:bg-[#f5f3ff] hover:border-[#8b5cf6]/30"
              >
                <ListChecks size={15} />
                Criteria
              </button>
              <button
                type="button"
                onClick={() => setDetailRoundId(round.id)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[13px] font-semibold text-[#1565c0] transition-colors hover:bg-[#f0f7ff] hover:border-[#1565c0]/30"
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e5f5]">
                <ListChecks className="h-5 w-5 text-[#8b5cf6]" />
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
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#d7e0e5] bg-white px-4 py-3.5 transition-colors hover:border-[#8b5cf6]/30 hover:bg-[#f5f3ff]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{template.title}</p>
                        {template.description && (
                          <p className="mt-0.5 line-clamp-1 text-[12px] text-[#5a6a73]">{template.description.replace(/<[^>]*>/g, '')}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-[12px] font-medium text-[#8b5cf6]">View &rarr;</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {totalPages > 1 && (
            <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5">
              <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
            </div>
          )}
          {totalPages <= 1 && !loading && !error && templates.length > 0 && (
            <div className="shrink-0 border-t border-[#e8ecf0] px-6 py-3.5 flex justify-end">
              <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3e5f5]">
              <ListChecks className="h-5 w-5 text-[#8b5cf6]" />
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
              {/* Description */}
              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}

              {/* Criteria items */}
              <div>
                <p className="mb-3 text-[13px] font-bold text-[#1f2f3a]">{detail.items?.length || 0} Criteria</p>
                {detail.items && detail.items.length > 0 ? (
                  <div className="space-y-2">
                    {detail.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-white px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-[#1f2f3a]">{item.name}</p>
                          {item.description && (
                            <p className="mt-0.5 text-[12px] text-[#5a6a73]">{item.description}</p>
                          )}
                        </div>
                        <span className="ml-3 shrink-0 inline-flex items-center rounded-lg bg-[#f3e5f5] px-2.5 py-1 text-[13px] font-bold text-[#8b5cf6]">
                          {item.score} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#7a8e99]">No criteria items defined.</p>
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

    return (
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
          <div className="mb-8 overflow-hidden rounded-xl border border-[#d7e0e5] bg-white shadow-[0_1px_4px_rgba(31,47,58,0.04)]">
            <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-start sm:gap-7 sm:px-8 sm:py-7">
              {/* Avatar */}
              <div className="relative shrink-0 self-center sm:self-start">
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#1565c0] via-[#1976d2] to-[#42a5f5] text-[22px] font-bold leading-none tracking-wide text-white shadow-md sm:h-[76px] sm:w-[76px] sm:text-[26px] sm:rounded-[18px]">
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
                    <h1 className="text-[24px] font-bold leading-tight text-[#1f2f3a] sm:text-[28px]">
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

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#5a6a73]">
                    {event.season && (
                      <span className="inline-flex items-center gap-1.5">
                        <Flag size={14} className="text-[#f59e0b]" />
                        {event.season}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-[#06b6d4]" />
                      {event.numberRound ?? 0} {event.numberRound === 1 ? 'Round' : 'Rounds'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className={cn('h-1.5 w-1.5 rounded-full', relative.dot)} />
                      <span className={cn('font-medium', relative.color)}>{relative.label}</span>
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
                            <Icon size={12} className="shrink-0 text-[#8a9ba6]" />
                            <span className="text-[12px] text-[#5a6a73]">{meta.label}:</span>
                            <span className="text-[13px] font-semibold text-[#1f2f3a]">{getCardValue(event, key)}</span>
                          </span>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========== Tabs + sidebar layout ========== */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ---- Left: tabs ---- */}
            <div className="lg:col-span-2">
              {/* Tab nav */}
              <div className="flex border-b border-[#d7e0e5]">
                {TABS.map((tab) => (
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
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-5">
                {activeTab === 'description' && (
                  <TabDescription description={event.description} />
                )}
                {activeTab === 'rounds' && (
                  <TabRounds eventId={event.id} />
                )}
                {activeTab === 'criteria' && (
                  <TabPlaceholder label="Criteria" icon={BarChart3} accent="#8b5cf6" />
                )}
                {activeTab === 'awards' && (
                  <TabPlaceholder label="Awards" icon={Award} accent="#f59e0b" />
                )}
                {activeTab === 'leaderboard' && (
                  <TabPlaceholder label="Leaderboard" icon={MapPin} accent="#10b981" />
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
    )
  }
}
