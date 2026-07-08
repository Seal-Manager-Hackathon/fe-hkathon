import SearchInput from '../SearchInput'
import SelectInput from '../SelectInput'
import { FILTER_DEFS } from './helpers'

function RotateCcwIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 4v6h6M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
  )
}

export default function ModalFilterBar({ values, onChange, onReset }) {
  return (
    <div className="shrink-0 border-b border-[#f0f0f0] bg-[#fafbfc] px-6 py-3.5">
      <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        {FILTER_DEFS.map((f) => {
          if (f.type === 'search') {
            return (
              <SearchInput
                key={f.key}
                label={f.label}
                icon={f.icon}
                className="w-full sm:w-[220px]"
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
                className="w-full sm:w-[140px]"
              />
            )
          }
          return null
        })}
        <button type="button" onClick={onReset}
          className="mb-[1px] inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d8e0e6] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#5c6b7a] transition-colors hover:bg-gray-50 hover:text-[#1f2f3a]"
        >
          <RotateCcwIcon />
          Reset
        </button>
      </div>
    </div>
  )
}
