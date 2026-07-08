import { useState, useEffect, useCallback, useMemo } from 'react'
import { getReports, getUserDetail } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { reportsFilters } from './ReportsFilters'
import { reportsColumns } from './ReportsColumns'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  fromDate: '',
  toDate: '',
}

export default function ReportsManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [reports, setReports] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userDetails, setUserDetails] = useState({})

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const buildParams = useCallback(() => {
    const params = { pageIndex, pageSize: PAGE_SIZE }
    const { keyword, status, fromDate, toDate } = filters
    if (keyword) params.keyword = keyword
    if (status) params.status = status
    if (fromDate) params.fromDate = new Date(fromDate).toISOString()
    if (toDate) params.toDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const resolveUsers = useCallback(async (list) => {
    const details = { ...userDetails }
    const promises = []

    for (const item of list) {
      if (item.userId && !details[item.userId]) {
        promises.push(
          getUserDetail(item.userId)
            .then((user) => { details[item.userId] = user })
            .catch(() => { details[item.userId] = null }),
        )
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises)
      setUserDetails({ ...details })
    }
  }, [userDetails])

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getReports(buildParams())
      const list = result.items || []
      setReports(list)
      setTotalCount(result.totalCount || 0)
      await resolveUsers(list)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load reports.'
      if (err?.response?.status === 400) {
        setError('Invalid filter value. Please check your filters and try again.')
      } else {
        setError(msg)
      }
      setReports([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams, resolveUsers])

  useEffect(() => { fetchReports() }, [fetchReports])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
    setUserDetails({})
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
    setUserDetails({})
  }

  const columns = useMemo(
    () => reportsColumns(userDetails),
    [userDetails],
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Reports</h1>
      </div>

      <FilterBar
        filters={reportsFilters}
        values={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        hasActive={hasActive}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <BaseTable
        columns={columns}
        data={reports}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No reports match the current filters.' : 'No reports in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="800px"
      />
    </div>
  )
}