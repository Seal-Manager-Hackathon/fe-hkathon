import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  )
}

export default function BaseTable({
  columns = [],
  data = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  loading = false,
  emptyText = 'No data found.',
  keyExtractor,
  borderless = false,
  minWidth = '600px',
  serverSide = false,
  onRowClick,
  rowClassName,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  const rows = useMemo(() => {
    if (serverSide) return data
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize, serverSide])

  if (!loading && data.length === 0) {
    return (
      <div className={`max-w-full overflow-x-auto ${borderless ? '' : 'rounded-xl border border-[#e8ecf0] bg-white'}`}>
        <table className="w-full" style={{ minWidth }}>
          <thead>
            <tr className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d]">
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-white ${col.headerClassName || ''}`}>
                  <span className="inline-flex items-center gap-1.5">
                    {col.headerIcon && <col.headerIcon className="h-3.5 w-3.5" />}
                    {col.header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-5 py-20 text-center">
                <Inbox className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-[15px] font-medium text-gray-400">{emptyText}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`max-w-full overflow-x-auto ${borderless ? '' : 'rounded-xl border border-[#e8ecf0] bg-white'}`}>
      <table className="w-full" style={{ minWidth }}>
        {/* Header */}
        <thead>
          <tr className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-white ${col.headerClassName || ''}`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.headerIcon && <col.headerIcon className="h-3.5 w-3.5" />}
                  {col.header}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            : rows.map((row, rowIdx) => (
                <tr
                  key={keyExtractor ? keyExtractor(row, rowIdx) : row.id ?? rowIdx}
                  className={`border-b border-[#f5f5f5] transition-colors hover:bg-[#fafbfc] last:border-0 ${rowClassName ? rowClassName(row) : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col gap-2 border-t border-[#f0f0f0] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-gray-400 sm:text-[13px]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={isFirstPage}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d8e0e6] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-[13px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <span className="text-[13px] font-semibold text-[#1f2f3a] sm:text-[14px]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={isLastPage}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d8e0e6] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#1f2f3a] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-[13px]"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}