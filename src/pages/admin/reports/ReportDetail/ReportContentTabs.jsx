import { cn } from '../../../../utils/cn'
import { MessageSquare, AlertCircle } from 'lucide-react'

export default function ReportContentTabs({ description, reason, activeTab, onTabChange }) {
  const hasContent = description || reason

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
          <MessageSquare className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-[15px] font-semibold text-slate-500">No additional details</h3>
        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-400">
          This report does not include a reason or description. Only the title and metadata are available.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex bg-gradient-to-r from-slate-50 to-white">
        <TabButton
          active={activeTab === 'description'}
          onClick={() => onTabChange('description')}
          icon={MessageSquare}
          label="Description"
          activeColor="bg-gradient-to-r from-blue-50 to-white"
          activeBar="bg-blue-500"
          activeText="text-blue-700"
          iconActive="text-blue-500"
          iconInactive="text-slate-400"
        />
        <TabButton
          active={activeTab === 'reason'}
          onClick={() => onTabChange('reason')}
          icon={AlertCircle}
          label="Reason"
          activeColor="bg-gradient-to-r from-amber-50 to-white"
          activeBar="bg-amber-500"
          activeText="text-amber-700"
          iconActive="text-amber-500"
          iconInactive="text-slate-400"
        />
      </div>

      {/* Description panel */}
      {activeTab === 'description' && (
        <TabPanel
          content={description}
          emptyIcon={MessageSquare}
          emptyTitle="No description provided"
          emptyDescription="The reporter did not include a detailed description."
          emptyColor="text-blue-200"
        />
      )}

      {/* Reason panel */}
      {activeTab === 'reason' && (
        <TabPanel
          content={reason}
          emptyIcon={AlertCircle}
          emptyTitle="No reason provided"
          emptyDescription="The reporter did not specify a reason for this report."
          emptyColor="text-amber-200"
        />
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label, activeColor, activeBar, activeText, iconActive, iconInactive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex-1 cursor-pointer px-5 py-3.5 text-[13px] font-semibold transition-all duration-200',
        active ? activeColor + ' ' + activeText : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50',
      )}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className={cn('h-4 w-4 transition-colors duration-200', active ? iconActive : iconInactive)} />
        {label}
      </span>
      {active && (
        <span className={cn('absolute bottom-0 left-4 right-4 h-0.5 rounded-full', activeBar)} />
      )}
    </button>
  )
}

function TabPanel({ content, emptyIcon: EmptyIcon, emptyTitle, emptyDescription, emptyColor }) {
  return (
    <div className="px-5 py-5">
      {content ? (
        <p className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap">
          {content}
        </p>
      ) : (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
            <EmptyIcon className={cn('h-6 w-6', emptyColor)} />
          </div>
          <p className="text-[13px] font-medium text-slate-400">{emptyTitle}</p>
          <p className="mt-0.5 text-[12px] text-slate-300">{emptyDescription}</p>
        </div>
      )}
    </div>
  )
}
