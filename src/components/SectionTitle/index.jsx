import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionTitle({ children, viewAllTo }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-400">
        {children}
      </h2>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#064f5d] hover:underline"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}
