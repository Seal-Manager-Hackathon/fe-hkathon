import { User, FileText, Calendar, Clock, Hash } from 'lucide-react'
import Badge from '../../../../components/Badge'
import StaffNotificationTarget from '../../../../components/StaffNotificationTarget'
import { reportStatusBadge, reportTypeBadge } from '../../../../constants/commonOptions'
import { formatDateTime } from '../../../../utils/format'

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4 group hover:bg-slate-50/50 transition-colors">
      <span className="shrink-0 flex items-center gap-2 w-[100px] text-[13px] font-semibold text-slate-500">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export default function ReportDetailSidebar({ report, userDetails, statusIcon: StatusIcon }) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
          <div className="border-b border-[#f0f0f0] bg-gradient-to-r from-slate-50 to-white px-5 py-4">
            <h3 className="text-[14px] font-bold text-slate-700">Report Information</h3>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            <InfoItem icon={User} label="Reported By">
              <StaffNotificationTarget targetType="Personal" userId={report.userId} details={userDetails} />
            </InfoItem>
            <InfoItem icon={FileText} label="Report Type">
              <Badge
                label={report.typeReport}
                className={reportTypeBadge[report.typeReport] || 'bg-slate-100 text-slate-600'}
              />
            </InfoItem>
            <InfoItem icon={StatusIcon} label="Status">
              <Badge label={report.status} className={reportStatusBadge[report.status] || ''} />
            </InfoItem>
            <InfoItem icon={Hash} label="Report ID">
              <p className="select-all font-mono text-[12px] text-slate-500">{report.id}</p>
            </InfoItem>
            <InfoItem icon={Calendar} label="Created">
              <p className="text-[13px] text-slate-600">{formatDateTime(report.createdAt)}</p>
            </InfoItem>
            <InfoItem icon={Clock} label="Last Updated">
              <p className="text-[13px] text-slate-600">
                {report.updatedAt ? formatDateTime(report.updatedAt) : '\u2014'}
              </p>
            </InfoItem>
          </div>
        </div>
      </div>
    </aside>
  )
}
