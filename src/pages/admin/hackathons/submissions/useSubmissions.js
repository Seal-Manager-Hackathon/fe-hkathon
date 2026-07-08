import { useState, useEffect, useCallback, useRef } from 'react'
import { getEventSubmissions } from '../../../../api/admin'
import { PAGE_SIZE } from './useSubmissionFilters'

const buildQuery = (filters, page) => {
  const p = { PageIndex: page, PageSize: PAGE_SIZE }
  if (filters.keyword) p.keyword = filters.keyword
  if (filters.roundId) p.roundId = filters.roundId
  if (filters.trackId) p.trackId = filters.trackId
  if (filters.topicId) p.topicId = filters.topicId
  if (filters.registerTeamId) p.registerTeamId = filters.registerTeamId
  return p
}

export function useSubmissions(eventId, filters) {
  const [items, setItems] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset page when filters change
  const prevFiltersRef = useRef(filters)
  useEffect(() => {
    const prev = prevFiltersRef.current
    if (
      prev.keyword !== filters.keyword ||
      prev.roundId !== filters.roundId ||
      prev.trackId !== filters.trackId ||
      prev.topicId !== filters.topicId ||
      prev.registerTeamId !== filters.registerTeamId
    ) {
      setPage(1)
    }
    prevFiltersRef.current = filters
  }, [filters])

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getEventSubmissions(eventId, buildQuery(filters, page))
      setItems(result.items || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load submissions.')
      setItems([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [eventId, page, filters])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  return { items, totalCount, page, setPage, loading, error }
}
