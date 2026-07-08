import { RotateCcw } from 'lucide-react'
import SearchInput from '../SearchInput'
import SelectInput from '../SelectInput'
import DateInput from '../DateInput'

/**
 * Shared filter bar for admin list pages. Accepts filters prop to describe
 * which controls to render.
 *
 * @param {Object[]} filters - [{ type: 'search'|'select'|'date', key, label, placeholder, options, className }]
 * @param {Object}   values  - current filter values keyed by filter.key
 * @param {function} onChange - (key, value) => void
 * @param {function} onReset  - resets all filters
 * @param {boolean}  hasActive - whether any filter is active (controls Reset disabled state)
 */
export default function FilterBar({ filters = [], values = {}, onChange, onReset, hasActive = false, children }) {
  return (
    <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      {filters.map((f) => {
        if (f.type === 'search') {
          return (
            <SearchInput
              key={f.key}
              label={f.label}
              icon={f.icon}
              className={f.className || 'w-full sm:w-[260px]'}
              placeholder={f.placeholder}
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              type={f.inputType || 'text'}
            />
          )
        }
        if (f.type === 'select') {
          return (
            <SelectInput
              key={f.key}
              label={f.label}
              icon={f.icon}
              options={f.options}
              value={values[f.key] || ''}
              onChange={(v) => onChange(f.key, v)}
              className={f.className || 'w-full sm:w-[160px]'}
            />
          )
        }
        if (f.type === 'date') {
          return (
            <DateInput
              key={f.key}
              label={f.label}
              icon={f.icon}
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              className={f.className || 'w-full sm:w-[180px]'}
            />
          )
        }
        return null
      })}
      {children}
      <button
        onClick={onReset}
        disabled={!hasActive}
        className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-4 py-2.5 text-[14px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </button>
    </div>
  )
}
