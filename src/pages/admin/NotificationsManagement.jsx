import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BellPlus } from 'lucide-react'
import { getNotifications, getUserDetail, getTeamDetail } from '../../api/admin'
import BaseTable from '../../components/BaseTable'
import FilterBar from '../../components/FilterBar'
import { notificationsFilters } from './NotificationsFilters'
import { notificationsColumns } from './NotificationsColumns'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  title: '',
  targetType: '',
  fromDate: '',
  toDate: '',
}

export default function NotificationsManagement() {
  const [filters, setFilters] = useState(DEFAULT_VALUES)
  const [pageIndex, setPageIndex] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [targetDetails, setTargetDetails] = useState({})

  const hasActive = Object.entries(filters).some(([, v]) => v !== '')

  const buildParams = useCallback(() => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { title, targetType, fromDate, toDate } = filters
    if (title) params.Title = title
    if (targetType) params.TargetType = targetType
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [filters, pageIndex])

  const resolveTargets = useCallback(async (list) => {
    const details = { ...targetDetails }
    const promises = []

    for (const item of list) {
      if (item.targetType === 'Personal' && item.userId && !details[item.userId]) {
        promises.push(
          getUserDetail(item.userId)
            .then((user) => { details[item.userId] = user })
            .catch(() => { details[item.userId] = null }),
        )
      }
      if (item.targetType === 'Team' && item.teamId && !details[`team:${item.teamId}`]) {
        promises.push(
          getTeamDetail(item.teamId)
            .then((team) => { details[`team:${item.teamId}`] = team })
            .catch(() => { details[`team:${item.teamId}`] = null }),
        )
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises)
      setTargetDetails({ ...details })
    }
  }, [targetDetails])

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getNotifications(buildParams())
      const list = result.notifications || []
      setNotifications(list)
      setTotalCount(result.totalCount || 0)
      await resolveTargets(list)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load notifications.'
      if (err?.response?.status === 400 && msg.includes('TargetType')) {
        setError('Loại thông báo không hợp lệ')
      } else {
        setError(msg)
      }
      setNotifications([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [buildParams, resolveTargets])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPageIndex(1)
    setTargetDetails({})
  }

  function handleReset() {
    setFilters(DEFAULT_VALUES)
    setPageIndex(1)
    setTargetDetails({})
  }

  const columns = useMemo(() => notificationsColumns(targetDetails), [targetDetails])

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Notifications</h1>
          <p className="mt-1 text-[14px] sm:text-[15px] text-gray-500">
            Manage all {totalCount} notifications.
          </p>
        </div>
        <Link
          to="/admin/notifications/create"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <BellPlus className="h-4 w-4" />Create Notification
        </Link>
      </div>

      <FilterBar
        filters={notificationsFilters}
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
        data={notifications}
        page={pageIndex}
        pageSize={PAGE_SIZE}
        total={totalCount}
        onPageChange={setPageIndex}
        loading={loading}
        serverSide
        emptyText={hasActive ? 'No notifications match the current filters.' : 'No notifications in the system yet.'}
        keyExtractor={(row) => row.id}
        minWidth="700px"
      />
    </div>
  )
}
