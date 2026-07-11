import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CircleCheck, Calendar, Users, Eye, BookOpen } from 'lucide-react'
import BaseTable from '../../../../components/BaseTable'
import Badge from '../../../../components/Badge'
import { getLecturerMyTracks } from '../../../../api/lecturer'
import { formatDateTime } from '../../../../utils/format'

const PAGE_SIZE = 10

export default function LecturerTracksTab({ eventId }) {
  const [tracks, setTracks] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTracks = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      const result = await getLecturerMyTracks(eventId, params)
      setTracks(result.tracks || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tracks.')
      setTracks([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [eventId, pageIndex])

  useEffect(() => { fetchTracks() }, [fetchTracks])

  const roleColors = {
    Judge: 'bg-[#e8f5e9] text-[#2e7d32]',
    Mentor: 'bg-[#e3f2fd] text-[#1565c0]',
  }

  const columns = [
    { key: 'title', header: 'Track Title', headerIcon: FileText, render: (row) => (
      <Link to={`/lecture/tracks/${row.id}`} className="text-[14px] font-semibold text-[#064f5d] hover:underline">{row.title}</Link>
    )},
    { key: 'role', header: 'Role', headerIcon: CircleCheck, render: (row) => (
      <Badge label={row.eventRoleName || '—'} className={row.eventRoleName ? (roleColors[row.eventRoleName] || 'bg-[#f5f5f5] text-[#757575]') : 'bg-[#f5f5f5] text-[#757575]'} />
    )},
    { key: 'maxTeam', header: 'Max Teams', headerIcon: Users, render: (row) => <span className="text-[13px] font-semibold text-[#1f2f3a]">{row.maxTeam ?? '—'}</span> },
    { key: 'status', header: 'Status', headerIcon: CircleCheck, render: (row) => <Badge label="Active" className="bg-[#e8f5e9] text-[#2e7d32]" /> },
    { key: 'createdAt', header: 'Created', headerIcon: Calendar, render: (row) => <p className="text-[13px] font-semibold text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p> },
    { key: 'actions', header: '', headerClassName: 'text-right', className: 'text-right', render: (row) => (
      <div className="flex items-center justify-end gap-2">
        <Link to={`/lecture/tracks/${row.id}/topics`} className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-[13px] font-semibold text-[#7b1fa2] transition-colors hover:bg-[#e1bee7]">
          <BookOpen className="h-3.5 w-3.5" /> Topics
        </Link>
        <Link to={`/lecture/tracks/${row.id}`} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f4f6f8] px-2.5 py-1.5 text-[13px] font-semibold text-[#064f5d] hover:bg-[#e0f2f1]">
          <Eye className="h-3.5 w-3.5" /> View
        </Link>
      </div>
    )},
  ]

  return (
    <>
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">My Assigned Tracks</h3>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <BaseTable
          borderless
          columns={columns}
          data={tracks}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText="No tracks assigned to you for this event."
          keyExtractor={(row) => row.id}
          minWidth="700px"
        />
      </div>
    </>
  )
}
