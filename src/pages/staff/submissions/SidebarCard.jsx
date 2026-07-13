import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function SidebarCard({ icon: Icon, title, viewTo, children }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2"><Icon className="h-4 w-4 text-[#80deea]" />{title}</h4>
        {viewTo && (
          <Link to={viewTo} className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-medium text-white/80 hover:text-white hover:underline">
            View <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="divide-y divide-[#f5f5f5]">{children}</div>
    </div>
  )
}
