import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Check, Loader, User } from 'lucide-react'
import BaseTable from '../BaseTable'

/**
 * Searchable select that fetches options from an async function with keyword search.
 * Opens as a modal overlay.
 *
 * @param {string}   label
 * @param {string}   placeholder
 * @param {string}   [emptyText]
 * @param {function} fetchFn  - (keyword: string) => Promise<Array> | (keyword, pageIndex, pageSize) => Promise<{ data: Array, totalCount: number }>
 * @param {string}   [value]
 * @param {function} onChange
 * @param {string}   [className]
 * @param {boolean}  [disabled]
 * @param {number}   [pageSize]  - If provided, enables server-side pagination with BaseTable
 */
export default function SearchableSelect({
  label,
  placeholder = 'Search...',
  emptyText = 'No results found.',
  fetchFn,
  value,
  onChange,
  className = '',
  disabled = false,
  pageSize,
}) {
  const [keyword, setKeyword] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  const isPaginated = !!pageSize

  const selected = options.find((o) => o.value === value)

  // Core fetch logic
  const doFetch = useCallback(async (kw, pi) => {
    setLoading(true)
    try {
      if (isPaginated) {
        const result = await fetchFn(kw, pi, pageSize)
        setOptions(result.data || [])
        setTotalCount(result.totalCount || 0)
      } else {
        const results = await fetchFn(kw)
        setOptions(results || [])
      }
    } catch {
      setOptions([])
      if (isPaginated) setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, isPaginated, pageSize])

  // Keyword change -> debounce, reset to page 1
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPageIndex(1)
      doFetch(keyword, 1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [keyword, doFetch])

  // Page change (skip initial render)
  useEffect(() => {
    if (pageIndex > 1) {
      doFetch(keyword, pageIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex])

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  function handleOpen() {
    if (!disabled) {
      setOpen(true)
      setKeyword('')
      setPageIndex(1)
    }
  }

  function handleClose() {
    setOpen(false)
  }

  function handleSelect(opt) {
    onChange(opt.value)
    setOpen(false)
    setKeyword('')
  }

  // Columns for paginated mode
  const tableColumns = [
    {
      key: 'name',
      header: 'Name',
      headerIcon: User,
      render: (row) => {
        const isSelected = row.value === value
        return (
          <button
            type="button"
            onClick={() => handleSelect(row)}
            className="flex w-full cursor-pointer items-center gap-3 py-0.5 text-left"
          >
            {row.avatar ? (
              <img src={row.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1565c0] text-[12px] font-bold text-white">
                {row.avatarLetter || row.label.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className={'truncate text-[14px] font-medium ' + (isSelected ? 'text-[#064f5d]' : 'text-[#1f2f3a]')}>
                {row.label}
                {isSelected && <Check className="ml-2 inline h-4 w-4 shrink-0 text-[#064f5d]" />}
              </p>
              {row.sub && <p className="truncate text-[12px] text-gray-400">{row.sub}</p>}
            </div>
          </button>
        )
      },
    },
  ]

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] outline-none transition-colors hover:border-[#064f5d] focus:border-[#064f5d] ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${value ? 'text-[#1f2f3a]' : 'text-gray-400'}`}
      >
        <span className="truncate">
          {selected ? (
            <span className="inline-flex items-center gap-2">
              {selected.avatar ? (
                <img src={selected.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
              ) : selected.avatarLetter ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1565c0] text-[11px] font-bold text-white">
                  {selected.avatarLetter}
                </span>
              ) : null}
              {selected.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          <div className="absolute inset-0 bg-black/30" onClick={handleClose} />
          <div className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-xl border border-[#e8ecf0] bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center border-b border-[#f0f0f0] px-4 py-3">
              <Search className="mr-3 h-4 w-4 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-[14px] text-[#1f2f3a] placeholder-gray-400 outline-none"
              />
              <button onClick={handleClose} className="ml-2 cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            {isPaginated ? (
              <div className="max-h-[60vh] overflow-y-auto">
                <BaseTable
                  columns={tableColumns}
                  data={options}
                  page={pageIndex}
                  pageSize={pageSize}
                  total={totalCount}
                  onPageChange={(p) => setPageIndex(p)}
                  loading={loading}
                  emptyText={emptyText}
                  keyExtractor={(row) => row.value}
                  serverSide
                  borderless
                  minWidth="auto"
                />
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : options.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[14px] text-gray-400">{emptyText}</p>
                  </div>
                ) : (
                  options.map((opt) => {
                    const isSelected = opt.value === value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f4f6f8] ${
                          isSelected ? 'bg-[#e0f2f1]' : ''
                        }`}
                      >
                        {opt.avatar ? (
                          <img src={opt.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1565c0] text-[13px] font-bold text-white">
                            {opt.avatarLetter || opt.label.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-[14px] font-medium ${isSelected ? 'text-[#064f5d]' : 'text-[#1f2f3a]'}`}>
                            {opt.label}
                          </p>
                          {opt.sub && <p className="truncate text-[12px] text-gray-400">{opt.sub}</p>}
                        </div>
                        {isSelected && <Check className="h-4 w-4 shrink-0 text-[#064f5d]" />}
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {/* Footer (only non-paginated) */}
            {!isPaginated && (
              <div className="border-t border-[#f0f0f0] px-4 py-3">
                <p className="text-[12px] text-gray-400">
                  {options.length > 0 ? `${options.length} result${options.length !== 1 ? 's' : ''}` : 'Type to search'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
