import { Search, Hash, Ban } from 'lucide-react'

// ── Constants ──
export const PAGE_SIZE = 5

export const FILTER_DEFS = [
  { type: 'search', key: 'keyword', label: 'Round Name', icon: Search, placeholder: 'Search round name...' },
  { type: 'search', key: 'roundNo', label: 'Round #', icon: Hash, inputType: 'number', placeholder: 'Enter round number' },
  { type: 'select', key: 'isDisable', label: 'Deleted', icon: Ban,
    options: [
      { value: '', label: 'All' },
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ],
  },
]

export const DEFAULT_FILTER_VALUES = Object.fromEntries(FILTER_DEFS.map((f) => [f.key, '']))

export function buildQuery(filters, page) {
  const q = { PageIndex: page, PageSize: PAGE_SIZE }
  if (filters.keyword)        q.Keyword = filters.keyword
  if (filters.roundNo !== '') q.RoundNo = Number(filters.roundNo)
  if (filters.isDisable !== '') q.IsDisable = filters.isDisable === 'true'
  return q
}

export function hasActiveFilters(filters) {
  return Object.entries(filters).some(([k, v]) => k === 'isDisable' ? v !== '' : v !== '')
}

// ── Helpers: row selection logic ──
export function isRowSelected(row, pendingId, currentId) {
  if (pendingId !== null) return pendingId === row.id
  return currentId === row.id
}

export function rowClass(row, pendingId, currentId) {
  return isRowSelected(row, pendingId, currentId)
    ? 'group bg-[#e8f4fd] cursor-pointer'
    : 'group cursor-pointer hover:bg-[#f4f6f8]'
}
