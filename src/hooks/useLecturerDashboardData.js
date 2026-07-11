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
 * Only fetches what's actually displayed: event counts + recent events.
 */
export function useLecturerDashboardData() {
  const [counts, setCounts] = useState({
    totalEvents: '-', publishedEvents: '-', draftEvents: '-', closedEvents: '-',
  })
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      try {
        const [total, published, draft, closed] = await Promise.all([
          getLecturerEvents({ PageIndex: 1, PageSize: 1 }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Published' }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Draft' }),
          getLecturerEvents({ PageIndex: 1, PageSize: 1, Status: 'Closed' }),
        ])
        if (!cancelled) {
          setCounts({
            totalEvents: total.totalCount ?? '-',
            publishedEvents: published.totalCount ?? '-',
            draftEvents: draft.totalCount ?? '-',
            closedEvents: closed.totalCount ?? '-',
          })
        }
      } catch { /* keep defaults */ }

      try {
        const r = await getLecturerEvents({ PageIndex: 1, PageSize: 5 })
        if (!cancelled && r?.events?.length) {
          setRecentEvents(r.events.map(formatEvent))
        }
      } catch { /* keep empty */ }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { counts, recentEvents }
}
