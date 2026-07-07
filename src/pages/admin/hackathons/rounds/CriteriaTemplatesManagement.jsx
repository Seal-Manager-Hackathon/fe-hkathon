import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Eye, FileText, Calendar, CircleCheck, MoreHorizontal, Search, Ban, ArrowLeft } from 'lucide-react'
import { getCriteriaTemplates, getRoundDetail } from '../../../../api/admin'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const PAGE_SIZE = 10

const DEFAULT_VALUES = { keyword: '', isDisable: '' }

const criteriaFilters = [
  { type: 'search', key: 'keyword', label: 'Title', icon: Search, placeholder: 'Search title...' },
  { type: 'select', key: 'isDisable', label: 'Disabled', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

const viewBtnClass =
  'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

function criteriaColumns() {
  return [
    {
      key: 'title',
      header: 'Title',
      headerIcon: FileText,
      render: (row) => <span className="text-[14px] font-semibold text-[#064f5d]">{row.title}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => row.isDisable ? <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" /> : <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/rounds/${row.roundId}/criteria-templates/${row.id}`} className={viewBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]
}

export default function CriteriaTemplatesManagement() {
  const { roundId } = useParams()
  const [templates, setTemplates] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [round, setRound] = useState(null)

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  useEffect(() => {
    getRoundDetail(roundId).then((d) => setRound(d)).catch(() => {})
  }, [roundId])

  const fetchTemplates = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { pageIndex, pageSize: PAGE_SIZE }
      if (filters.keyword) params.keyword = filters.keyword
      if (filters.isDisable !== '') params.isDisable = filters.isDisable === 'true'
      const result = await getCriteriaTemplates(roundId, params)
      setTemplates(result.templates || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load criteria templates.')
      setTemplates([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [roundId, pageIndex, filters])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={round?.eventId ? `/admin/hackathons/${round.eventId}?tab=Rounds` : '/admin/hackathons'} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Rounds
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
            Criteria Templates {round?.name ? `— ${round.name}` : ''}
          </h1>
        </div>
        <Link to={`/admin/rounds/${roundId}/criteria-templates/create`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
          <Plus className="h-4 w-4" />Create Template
        </Link>
      </div>

      <FilterBar filters={criteriaFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <BaseTable
        columns={criteriaColumns()}
        data={templates}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No criteria templates match the current filters.' : 'No criteria templates for this round yet.'}
        keyExtractor={(row) => row.id}
        minWidth="700px"
      />
    </div>
  )
}
