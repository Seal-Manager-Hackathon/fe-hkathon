export default function TabBtn({ active, icon: Icon, label, color, onClick }) {
  const c = {
    blue:   { bg: 'from-blue-50 to-white', text: 'text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-500' },
    amber:  { bg: 'from-amber-50 to-white', text: 'text-amber-700', bar: 'bg-amber-500', icon: 'text-amber-500' },
    green:  { bg: 'from-emerald-50 to-white', text: 'text-emerald-700', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
    purple: { bg: 'from-purple-50 to-white', text: 'text-purple-700', bar: 'bg-purple-500', icon: 'text-purple-500' },
  }[color] || { bg: 'from-blue-50 to-white', text: 'text-blue-700', bar: 'bg-blue-500', icon: 'text-blue-500' }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 cursor-pointer px-4 py-3.5 text-[13px] font-semibold transition-all duration-200 ${active ? `bg-gradient-to-r ${c.bg} ${c.text}` : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
      <span className="inline-flex items-center gap-2 whitespace-nowrap"><Icon className={`h-4 w-4 ${active ? c.icon : 'text-slate-400'}`} />{label}</span>
      {active && <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${c.bar}`} />}
    </button>
  )
}
