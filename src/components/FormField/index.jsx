export default function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}