/**
 * Reusable text input with optional left icon and error message.
 * @param {string} label
 * @param {string} value
 * @param {function} onChange
 * @param {string} placeholder
 * @param {boolean} required
 * @param {string} error
 * @param {string} type      - HTML input type (text, email, number, etc.)
 * @param {object} icon      - lucide icon component
 * @param {string} className - extra classes on input
 */
export default function TextInput({ label, value, onChange, placeholder, required, error, type = 'text', icon: Icon, className }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`field-input ${Icon ? 'input-icon' : ''} ${error ? 'input-error' : ''} ${className || ''}`}
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}