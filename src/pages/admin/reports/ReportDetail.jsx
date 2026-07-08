import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, Flag, FileText, AlertCircle, Link2, ArrowLeft } from 'lucide-react'
import { getReportDetail, getUserDetail } from '../../../api/admin'
import Badge from '../../../components/Badge'
import CardPanel from '../../../components/CardPanel'
import InfoRow from '../../../components/InfoRow'
import NotificationTarget from '../../../components/NotificationTarget'
import { reportStatusBadge, reportTypeBadge } from '../../../constants/adminOptions'
import { formatDateTime } from '../../../utils/format'

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [userDetails, setUserDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getReportDetail(id)
        if (!cancelled) setReport(data)

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

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 space-y-2">
          <div className="h-7 w-96 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-60 animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-5 h-40 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error || !report) {
    const isNotFound = error && (error.includes('Not Found') || error === 'Resource Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Report not found' : error || 'Report not found.'}
        </p>
        <Link to="/admin/reports" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          &larr; Back to Reports
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/admin/reports"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />Back to Reports
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{report.title}</h1>
          <Badge label={report.typeReport} className={reportTypeBadge[report.typeReport] || 'bg-[#f5f5f5] text-[#757575]'} />
          <Badge label={report.status} className={reportStatusBadge[report.status] || ''} />
        </div>
      </div>

      <CardPanel title="Details">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="Reported By" icon={User}>
            <NotificationTarget targetType="Personal" userId={report.userId} details={userDetails} />
          </InfoRow>
          <InfoRow label="Type" icon={FileText}>
            <Badge label={report.typeReport} className={reportTypeBadge[report.typeReport] || 'bg-[#f5f5f5] text-[#757575]'} />
          </InfoRow>
          <InfoRow label="Status" icon={Flag}>
            <Badge label={report.status} className={reportStatusBadge[report.status] || ''} />
          </InfoRow>
          {report.reason && (
            <InfoRow label="Reason" icon={AlertCircle}>
              <p className="text-[14px] text-[#1f2f3a] whitespace-pre-wrap">{report.reason}</p>
            </InfoRow>
          )}
          <InfoRow label="Created At" icon={Calendar}>
            <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(report.createdAt)}</p>
          </InfoRow>
          <InfoRow label="Updated At" icon={Clock}>
            <p className="text-[14px] text-[#1f2f3a]">{report.updatedAt ? formatDateTime(report.updatedAt) : '—'}</p>
          </InfoRow>
        </div>
      </CardPanel>

      {report.description && (
        <div className="mt-5">
          <CardPanel title="Description">
            <div className="px-5 py-5">
              <p className="text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">{report.description}</p>
            </div>
          </CardPanel>
        </div>
      )}
    </div>
  )
}