import { useParams, Link } from 'react-router-dom'
import { Edit, Calendar } from 'lucide-react'
import Badge from '../../components/Badge'
import CardPanel from '../../components/CardPanel'
import InfoRow from '../../components/InfoRow'
import { formatDate } from '../../utils/format'

export default function TeamDetail() {
  const { id } = useParams()

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to="/admin/teams"
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Teams
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Team Detail</h1>
          <p className="mt-2 text-[14px] text-gray-400">ID: {id}</p>
        </div>
        <Link
          to={`/admin/teams/${id}/edit`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px] shrink-0 self-start sm:self-auto"
        >
          <Edit className="h-4 w-4" />
          Edit Team
        </Link>
      </div>

      <CardPanel title="Details">
        <div className="divide-y divide-[#f5f5f5]">
          <InfoRow label="ID"><p className="text-[14px] text-[#1f2f3a]">{id}</p></InfoRow>
        </div>
      </CardPanel>
    </div>
  )
}
