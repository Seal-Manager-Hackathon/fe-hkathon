import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, FileText, Calendar, Clock } from 'lucide-react'
import { getLecturerCriteriaTemplateDetail } from '../../../api/lecturer'
import Badge from '../../../components/Badge'
import RichTextViewer from '../../../components/RichTextViewer'
import LecturerCriteriaItemsPanel from '../../../components/LecturerCriteriaItemsPanel'
import { formatDate } from '../../../utils/format'
import { cn } from '../../../utils/cn'

export default function LecturerCriteriaTemplateDetail() {
  const { roundId, templateId } = useParams()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getLecturerCriteriaTemplateDetail(templateId)
        if (!cancelled) setTemplate(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load template.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [templateId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 h-4 w-36 animate-pulse rounded bg-slate-200" />
        <div className="mb-6 h-40 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full bg-rose-50 p-4"><EyeOff className="h-8 w-8 text-rose-400" /></div>
        <p className="text-[18px] font-semibold text-gray-500">{error.includes('Not Found') ? 'Template not found' : error}</p>
        <Link to={`/lecture/rounds/${roundId}/criteria-templates`}
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#05404a]">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>
      </div>
    )
  }

  if (!template) return null

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <Link to={`/lecture/rounds/${roundId}/criteria-templates`}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] hover:text-[#05404a] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Criteria Templates
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#064f5d]/15 bg-gradient-to-br from-[#064f5d] via-[#0a6e7d] to-[#0d8a96] p-6 text-white shadow-lg shadow-[#064f5d]/10 sm:p-7">
        <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-white/5" />
        <div className="absolute bottom-0 right-16 h-24 w-24 rounded-tl-full bg-white/5" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge label="Active" className="bg-emerald-400/20 text-emerald-100 border border-emerald-400/30" />
          </div>
          <h1 className="text-[24px] font-bold leading-tight break-words text-white sm:text-[30px]">{template.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-white/70">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Created {formatDate(template.createdAt)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Updated {formatDate(template.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-[#fafbfc]">
          <TabBtn active={activeTab === 'description'} onClick={() => setActiveTab('description')} icon={FileText} label="Description" />
          <TabBtn active={activeTab === 'items'} onClick={() => setActiveTab('items')} icon={Eye} label="Items" />
        </div>
        <div className="p-5 sm:p-6">
          {activeTab === 'description' ? (
            <RichTextViewer content={template.description || 'No description provided.'} />
          ) : (
            <LecturerCriteriaItemsPanel templateId={templateId} />
          )}
        </div>
      </div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        'relative flex-1 cursor-pointer px-5 py-3.5 text-[13px] font-semibold transition-all duration-200',
        active ? 'bg-white text-[#064f5d]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      )}>
      <span className="inline-flex items-center gap-2">
        <Icon className={cn('h-4 w-4 transition-colors duration-200', active ? 'text-[#064f5d]' : 'text-slate-400')} />
        {label}
      </span>
      {active && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#064f5d]" />}
    </button>
  )
}
