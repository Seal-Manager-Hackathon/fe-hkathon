import { useState, useEffect, useCallback, useMemo } from 'react'
import { getReports, getUserDetail, updateReportStatus } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { reportsFilters } from './ReportsFilters'
import { reportsColumns } from './ReportsColumns'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast } from '../../../utils/toast'
import ResolveModal from './ReportDetail/ResolveModal'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  keyword: '',
  status: '',
  fromDate: '',
  toDate: '',
}

export default function ReportsManagement() {
  const [userDetails, setUserDetails] = useState({})
  const [modal, setModal] = useState({ open: false, action: 'resolve', reportId: null })
  const [acting, setActing] = useState(false)

  const buildParams = useCallback((filters, pageIndex) => {
    const params = { pageIndex, pageSize: PAGE_SIZE }
    const { keyword, status, fromDate, toDate } = filters
    if (keyword) params.keyword = keyword
    if (status) params.status = status
    if (fromDate) params.fromDate = new Date(fromDate).toISOString()
    if (toDate) params.toDate = new Date(toDate).toISOString()
    return params
  }, [])

  const {
    data: reports,
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
  } = useServerPagination({
    fetchFn: getReports,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  // Resolve user details for the "Reported By" column
  useEffect(() => {
    if (reports.length === 0) return
    let cancelled = false
    async function resolve() {
      const details = { ...userDetails }
      const promises = []
      for (const item of reports) {
        if (item.userId && !details[item.userId]) {
          promises.push(
            getUserDetail(item.userId)
              .then((u) => { details[item.userId] = u })
              .catch(() => { details[item.userId] = null }),
          )
        }
      }
      if (promises.length > 0) {
        await Promise.all(promises)
        if (!cancelled) setUserDetails({ ...details })
      }
    }
    resolve()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports])

  const columns = useMemo(() => reportsColumns(userDetails, {
    onResolve: (reportId) => setModal({ open: true, action: 'resolve', reportId }),
    onReject: (reportId) => setModal({ open: true, action: 'reject', reportId }),
  }), [userDetails])

  const handleModalSubmit = useCallback(async (reasonHtml) => {
    const reportId = modal.reportId
    const newStatus = modal.action === 'resolve' ? 'Resolved' : 'Reject'
    setModal({ open: false, action: 'resolve', reportId: null })
    setActing(true)
    try {
      await updateReportStatus(reportId, newStatus, reasonHtml)
      toast.success(`Report has been ${newStatus.toLowerCase()}.`)
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${newStatus.toLowerCase()} report.`)
    } finally {
      setActing(false)
    }
  }, [modal.reportId, modal.action, refetch])

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
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
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

      <ResolveModal
        action={modal.action}
        open={modal.open}
        onClose={() => setModal({ open: false, action: 'resolve', reportId: null })}
        onSubmit={handleModalSubmit}
        submitting={acting}
      />
    </div>
  )
}
