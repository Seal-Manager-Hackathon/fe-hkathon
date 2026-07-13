import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Eye, FileText } from 'lucide-react'
import { getStudentTeamEvents } from '../../../api/student'
import { formatDate } from '../../../utils/format'
import Pagination from '../../../components/Pagination'

export default function TeamEventsSection({ teamId }) {
  const [events, setEvents] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    async function fetchEvents() {
      setLoading(true)
      try {
        const result = await getStudentTeamEvents(teamId, { PageIndex: pageIndex, PageSize: 5 })
        if (!cancelled) {
          setEvents(result.items || [])
          setTotalCount(result.totalCount || 0)
        }
      } catch {
        if (!cancelled) setEvents([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchEvents()
    return () => { cancelled = true }
  }, [teamId, pageIndex])

  const totalPages = Math.ceil(totalCount / 5)

  if (loading) return <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-lg bg-gray-100" />)}</div>

  if (events.length === 0) return (
    <div className="flex flex-col items-center justify-center py-8">
      <Calendar size={24} className="mb-2 text-[#8a9ba6]" />
      <p className="text-[13px] text-[#7a8e99]">No events joined yet.</p>
    </div>
  )

  return (
    <div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.registerTeamId} className="flex flex-col gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{event.eventName}</p>
              <p className="text-[12px] text-[#8a9ba6]">Registered {formatDate(event.createdAt)}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link to={`/hackathons/${event.eventId}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#0d47a1]">
                <Eye size={14} /> View Hackathon
              </Link>
              <Link to={`/teams/${teamId}/registrations`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e0e5] bg-white px-4 py-2 text-[12px] font-semibold text-[#1565c0] transition-colors hover:bg-[#f0f7ff]">
                <FileText size={14} /> My Registrations
              </Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && <div className="mt-3"><Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} /></div>}
    </div>
  )
}
