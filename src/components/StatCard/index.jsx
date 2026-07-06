export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e8ecf0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-5">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} sm:h-11 sm:w-11`}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-gray-400 sm:text-[13px]">{label}</p>
        <p className="text-[20px] font-extrabold leading-tight text-[#1f2f3a] sm:text-[26px]">{value}</p>
      </div>
    </div>
  )
}
