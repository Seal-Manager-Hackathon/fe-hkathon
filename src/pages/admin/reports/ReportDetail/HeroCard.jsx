import { cn } from '../../../../utils/cn'
import { Calendar, Clock } from 'lucide-react'
import Badge from '../../../../components/Badge'
import { reportTypeBadge } from '../../../../constants/adminOptions'
import { formatDate } from '../../../../utils/format'
import StatusStepper from './StatusStepper'
import ActionButtons, { ActionError } from './ActionButtons'

export default function HeroCard({
  report, meta, isPending, acting, onResolve, onReject, actionError,
}) {
  return (
    <div
      className={cn(
        'relative mb-6 overflow-hidden rounded-2xl border shadow-md',
        meta.heroBg,
        meta.heroBorder,
      )}
    >
      {/* accent stripe at top */}
      <div className={cn('h-1.5 w-full', meta.heroAccent)} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {/* Status pill with icon */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold shadow-sm',
                  meta.badge,
                )}
              >
                <span className={cn('h-2 w-2 rounded-full ring-2 ring-white', meta.dot)} />
                {report.status === 'Reject' ? 'Rejected' : report.status}
              </span>
              {/* Type badge */}
              <Badge
                label={report.typeReport}
                className={cn(
                  reportTypeBadge[report.typeReport] || 'bg-slate-100 text-slate-600',
                )}
              />
            </div>

            <h1 className="text-[22px] font-bold leading-tight text-slate-800 break-words sm:text-[26px]">
              {report.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                Reported {formatDate(report.createdAt)}
              </span>
              {report.updatedAt && report.updatedAt !== report.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  Updated {formatDate(report.updatedAt)}
                </span>
              )}
            </div>
          </div>

          {isPending && (
            <ActionButtons acting={acting} onResolve={onResolve} onReject={onReject} />
          )}
        </div>

        <ActionError message={actionError} />

        <div className="mt-5 border-t border-slate-100/70 pt-4">
          <StatusStepper status={report.status} />
        </div>
      </div>
    </div>
  )
}
