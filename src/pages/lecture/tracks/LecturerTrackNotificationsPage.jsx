import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bell, Calendar, Eye, X } from 'lucide-react'
import BaseTable from '../../../components/BaseTable'
import RichTextViewer from '../../../components/RichTextViewer'
import { getLecturerMentorNotifications, getLecturerMentorNotificationDetail } from '../../../api/lecturer'
import { formatDateTime, formatDate } from '../../../utils/format'

const PAGE_SIZE = 10

const viewBtnClass =
  'inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#f5f5f5] px-2.5 py-1.5 text-[13px] font-semibold text-[#424242] transition-colors hover:bg-[#e8e8e8]'

function DetailModal({ open, notificationId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !notificationId) return
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try {
        const data = await getLecturerMentorNotificationDetail(notificationId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load notification.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [notificationId, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-[520px] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Bell className="h-5 w-5 text-[#1565c0]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold text-[#1f2f3a] truncate">{loading ? 'Loading...' : detail?.title || 'Notification'}</h3>
              {detail?.createdAt && (
                <p className="text-[12px] text-gray-400">{formatDate(detail.createdAt)}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-100" />
            </div>
          ) : error ? (
            <p className="text-[14px] text-[#c62828]">{error}</p>
          ) : detail ? (
            <RichTextViewer content={detail.description || 'No description provided.'} />
          ) : null}
        </div>
        <div className="shrink-0 border-t border-[#f0f0f0] px-6 py-3.5 flex justify-end">
          <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function LecturerTrackNotificationsPage() {
  const { trackId } = useParams()
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detailTarget, setDetailTarget] = useState(null)

  const fetch = useCallback(async (page = 1) => {
    if (!trackId) return
    setLoading(true); setError('')
    try {
      const result = await getLecturerMentorNotifications(trackId, { PageIndex: page, PageSize: PAGE_SIZE })
      setItems(result.notifications || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notifications.')
      setItems([]); setTotalCount(0)
    } finally { setLoading(false) }
  }, [trackId])

  useEffect(() => { fetch(1) }, [fetch])

  const columns = [
    {
      key: 'title',
      header: 'Title',
      headerIcon: Bell,
      render: (row) => <span className="text-[14px] font-semibold text-[#1f2f3a]">{row.title}</span>,
    },
    {
      key: 'createdAt',
      header: 'Sent',
      headerIcon: Calendar,
      render: (row) => <p className="text-[13px] font-semibold text-[#1f2f3a]">{formatDateTime(row.createdAt)}</p>,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <button onClick={() => setDetailTarget(row.id)} className={viewBtnClass}>
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ]

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-4">
        <Link to="/lecture/hackathons" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Hackathons
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Mentor Notifications</h1>
        <p className="mt-1 text-[14px] text-gray-500">Notifications sent for this track.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <BaseTable
          borderless
          columns={columns}
          data={items}
          page={pageIndex}
          pageSize={PAGE_SIZE}
          total={totalCount}
          onPageChange={setPageIndex}
          loading={loading}
          serverSide
          emptyText="No notifications sent for this track yet."
          keyExtractor={(row) => row.id}
          minWidth="500px"
        />
      </div>

      <DetailModal
        open={!!detailTarget}
        notificationId={detailTarget}
        onClose={() => setDetailTarget(null)}
      />
    </div>
  )
}
