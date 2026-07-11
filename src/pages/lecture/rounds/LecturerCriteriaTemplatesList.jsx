import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, FileText, Calendar, CircleCheck, Search } from 'lucide-react'
import { getLecturerCriteriaTemplates, getLecturerRoundDetail } from '../../../api/lecturer'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const criteriaFilters = [
  { type: 'search', key: 'keyword', label: 'Title', icon: Search, placeholder: 'Search criteria title...' },
]

const columns = [
  {
    key: 'title',
    header: 'Title',
    headerIcon: FileText,
    render: (row) => (
      <Link to={`/lecture/rounds/${row.roundId}/criteria-templates/${row.id}`}
        className="text-[14px] font-semibold text-[#064f5d] hover:underline">
        {row.title}
      </Link>
    ),
  },
  {
    key: 'isActive',
    header: 'Active',
    headerIcon: CircleCheck,
    render: (row) => row.isActive
      ? <Badge label="Yes" className="bg-[#e8f5e9] text-[#2e7d32]" />
      : <Badge label="No" className="bg-[#f5f5f5] text-[#9e9e9e]" />,
  },
  {
    key: 'createdAt',
    header: 'Created',
    headerIcon: Calendar,
    render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
  },
  {
    key: 'actions',
    header: '',
    headerClassName: 'text-right',
    className: 'text-right',
    render: (row) => (
      <Link to={`/lecture/rounds/${row.roundId}/criteria-templates/${row.id}`}
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]">
        <Eye className="h-3.5 w-3.5" /> View
      </Link>
    ),
  },
]

export default function LecturerCriteriaTemplatesList() {
  const { roundId } = useParams()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [round, setRound] = useState(null)

  const hasActive = keyword !== ''

  const fetchTemplates = useCallback(async () => {
    if (!roundId) return
    setLoading(true); setError('')
    try {
      const params = {}
      if (keyword) params.keyword = keyword
      const result = await getLecturerCriteriaTemplates(roundId, params)
      setTemplates(result.templates || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load criteria templates.')
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [roundId, keyword])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  // Fetch round info for breadcrumb
  useEffect(() => {
    if (roundId) {
      getLecturerRoundDetail(roundId).then((d) => setRound(d)).catch(() => {})
    }
  }, [roundId])

  // Client-side filtering (API doesn't support complex filters)
  const filteredTemplates = useMemo(() => {
    if (!keyword) return templates
    const kw = keyword.toLowerCase()
    return templates.filter((t) => t.title?.toLowerCase().includes(kw))
  }, [templates, keyword])

  function handleFilterChange(key, value) {
    if (key === 'keyword') setKeyword(value)
    setPageIndex(1)
  }

  function handleReset() {
    setKeyword('')
    setPageIndex(1)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link
          to={round?.eventId ? `/lecture/hackathons/${round.eventId}?tab=Rounds` : '/lecture/hackathons'}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Rounds
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
            Criteria Templates {round?.name ? `— ${round.name}` : ''}
          </h1>
        </div>
      </div>

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar
            filters={criteriaFilters}
            values={{ keyword }}
            onChange={handleFilterChange}
            onReset={handleReset}
            hasActive={hasActive}
          />
        </div>

        {error && (
          <div className="mx-5 mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
            {error}
          </div>
        )}

        <BaseTable
          borderless
          columns={columns}
          data={filteredTemplates}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={filteredTemplates.length}
          onPageChange={setPageIndex}
          loading={loading}
          emptyText={
            hasActive
              ? 'No criteria templates match the current search.'
              : 'No criteria templates for this round yet.'
          }
          keyExtractor={(row) => row.id}
          minWidth="600px"
        />
      </div>
    </div>
  )
}
