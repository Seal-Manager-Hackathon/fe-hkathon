export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e8ecf0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-gray-400">{label}</p>
        <p className="text-[26px] font-extrabold leading-tight text-[#1f2f3a]">{value}</p>
      </div>
    </div>
  )
}
