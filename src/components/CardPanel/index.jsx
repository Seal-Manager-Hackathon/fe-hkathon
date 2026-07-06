import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function CardPanel({ title, viewAllTo, children }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">{title}</h3>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium text-[#064f5d] hover:underline"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}
