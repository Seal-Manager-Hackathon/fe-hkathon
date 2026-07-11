import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Eye, FileText, Calendar, CircleCheck, Search, ArrowLeft } from 'lucide-react'
import { getLecturerTopics, getLecturerTrackDetail } from '../../../api/lecturer'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const topicFilters = [
  { type: 'search', key: 'keyword', label: 'Topic Name', icon: Search, placeholder: 'Search topic name...' },
]

const viewBtnClass =
  'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

function topicColumns(trackId) {
  return [
    {
      key: 'title',
      header: 'Topic Title',
      headerIcon: FileText,
      render: (row) => (
        <Link to={`/lecture/tracks/${trackId}/topics/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.title}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleCheck,
      render: (row) => <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] font-semibold text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/lecture/tracks/${trackId}/topics/${row.id}`} className={viewBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      ),
    },
  ]
}

export default function LecturerTopicsList() {
  const { trackId } = useParams()
  const [topics, setTopics] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [track, setTrack] = useState(null)

  const hasActive = keyword !== ''

  useEffect(() => {
    if (trackId) {
      getLecturerTrackDetail(trackId).then((d) => setTrack(d)).catch(() => {})
    }
  }, [trackId])

  const fetchTopics = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (keyword) params.Keyword = keyword
      const result = await getLecturerTopics(trackId, params)
      setTopics(result.topics || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load topics.')
      setTopics([]); setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [trackId, pageIndex, keyword])

  useEffect(() => { fetchTopics() }, [fetchTopics])

  function handleFilterChange(key, value) {
    if (key === 'keyword') setKeyword(value)
    setPageIndex(1)
  }

  function handleReset() {
    setKeyword('')
    setPageIndex(1)
  }

  const backUrl = track?.eventId
    ? `/lecture/hackathons/${track.eventId}?tab=Tracks`
    : '/lecture/hackathons'

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to={backUrl} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Tracks
        </Link>
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">
            Topics {track?.title ? `— ${track.title}` : ''}
          </h1>
        </div>
      </div>

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar
            filters={topicFilters}
            values={{ keyword }}
            onChange={handleFilterChange}
            onReset={handleReset}
            hasActive={hasActive}
          />
        </div>

        {error && (
          <div className="mx-5 mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
        )}

        <BaseTable
          borderless
          columns={topicColumns(trackId)}
          data={topics}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText={hasActive ? 'No topics match the current search.' : 'No topics in this track yet.'}
          keyExtractor={(row) => row.id}
          minWidth="700px"
        />
      </div>
    </div>
  )
}
