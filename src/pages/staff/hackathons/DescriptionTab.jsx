import { FileText, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import RichTextViewer from '../../../components/RichTextViewer'

export default function DescriptionTab({ eventId, description }) {
  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Description
        </h3>
        <Link
          to={`/staff/hackathons/${eventId}/edit`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/30"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Link>
      </div>
      <div className="px-5 py-5">
        <RichTextViewer content={description} />
      </div>
    </div>
  )
}