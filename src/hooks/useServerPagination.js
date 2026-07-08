import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

/**
 * Reusable server-side pagination + filter hook for management pages.
 *
 * @param {Function} fetchFn     - async (params) => { data, totalCount }
 * @param {Object}   defaultFilters
 * @param {number}   pageSize
 * @param {Function} buildParams - (filters, pageIndex, pageSize) => apiParams
 * @returns {{ data, totalCount, loading, error, filters, pageIndex, hasActive, setPageIndex, handleFilterChange, handleReset, refetch }}
 */
export function useServerPagination({
  fetchFn,
  defaultFilters = {},
  pageSize = 10,
  buildParams,
}) {
  const [filters, setFilters] = useState(defaultFilters)
  const [pageIndex, setPageIndex] = useState(1)
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const params = useMemo(
    () => buildParams ? buildParams(filters, pageIndex, pageSize) : { ...filters, PageIndex: pageIndex, PageSize: pageSize },
    [filters, pageIndex, pageSize, buildParams],
  )

  const refetch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await fetchFn(params)
      if (!mountedRef.current) return
      setData(
        result.data ?? result.events ?? result.users ?? result.teams ?? result.notifications ?? result.items ?? [],
      )
      setTotalCount(result.totalCount ?? 0)
    } catch (err) {
      if (!mountedRef.current) return
      const msg = err?.response?.data?.message || 'Failed to load data.'
      setError(msg)
      setData([])
      setTotalCount(0)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [fetchFn, params])

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
    return () => { mountedRef.current = false }
  }, [refetch])

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters(defaultFilters)
    setPageIndex(1)
  }, [defaultFilters])

  return {
    data,
    totalCount,
    loading,
    error,
    filters,
    pageIndex,
    hasActive,
    setPageIndex,
    handleFilterChange,
    handleReset,
    refetch,
  }
}
