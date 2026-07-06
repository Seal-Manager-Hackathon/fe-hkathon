import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Password input with show/hide toggle.
 * @param {string} label
 * @param {string} value
 * @param {function} onChange
 * @param {string} placeholder
 * @param {boolean} required
 */
export default function PasswordInput({ label, value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#1f2f3a]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="field-input pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}