import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

/**
 * Password input with show/hide toggle and optional left icon.
 * @param {string} label
 * @param {string} value
 * @param {function} onChange
 * @param {string} placeholder
 * @param {boolean} required
 * @param {string} error
 * @param {object} icon - lucide icon component for left side (default: Lock)
 */
export default function PasswordInput({ label, value, onChange, placeholder, required, error, icon: Icon = Lock }) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-gray-400" />}
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`input-icon input-icon-pr ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  )
}
