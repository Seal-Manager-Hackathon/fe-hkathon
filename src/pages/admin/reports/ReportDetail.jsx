import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getReportDetail, getUserDetail } from '../../../api/admin'
import { confirm, promptReason, toast } from '../../../utils/toast'
import { STATUS_META } from './ReportDetail/statusMeta'
import HeroCard from './ReportDetail/HeroCard'
import LoadingSkeleton, { ErrorState } from './ReportDetail/LoadingSkeleton'
import ReportContentTabs from './ReportDetail/ReportContentTabs'
import ReportDetailSidebar from './ReportDetail/ReportDetailSidebar'

/* ================================================================== */
/*  ReportDetail                                                       */
/* ================================================================== */
export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [userDetails, setUserDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [acting, setActing] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getReportDetail(id)
        if (!cancelled) {
          setReport(data)
          if (data?.description) {
            setActiveTab('description')
          } else if (data?.reason) {
            setActiveTab('reason')
          }
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
          const msg = err?.response?.data?.message || 'Failed to load report detail.'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const handleResolve = useCallback(async () => {
    const ok = await confirm('Resolve Report', 'Are you sure you want to mark this report as resolved?')
    if (!ok) return
    setActing(true)
    setActionError('')
    try {
      // TODO: replace with real API call when available
      setReport((prev) => (prev ? { ...prev, status: 'Resolved', updatedAt: new Date().toISOString() } : prev))
      toast.success('Report has been resolved.')
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to resolve report.')
    } finally {
      setActing(false)
    }
  }, [id])

  const handleReject = useCallback(async () => {
    const reason = await promptReason(
      'Reject Report',
      'Please provide a reason for rejection:',
      'e.g. Insufficient evidence, duplicate report...',
      'Reject Report',
    )
    if (!reason) return
    setActing(true)
    setActionError('')
    try {
      // TODO: replace with real API call when available
      setReport((prev) => (prev ? { ...prev, status: 'Rejected', updatedAt: new Date().toISOString() } : prev))
      toast.success('Report has been rejected.')
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to reject report.')
    } finally {
      setActing(false)
    }
  }, [id])

  // ── render ──
  if (loading) return <LoadingSkeleton />
  if (error || !report) return <ErrorState isNotFound={error?.includes('Not Found') || error === 'Resource Not Found'} message={error} />

  const meta = STATUS_META[report.status] || STATUS_META.Pending
  const isPending = report.status === 'Pending'

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* ── Back link ── */}
      <nav className="mb-5">
        <Link
          to="/admin/reports"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
      </nav>

      {/* ── Hero card ── */}
      <HeroCard
        report={report}
        meta={meta}
        isPending={isPending}
        acting={acting}
        onResolve={handleResolve}
        onReject={handleReject}
        actionError={actionError}
      />

      {/* ── Two-column content ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: tabbed content */}
        <div className="lg:col-span-2">
          <ReportContentTabs
            description={report.description}
            reason={report.reason}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Right: sidebar */}
        <ReportDetailSidebar
          report={report}
          userDetails={userDetails}
          statusIcon={meta.icon}
        />
      </div>
    </div>
  )
}
