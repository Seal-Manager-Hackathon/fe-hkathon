import { useEffect, useRef } from 'react'

export default function FormField({ label, required, error, icon: Icon, children }) {
  const containerRef = useRef(null)

  // Auto-focus first error field
  useEffect(() => {
    if (error && containerRef.current) {
      const el = containerRef.current.querySelector('input, textarea, select')
      if (el) el.focus()
    }
  }, [error])

  return (
    <div ref={containerRef}>
      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#1f2f3a]">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}