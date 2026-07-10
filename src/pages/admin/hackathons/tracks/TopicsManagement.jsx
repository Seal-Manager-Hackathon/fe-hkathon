import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2, RotateCcw, FileText, Calendar, CircleCheck, MoreHorizontal, Search, Ban, ArrowLeft } from 'lucide-react'
import { getTopics, getTrackDetail, deleteTopic, restoreTopic } from '../../../../api/admin'
import { toast, confirm } from '../../../../utils/toast'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import Badge from '../../../../components/Badge'
import { formatDateTime } from '../../../../utils/format'

const PAGE_SIZE = 10

const DEFAULT_VALUES = { keyword: '', isDisable: '' }

const topicFilters = [
  { type: 'search', key: 'keyword', label: 'Topic Name', icon: Search, placeholder: 'Search topic name...' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
]

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'

function topicColumns(trackId, onDelete, onRestore) {
  return [
    {
      key: 'title',
      header: 'Topic Title',
      headerIcon: FileText,
      render: (row) => <Link to={`/admin/tracks/${trackId}/topics/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.title}</Link>,
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
      render: (row) => <p className="text-[13px] text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/tracks/${trackId}/topics/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          {!row.isDisable && (
            <Link to={`/admin/tracks/${trackId}/topics/${row.id}/edit`} className={actionBtnClass}>
              <Edit className="h-3.5 w-3.5" /> Edit
            </Link>
          )}
          {row.isDisable ? (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          ) : (
            <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
      ),
    },
  ]
}

export default function TopicsManagement() {
  const { trackId } = useParams()
  const [topics, setTopics] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [track, setTrack] = useState(null)

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  useEffect(() => {
    getTrackDetail(trackId).then((d) => setTrack(d)).catch(() => {})
  }, [trackId])

  const fetchTopics = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (filters.keyword) params.Keyword = filters.keyword
      if (filters.isDisable !== '') params.IsDisable = filters.isDisable === 'true'
      const result = await getTopics(trackId, params)
      setTopics(result.topics || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load topics.')
      setTopics([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [trackId, pageIndex, filters])

  useEffect(() => { fetchTopics() }, [fetchTopics])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  async function handleDelete(row) {
    if (!(await confirm('Delete Topic', `Are you sure you want to delete "${row.title}"?`))) return
    try {
      await deleteTopic(row.id)
      toast.success('Topic deleted successfully')
      fetchTopics()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete topic.')
    }
  }

  async function handleRestore(row) {
    if (!(await confirm('Restore Topic', `Are you sure you want to restore "${row.title}"?`))) return
    try {
      await restoreTopic(row.id)
      toast.success('Topic restored successfully')
      fetchTopics()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore topic.')
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={`/admin/tracks/${trackId}`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Track
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
            Topics {track?.title ? `— ${track.title}` : ''}
          </h1>
        </div>
        {trackId && (
          <Link to={`/admin/tracks/${trackId}/topics/create`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto">
            <Plus className="h-4 w-4" />Create Topic
          </Link>
        )}
      </div>

      <FilterBar filters={topicFilters} values={filters} onChange={handleFilterChange} onReset={handleReset} hasActive={hasActive} />

      {error && <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>}

      <BaseTable
        columns={topicColumns(trackId, handleDelete, handleRestore)}
        data={topics}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No topics match the current filters.' : 'No topics in this track yet.'}
        keyExtractor={(row) => row.id}
        minWidth="700px"
      />
    </div>
  )
}
