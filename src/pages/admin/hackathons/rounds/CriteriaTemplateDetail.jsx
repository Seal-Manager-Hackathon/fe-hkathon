import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, Clock, Tag, Hash, AlignLeft, CircleCheck, Edit } from 'lucide-react'
import { getCriteriaTemplateDetail, getRoundDetail } from '../../../../api/admin'
import Badge from '../../../../components/Badge'
import BaseTable from '../../../../components/BaseTable'
import { formatDateTime } from '../../../../utils/format'

export default function CriteriaTemplateDetail() {
  const { roundId, templateId } = useParams()
  const [template, setTemplate] = useState(null)
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><p className="text-gray-400">Loading...</p></div>
  if (error || !template) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><p className="text-[#c62828]">{error || 'Template not found.'}</p></div>

  const items = template.items || []
  const totalScore = items.reduce((sum, i) => sum + (i.score || 0), 0)

  const itemColumns = [
    { key: 'name', header: 'Name', headerIcon: Tag, render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.name}</span> },
    { key: 'description', header: 'Description', headerIcon: AlignLeft, render: (row) => <span className="text-[13px] text-gray-500">{row.description || '—'}</span> },
    { key: 'score', header: 'Score', headerIcon: Hash, render: (row) => <span className="text-[14px] font-bold text-[#2e7d32]">{row.score}</span> },
  ]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={`/admin/rounds/${roundId}/criteria-templates`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Criteria Templates
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{template.title}</h1>
            <Badge label={template.isDisable ? 'Deleted' : 'Active'} className={template.isDisable ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#e8f5e9] text-[#2e7d32]'} />
          </div>
          {round && <p className="mt-1 text-[13px] text-gray-400">Round: {round.name}</p>}
        </div>
        {!template.isDisable && (
          <Link to={`/admin/rounds/${roundId}/criteria-templates/${templateId}/edit`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
            <Edit className="h-4 w-4" />Edit Template
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <InfoCard icon={<CircleCheck className="h-5 w-5 text-[#2e7d32]" />} label="Total Score" value={totalScore} bg="bg-green-50" />
        <InfoCard icon={<Hash className="h-5 w-5 text-[#6a1b9a]" />} label="Items" value={items.length} bg="bg-purple-50" />
        <InfoCard icon={<Calendar className="h-5 w-5 text-[#546e7a]" />} label="Created" value={formatDateTime(template.createdAt)} bg="bg-gray-50" mono />
        <InfoCard icon={<Clock className="h-5 w-5 text-[#546e7a]" />} label="Updated" value={formatDateTime(template.updatedAt)} bg="bg-gray-50" mono />
      </div>

      {template.description && (
        <div className="mb-8 rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
            <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4" /> Description
            </h3>
          </div>
          <div className="px-5 py-5">
            <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{template.description}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-[#0a6e7d] to-[#0d8a96] px-5 py-4">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
            <Tag className="h-4 w-4" /> Criteria Items
          </h3>
        </div>
        <div className="p-0">
          <BaseTable
            borderless
            columns={itemColumns}
            data={items}
            page={1}
            pageSize={items.length || 1}
            total={items.length}
            keyExtractor={(row) => row.id}
            minWidth="500px"
            emptyText="No criteria items."
          />
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value, bg = 'bg-gray-50', mono = false }) {
  return (
    <div className={`rounded-xl border border-[#e8ecf0] ${bg} p-4 flex flex-col gap-2`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className={`font-bold text-[#1f2f3a] ${mono ? 'text-[13px]' : 'text-[16px]'}`}>{value}</p>
    </div>
  )
}
