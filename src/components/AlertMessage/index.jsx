/**
 * Inline alert message for success/error/warning.
 * @param {string} type     - "success" | "error" | "warning"
 * @param {string} children - message text
 * @param {string} icon     - optional lucide icon component name
 */
export default function AlertMessage({ type = 'success', children, icon: Icon }) {
  if (!children) return null

  const styles = {
    success: 'border-[#e8f5e9] bg-[#e8f5e9] text-[#2e7d32]',
    error:   'border-[#fce4ec] bg-[#fce4ec] text-[#c62828]',
    warning: 'border-[#fff3e0] bg-[#fff8e1] text-[#e65100]',
  }

  return (
    <div className={`mt-4 rounded-lg border px-4 py-3 text-[14px] font-medium ${styles[type] || styles.success}`}>
      {Icon ? (
        <div className="flex items-start gap-2">
          <Icon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </div>
  )
}