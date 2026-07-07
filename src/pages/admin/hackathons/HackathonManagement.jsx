import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trophy, CircleDot, Play, Flag, Calendar, MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from 'lucide-react'
import { getEvents, deleteEvent, restoreEvent } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import Badge from '../../../components/Badge'
import { hackathonFilters } from './HackathonFilters'
import { toast, confirm } from '../../../utils/toast'
import { formatDateTime } from '../../../utils/format'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

const statusBadge = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const actionBtnClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'
const dangerBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2] w-[92px]'
const restoreBtnClass =
  'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-[13px] font-semibold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] w-[92px]'

function hackathonColumns(onDelete, onRestore) {
  return [
    {
      key: 'name',
      header: 'Name',
      headerIcon: Trophy,
      render: (row) => (
        <Link to={`/admin/hackathons/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: 'startTime',
      header: 'Start',
      headerIcon: Play,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.startTime)}</p>,
    },
    {
      key: 'endTime',
      header: 'End',
      headerIcon: Flag,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.endTime)}</p>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] text-gray-500">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'status',
      header: 'Status',
      headerIcon: CircleDot,
      render: (row) => <Badge label={row.status} className={statusBadge[row.status] || 'bg-[#f5f5f5] text-[#757575]'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerIcon: MoreHorizontal,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/admin/hackathons/${row.id}`} className={actionBtnClass}>
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          {!row.isDisable ? (
            <>
              <Link to={`/admin/hackathons/${row.id}/edit`} className={actionBtnClass}>
                <Edit className="h-3.5 w-3.5" /> Edit
              </Link>
              <button onClick={() => onDelete?.(row)} className={dangerBtnClass}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </>
          ) : (
            <button onClick={() => onRestore?.(row)} className={restoreBtnClass}>
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
          )}
        </div>
      ),
    },
  ]
}

export default function HackathonManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const buildParams = useCallback(() => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { keyword, status, isDisable, fromDate, toDate } = filters
    if (keyword) params.Keyword = keyword
    if (status) params.Status = status
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getEvents(buildParams())
      setEvents(result.events || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load events.'
      setError(msg)
      setEvents([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
  }

  async function handleDelete(event) {
    const ok = await confirm('Delete Hackathon', `Are you sure you want to delete "${event.name}"?`)
    if (!ok) return
    try {
      await deleteEvent(event.id)
      toast.success('Hackathon deleted')
      fetchEvents()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete hackathon.')
    }
  }

  async function handleRestore(event) {
    const ok = await confirm('Restore Hackathon', `Are you sure you want to restore "${event.name}"?`)
    if (!ok) return
    try {
      await restoreEvent(event.id)
      toast.success('Hackathon restored')
      fetchEvents()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore hackathon.')
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Hackathons</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">Manage all {totalCount} hackathon events.</p>
        </div>
        <Link
          to="/admin/hackathons/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />Create Hackathon
        </Link>
      </div>

      <FilterBar
        filters={hackathonFilters}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        hasActive={hasActive}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <BaseTable
        columns={hackathonColumns(handleDelete, handleRestore)}
        data={events}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No hackathons match the current filters.' : 'No hackathons in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="800px"
      />
    </div>
  )
}
