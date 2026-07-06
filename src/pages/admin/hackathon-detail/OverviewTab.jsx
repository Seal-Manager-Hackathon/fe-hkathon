export default function OverviewTab({ hackathon }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <h3 className="mb-4 text-[15px] font-bold text-[#1f2f3a]">General Information</h3>
        <div className="space-y-3">
          <InfoRow label="Season" value={hackathon.season} />
          <InfoRow label="Date" value={hackathon.date} />
          <InfoRow label="Year" value={hackathon.year} />
          <InfoRow label="Prize Pool" value={hackathon.prize} valueClass="font-bold text-[#064f5d]" />
          <InfoRow label="Location" value={hackathon.location} />
          <InfoRow label="Teams" value={hackathon.teams} />
          <InfoRow label="Status" value={hackathon.status} />
          <InfoRow label="Visibility" value={hackathon.visibility} />
        </div>
      </div>
      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <h3 className="mb-4 text-[15px] font-bold text-[#1f2f3a]">Description</h3>
        <p className="text-[14px] leading-relaxed text-gray-500">{hackathon.description}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f5f5f5] pb-3 last:border-0 last:pb-0">
      <span className="text-[13px] text-gray-400">{label}</span>
      <span className={`text-[14px] font-semibold text-[#1f2f3a] ${valueClass || ''}`}>{value}</span>
    </div>
  )
}