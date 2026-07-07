export default function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}