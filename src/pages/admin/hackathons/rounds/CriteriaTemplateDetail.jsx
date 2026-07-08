import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, FileText, Calendar, Clock, Tag, Hash,
  CircleCheck, Edit, Target, AlertCircle,
} from 'lucide-react'
import { getCriteriaTemplateDetail, getRoundDetail } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import RichTextViewer from '../../../../components/RichTextViewer'
import { formatDateTime, formatDate } from '../../../../utils/format'

import { cn } from '../../../../utils/cn'

export default function CriteriaTemplateDetail() {
  const { roundId, templateId } = useParams()
  const [template, setTemplate] = useState(null)
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')

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

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-1 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
          ))}
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
        <h2 className="text-[20px] font-bold text-slate-700">
          {isNotFound ? 'Template Not Found' : 'Something went wrong'}
        </h2>
        <p className="mt-2 max-w-md text-[14px] text-slate-500">
          {isNotFound ? 'The criteria template you are looking for does not exist.' : error}
        </p>
        <Link to={`/admin/rounds/${roundId}/criteria-templates`}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#05404a] active:scale-[0.97]">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>
      </div>
    )
  }

  const items = template.items || []
  const totalScore = items.reduce((sum, i) => sum + (Number(i.score) || 0), 0)
  const isDeleted = template.isDisable

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <Link
          to={`/admin/rounds/${roundId}/criteria-templates`}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Criteria Templates
        </Link>
      </nav>

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#064f5d]/15 bg-gradient-to-br from-[#064f5d] via-[#0a6e7d] to-[#0d8a96] p-6 text-white shadow-lg shadow-[#064f5d]/10 sm:p-7">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-white/5" />
        <div className="absolute bottom-0 right-16 h-24 w-24 rounded-tl-full bg-white/5" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                label={isDeleted ? 'Deleted' : 'Active'}
                className={isDeleted
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'}
              />
              {round && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
                  <Target className="h-3 w-3" />
                  {round.name}
                </span>
              )}
            </div>
            <h1 className="text-[24px] font-bold leading-tight break-words text-white sm:text-[30px]">
              {template.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Created {formatDate(template.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Updated {formatDate(template.updatedAt)}
              </span>
            </div>
          </div>
          {!isDeleted && (
            <Link
              to={`/admin/rounds/${roundId}/criteria-templates/${templateId}/edit`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-[0.97] shrink-0 self-start border border-white/20"
            >
              <Edit className="h-4 w-4" />
              Edit Template
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

      {/* ── Tab Section: Description / Criteria Items ── */}
      <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
        {/* Tab bar */}
        <div className="flex bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <TabBtn
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
            icon={FileText}
            label="Template Description"
          />
          <TabBtn
            active={activeTab === 'items'}
            onClick={() => setActiveTab('items')}
            icon={Tag}
            label={`Criteria Items (${items.length})`}
          />
        </div>

        {/* Description panel */}
        {activeTab === 'description' && (
          <div className="px-6 py-5">
            {template.description ? (
              <RichTextViewer content={template.description} />
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="h-7 w-7 text-slate-300" />
                </div>
                <p className="text-[14px] font-medium text-slate-400">No description provided</p>
                <p className="mt-1 text-[12px] text-slate-300">This template does not have a description.</p>
              </div>
            )}
          </div>
        )}

        {/* Items panel */}
        {activeTab === 'items' && (
          <div className="px-5 py-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Tag className="h-7 w-7 text-slate-300" />
                </div>
                <p className="text-[14px] font-medium text-slate-400">No criteria items</p>
                <p className="mt-1 text-[12px] text-slate-300">This template does not have any criteria items yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <CriteriaItemCard key={item.id} index={idx + 1} item={item} maxScore={100} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex-1 cursor-pointer px-5 py-3.5 text-[13px] font-semibold transition-all duration-200',
        active ? 'bg-white text-[#064f5d]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50',
      )}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className={cn('h-4 w-4 transition-colors duration-200', active ? 'text-[#064f5d]' : 'text-slate-400')} />
        {label}
      </span>
      {active && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#064f5d]" />
      )}
    </button>
  )
}

function StatCard({ icon, label, value, color, bg, border, mono = false }) {
  return (
    <div className={`rounded-2xl border ${border} ${bg} p-4 sm:p-5 flex flex-col gap-1.5 transition-shadow hover:shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <p className={`font-bold text-slate-800 ${mono ? 'text-[12px] sm:text-[13px]' : 'text-[18px] sm:text-[22px]'}`}>
        {value}
      </p>
    </div>
  )
}

function CriteriaItemCard({ index, item, maxScore }) {
  const score = Number(item.score) || 0
  const pct = Math.round((score / maxScore) * 100)
  const isDisabled = item.isDisable

  const getScoreColor = (p) => {
    if (p <= 30) return { bar: 'bg-rose-400', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' }
    if (p <= 60) return { bar: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' }
    return { bar: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' }
  }
  const c = getScoreColor(pct)

  return (
    <div className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${isDisabled ? 'border-slate-200 opacity-60' : 'border-[#e8ecf0]'}`}>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#064f5d] text-[13px] font-bold text-white shadow-sm">
            {index}
          </span>
          <div className="min-w-0 flex-1 sm:hidden">
            <h4 className="text-[15px] font-bold text-slate-800">{item.name}</h4>
            {isDisabled && <Badge label="Disabled" className="bg-slate-100 text-slate-500 text-[10px]" />}
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            <h4 className="text-[15px] font-bold text-slate-800">{item.name}</h4>
            {isDisabled && <Badge label="Disabled" className="bg-slate-100 text-slate-500 text-[10px]" />}
          </div>
          {item.description ? (
            <div className="text-[13px] leading-relaxed text-slate-500">
              <RichTextViewer content={item.description} />
            </div>
          ) : (
            <p className="text-[13px] italic text-slate-300">No description</p>
          )}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-slate-500">Score</span>
              <span className={`font-bold ${c.text}`}>
                {score} / {maxScore} <span className="text-slate-300 font-normal">({pct}%)</span>
              </span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${c.bar}`}
                style={{ width: `${pct}%` }}
              />
              {[25, 50, 75].map((m) => (
                <span key={m} className="absolute top-0 bottom-0 w-px bg-white/70" style={{ left: `${m}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text} border ${c.bar}/20`}>
            <span className="text-[18px] font-extrabold">{score}</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Points</span>
        </div>
      </div>
    </div>
  )
}
