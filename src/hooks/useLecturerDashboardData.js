import { useState, useEffect } from 'react'
import { getLecturerEvents } from '../api/lecturer'
import { formatDateTime } from '../utils/format'

function formatEvent(e) {
  return {
    id: e.id,
    name: e.name,
    season: e.startTime ? formatDateTime(e.startTime, '') : '',
    date: e.createdAt ? formatDateTime(e.createdAt, '') : '',
    status: e.status,
  }
}

/**
 * Fetches dashboard data for the lecturer.
 * Uses getLecturerEvents with different status filters to derive counts,
 * since there are no dedicated count endpoints for lecturers.
 */
export function useLecturerDashboardData() {
  const [counts, setCounts] = useState({
    totalEvents: '-',
    ongoingEvents: '-',
    upcomingEvents: '-',
    completedEvents: '-',
  })

  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)

      try {
        const [totalRes, ongoingRes, upcomingRes, completedRes] = await Promise.all([
          getLecturerEvents({ PageIndex: 1, PageSize: 1 }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Published' }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Draft' }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Closed' }),
        ])

        if (!cancelled) {
          setCounts({
            totalEvents: totalRes.totalCount ?? '-',
            ongoingEvents: ongoingRes.totalCount ?? '-',
            upcomingEvents: upcomingRes.totalCount ?? '-',
            completedEvents: completedRes.totalCount ?? '-',
          })
        }
      } catch {
        // keep defaults
      }

      // Recent events — fetch last 5
      try {
        const r = await getLecturerEvents({ PageIndex: 1, PageSize: 5 })
        if (!cancelled && r?.events?.length) {
          setRecentEvents(r.events.map(formatEvent))
        }
      } catch {
        // keep empty
      }

      if (!cancelled) setLoading(false)
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { counts, recentEvents, loading }
}
