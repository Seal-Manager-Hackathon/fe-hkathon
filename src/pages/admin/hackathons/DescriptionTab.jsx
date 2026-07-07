import { FileText, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DescriptionTab({ eventId, description }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Description
        </h3>
        <Link
          to={`/admin/hackathons/${eventId}/edit`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/30"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>
      <div className="px-5 py-5">
        {description ? (
          <div className="prose prose-sm max-w-none text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">{description}</div>
        ) : (
          <p className="text-[14px] text-gray-400">No description provided.</p>
        )}
      </div>
    </div>
  )
}