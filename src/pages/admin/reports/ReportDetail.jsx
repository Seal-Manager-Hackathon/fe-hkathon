import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getReportDetail, getUserDetail, updateReportStatus } from '../../../api/admin'
import { toast } from '../../../utils/toast'
import { STATUS_META } from './ReportDetail/statusMeta'
import HeroCard from './ReportDetail/HeroCard'
import LoadingSkeleton, { ErrorState } from './ReportDetail/LoadingSkeleton'
import ReportContentTabs from './ReportDetail/ReportContentTabs'
import ReportDetailSidebar from './ReportDetail/ReportDetailSidebar'
import ResolveModal from './ReportDetail/ResolveModal'

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [userDetails, setUserDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [acting, setActing] = useState(false)
  const [actionError, setActionError] = useState('')
  const [modal, setModal] = useState({ open: false, action: 'resolve' })

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getReportDetail(id)
        if (!cancelled) {
          setReport(data)
          if (data?.description) setActiveTab('description')
          else if (data?.reason) setActiveTab('reason')
        }
        if (data?.userId) {
          const details = {}
          try {
            const user = await getUserDetail(data.userId)
            details[data.userId] = user
          } catch (_) {
            details[data.userId] = null
          }
          if (!cancelled) setUserDetails(details)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load report detail.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleModalSubmit = useCallback(async (reasonHtml) => {
    const newStatus = modal.action === 'resolve' ? 'Resolved' : 'Rejected'
    setModal({ open: false, action: 'resolve' })
    setActing(true)
    setActionError('')
    try {
      await updateReportStatus(id, newStatus, reasonHtml)
      setReport((prev) => (prev ? { ...prev, status: newStatus, reason: reasonHtml, updatedAt: new Date().toISOString() } : prev))
      toast.success(`Report has been ${newStatus.toLowerCase()}.`)
    } catch (err) {
      setActionError(err?.response?.data?.message || `Failed to ${newStatus.toLowerCase()} report.`)
    } finally {
      setActing(false)
    }
  }, [id, modal.action])

  if (loading) return <LoadingSkeleton />
  if (error || !report) return <ErrorState isNotFound={error?.includes('Not Found') || error === 'Resource Not Found'} message={error} />

  const meta = STATUS_META[report.status] || STATUS_META.Pending
  const isPending = report.status === 'Pending'

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <nav className="mb-5">
        <Link
          to="/admin/reports"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
      </nav>

      <HeroCard
        report={report}
        meta={meta}
        isPending={isPending}
        acting={acting}
        onResolve={() => setModal({ open: true, action: 'resolve' })}
        onReject={() => setModal({ open: true, action: 'reject' })}
        actionError={actionError}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportContentTabs
            description={report.description}
            reason={report.reason}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
        <ReportDetailSidebar
          report={report}
          userDetails={userDetails}
          statusIcon={meta.icon}
        />
      </div>

      <ResolveModal
        action={modal.action}
        open={modal.open}
        onClose={() => setModal({ open: false, action: 'resolve' })}
        onSubmit={handleModalSubmit}
        submitting={acting}
      />
    </div>
  )
}
