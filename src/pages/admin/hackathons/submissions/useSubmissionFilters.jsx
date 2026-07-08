import { useState, useCallback, useMemo } from 'react'
import { Search, Layers, FolderKanban, FileText, User, ChevronDown } from 'lucide-react'

export const PAGE_SIZE = 10
export const INITIAL_FILTERS = { keyword: '', roundId: '', trackId: '', topicId: '', registerTeamId: '' }

const hasActiveFilters = (f) => Object.values(f).some((v) => v !== '')

export function useSubmissionFilters(tracks, topics) {
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS })
  const [roundName, setRoundName] = useState('')
  const [roundModalOpen, setRoundModalOpen] = useState(false)

  const active = hasActiveFilters(filters)

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'trackId') next.topicId = ''
      return next
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS })
    setRoundName('')
  }, [])

  const handleRoundSelect = useCallback((roundId, name) => {
    setFilters((prev) => ({ ...prev, roundId }))
    setRoundName(name)
  }, [])

  const filterConfigs = useMemo(
    () => [
      { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search team name...' },
      {
        type: 'custom',
        key: 'roundPicker',
        render: () => (
          <div className="relative w-full sm:w-[200px]" key="roundPicker">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              <Layers className="h-3 w-3" /> Round
            </label>
            <button
              type="button"
              onClick={() => setRoundModalOpen(true)}
              className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
            >
              <span className={filters.roundId && roundName ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
                {filters.roundId && roundName ? roundName : 'All Rounds'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
            </button>
          </div>
        ),
      },
      { type: 'select', key: 'trackId', label: 'Track', icon: FolderKanban,
        options: [{ value: '', label: 'All' }, ...tracks.map((t) => ({ value: t.id, label: t.title }))] },
      { type: 'select', key: 'topicId', label: 'Topic', icon: FileText,
        options: [{ value: '', label: 'All' }, ...topics.map((t) => ({ value: t.id, label: t.title }))] },
      { type: 'search', key: 'registerTeamId', label: 'Register Team', icon: User, placeholder: 'Search register team...' },
    ],
    [tracks, topics, filters.roundId, roundName, setRoundModalOpen],
  )

  return { filters, setFilter, resetFilters, active, roundName, setRoundName, handleRoundSelect, filterConfigs, roundModalOpen, setRoundModalOpen }
}
