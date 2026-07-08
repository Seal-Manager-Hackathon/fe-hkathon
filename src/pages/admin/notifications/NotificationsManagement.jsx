import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BellPlus } from 'lucide-react'
import { getNotifications, getUserDetail, getTeamDetail, deleteNotification, restoreNotification } from '../../../api/admin'
import BaseTable from '../../../components/BaseTable'
import FilterBar from '../../../components/FilterBar'
import { notificationsFilters } from './NotificationsFilters'
import { notificationsColumns } from './NotificationsColumns'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast, confirm } from '../../../utils/toast'

const PAGE_SIZE = 10

const DEFAULT_VALUES = {
  title: '',
  targetType: '',
  isDisable: '',
  fromDate: '',
  toDate: '',
}

export default function NotificationsManagement() {
  const [targetDetails, setTargetDetails] = useState({})

  const buildParams = useCallback((filters, pageIndex) => {
    const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
    const { title, targetType, isDisable, fromDate, toDate } = filters
    if (title) params.Title = title
    if (targetType) params.TargetType = targetType
    if (isDisable !== '') params.IsDisable = isDisable === 'true'
    if (fromDate) params.FromDate = new Date(fromDate).toISOString()
    if (toDate) params.ToDate = new Date(toDate).toISOString()
    return params
  }, [])

  const {
    data: notifications,
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
    fetchFn: getNotifications,
    defaultFilters: DEFAULT_VALUES,
    pageSize: PAGE_SIZE,
    buildParams,
  })

  // Resolve target names (User/Team) for display columns
  useEffect(() => {
    if (notifications.length === 0) return
    let cancelled = false
    async function resolve() {
      const details = { ...targetDetails }
      const promises = []
      for (const item of notifications) {
        if (item.targetType === 'Personal' && item.userId && !details[item.userId]) {
          promises.push(
            getUserDetail(item.userId)
              .then((u) => { details[item.userId] = u })
              .catch(() => { details[item.userId] = null }),
          )
        }
        if (item.targetType === 'Team' && item.teamId && !details[`team:${item.teamId}`]) {
          promises.push(
            getTeamDetail(item.teamId)
              .then((t) => { details[`team:${item.teamId}`] = t })
              .catch(() => { details[`team:${item.teamId}`] = null }),
          )
        }
      }
      if (promises.length > 0) {
        await Promise.all(promises)
        if (!cancelled) setTargetDetails({ ...details })
      }
    }
    resolve()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications])

  async function handleDelete(n) {
    const ok = await confirm('Delete Notification', `Are you sure you want to delete "${n.title}"?`)
    if (!ok) return
    try {
      await deleteNotification(n.id)
      toast.success('Notification disabled')
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete notification.')
    }
  }

  async function handleRestore(n) {
    const ok = await confirm('Restore Notification', `Are you sure you want to restore "${n.title}"?`)
    if (!ok) return
    try {
      await restoreNotification(n.id)
      toast.success('Notification restored')
      refetch()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to restore notification.')
    }
  }

  const columns = useMemo(
    () => notificationsColumns(targetDetails, handleDelete, handleRestore),
    [targetDetails],
  )

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Notifications</h1>
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
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
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
