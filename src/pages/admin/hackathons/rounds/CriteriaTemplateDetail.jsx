import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, FileText, Calendar, Clock, CircleCheck, Edit, Target } from 'lucide-react'
import { getCriteriaTemplateDetail, getRoundDetail } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import RichTextViewer from '../../../../components/RichTextViewer'
import CriteriaItemsPanel from '../../../../components/CriteriaItemsPanel'
import { formatDateTime, formatDate } from '../../../../utils/format'
import { cn } from '../../../../utils/cn'

export default function CriteriaTemplateDetail() {
  const { roundId, templateId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [template, setTemplate] = useState(null)
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(tabParam === 'items' ? 'items' : 'description')
  const [itemsCounts, setItemsCounts] = useState({ active: 0, total: 0 })

  useEffect(() => {
    if (tabParam === 'items' || tabParam === 'description') setActiveTab(tabParam)
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
        try { const r = await getRoundDetail(roundId); if (!cancelled) setRound(r) } catch {}
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load template.')
      } finally { if (!cancelled) setLoading(false) }
    }
    fetch()
    return () => { cancelled = true }
  }, [roundId, templateId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mb-6 h-40 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full bg-rose-50 p-4"><EyeOff className="h-8 w-8 text-rose-400" /></div>
        <p className="text-[18px] font-semibold text-gray-500">{error.includes('Not Found') ? 'Template not found' : error}</p>
        <Link to={`/admin/rounds/${roundId}/criteria-templates`} className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#05404a]">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>
      </div>
    )
  }

  const templateItems = template.items || []
  const totalScore = templateItems.reduce((sum, i) => sum + (Number(i.score) || 0), 0)
  const isDeleted = template.isDisable

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <Link to={`/admin/rounds/${roundId}/criteria-templates`} className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Criteria Templates
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#064f5d]/15 bg-gradient-to-br from-[#064f5d] via-[#0a6e7d] to-[#0d8a96] p-6 text-white shadow-lg shadow-[#064f5d]/10 sm:p-7">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-white/5" />
        <div className="absolute bottom-0 right-16 h-24 w-24 rounded-tl-full bg-white/5" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge label={isDeleted ? 'Deleted' : 'Active'} className={isDeleted ? 'bg-white/15 text-white border border-white/20' : 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'} />
              {round && <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80"><Target className="h-3 w-3" />{round.name}</span>}
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

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<CircleCheck className="h-5 w-5" />} label="Total Score" value={itemsCounts.total > 0 ? `${itemsCounts.activeScore ?? totalScore}/${itemsCounts.maxScore}` : totalScore} color="text-emerald-500" bg="bg-emerald-50" border="border-emerald-100" />
        <StatCard icon={<Eye className="h-5 w-5" />} label="Criteria Items" value={itemsCounts.total > 0 ? `${itemsCounts.active}/${itemsCounts.total}` : templateItems.length} color="text-violet-500" bg="bg-violet-50" border="border-violet-100" />
        <StatCard icon={<Calendar className="h-5 w-5" />} label="Created" value={formatDate(template.createdAt)} color="text-blue-500" bg="bg-blue-50" border="border-blue-100" mono />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Updated" value={formatDate(template.updatedAt)} color="text-orange-500" bg="bg-orange-50" border="border-orange-100" mono />
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-[#fafbfc]">
          <TabBtn active={activeTab === 'description'} onClick={() => setTab('description')} icon={FileText} label="Description" />
          <TabBtn active={activeTab === 'items'} onClick={() => setTab('items')} icon={Eye} label={`Items (${itemsCounts.total > 0 ? `${itemsCounts.active}/${itemsCounts.total}` : templateItems.length})`} />
        </div>
        <div className="p-5 sm:p-6">
          {activeTab === 'description' ? (
            <RichTextViewer content={template.description || 'No description provided.'} />
          ) : (
            <CriteriaItemsPanel templateId={templateId} onCountsChange={setItemsCounts} />
          )}
        </div>
      </div>
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
