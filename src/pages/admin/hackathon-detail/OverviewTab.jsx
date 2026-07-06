import { Calendar, MapPin, DollarSign, Users, Eye, Layers } from 'lucide-react'
import Badge from '../../../components/Badge'
import { statusBadge, visibilityBadge } from '../../../data/mockAdminData'

export default function OverviewTab({ hackathon }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <h3 className="mb-5 flex items-center gap-2 text-[15px] font-bold text-[#1f2f3a]">
          <Layers className="h-4 w-4 text-[#064f5d]" />
          General Information
        </h3>
        <div className="space-y-0 divide-y divide-[#f5f5f5]">
          <InfoRow label="Season" value={hackathon.season} />
          <InfoRow label="Year" value={hackathon.year} />
          <InfoRow
            label="Prize Pool"
            value={hackathon.prize}
            valueClass="font-bold text-[#064f5d]"
            icon={<DollarSign className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Location"
            value={hackathon.location}
            icon={<MapPin className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Date"
            value={hackathon.date}
            icon={<Calendar className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Teams"
            value={hackathon.teams}
            icon={<Users className="h-3.5 w-3.5" />}
            valueClass="font-bold text-[#1f2f3a]"
          />
          <div className="flex items-center justify-between py-3">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-400">
              <Eye className="h-3.5 w-3.5" />
              Status
            </span>
            <Badge label={hackathon.status} className={statusBadge[hackathon.status]} />
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-400">
              <Eye className="h-3.5 w-3.5" />
              Visibility
            </span>
            <Badge label={hackathon.visibility} className={visibilityBadge[hackathon.visibility]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <h3 className="mb-5 flex items-center gap-2 text-[15px] font-bold text-[#1f2f3a]">
          <Calendar className="h-4 w-4 text-[#064f5d]" />
          Description
        </h3>
        <p className="text-[14px] leading-relaxed text-gray-500 whitespace-pre-wrap">{hackathon.description || 'No description provided.'}</p>

        <div className="mt-6 rounded-lg bg-[#f4f6f8] p-4">
          <h4 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-gray-400">Quick Stats</h4>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <StatBox icon={<Users className="h-4 w-4" />} label="Teams" value={hackathon.teams} />
            <StatBox icon={<Calendar className="h-4 w-4" />} label="Season" value={hackathon.season} />
            <StatBox icon={<DollarSign className="h-4 w-4" />} label="Prize" value={hackathon.prize} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, valueClass, icon }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-400">
        {icon}
        {label}
      </span>
      <span className={`text-[14px] font-semibold text-[#1f2f3a] ${valueClass || ''}`}>{value}</span>
    </div>
  )
}

function StatBox({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-2 shadow-sm sm:p-3">
      <span className="mb-1 text-[#064f5d]">{icon}</span>
      <span className="text-[15px] font-bold text-[#1f2f3a] sm:text-[18px]">{value}</span>
      <span className="text-[10px] text-gray-400 sm:text-[11px]">{label}</span>
    </div>
  )
}