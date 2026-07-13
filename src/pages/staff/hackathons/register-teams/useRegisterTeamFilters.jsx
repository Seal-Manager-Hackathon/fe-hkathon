import { useState, useCallback, useMemo } from 'react'
import { Search, Ban, CircleCheck, Layers, FolderKanban, FileText, ChevronDown } from 'lucide-react'

export const PAGE_SIZE = 10
export const INITIAL_FILTERS = { keyword: '', status: '', isBanned: '', roundId: '', trackId: '', topicId: '' }

const hasActiveFilters = (f) => Object.values(f).some((v) => v !== '')

// ── Small picker button for each filter type ──
function FilterPickButton({ icon: Icon, label, name, allLabel, onClick }) {
  return (
    <div className="relative w-full sm:w-[200px]">
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-[#d8e0e6] bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] transition-all hover:border-[#064f5d] hover:shadow-sm focus:border-[#064f5d] outline-none"
      >
        <span className={name ? 'text-[#1f2f3a] font-medium' : 'text-gray-400'}>
          {name || allLabel}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-[#064f5d]" />
      </button>
    </div>
  )
}

export function useRegisterTeamFilters() {
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS })

  // ── Display names ──
  const [roundName, setRoundName] = useState('')
  const [trackName, setTrackName] = useState('')
  const [topicName, setTopicName] = useState('')

  // ── Modal open states ──
  const [filterRoundModalOpen, setFilterRoundModalOpen] = useState(false)
  const [filterTrackModalOpen, setFilterTrackModalOpen] = useState(false)
  const [filterTopicModalOpen, setFilterTopicModalOpen] = useState(false)

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
    setRoundName(''); setTrackName(''); setTopicName('')
  }, [])

  // ── Select handlers for each modal ──
  const handleFilterSelect = useCallback((filterKey, nameSetter) => (id, name) => {
    setFilters((prev) => ({ ...prev, [filterKey]: id }))
    nameSetter(name)
  }, [])

  const filterConfigs = useMemo(
    () => [
      { type: 'search', key: 'keyword', label: 'Team Name', icon: Search, placeholder: 'Search team name...' },
      { type: 'select', key: 'status', label: 'Status', icon: CircleCheck, options: [{ value: '', label: 'All' }, { value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }, { value: 'Rejected', label: 'Rejected' }] },
      { type: 'select', key: 'isBanned', label: 'Banned', icon: Ban, options: [{ value: '', label: 'All' }, { value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
      {
        type: 'custom',
        key: 'roundPicker',
        render: () => (
          <FilterPickButton
            key="round"
            icon={Layers} label="Round" allLabel="All Rounds"
            name={filters.roundId ? roundName : ''}
            onClick={() => setFilterRoundModalOpen(true)}
          />
        ),
      },
      {
        type: 'custom',
        key: 'trackPicker',
        render: () => (
          <FilterPickButton
            key="track"
            icon={FolderKanban} label="Track" allLabel="All Tracks"
            name={filters.trackId ? trackName : ''}
            onClick={() => setFilterTrackModalOpen(true)}
          />
        ),
      },
      {
        type: 'custom',
        key: 'topicPicker',
        render: () => (
          <FilterPickButton
            key="topic"
            icon={FileText} label="Topic" allLabel="All Topics"
            name={filters.topicId ? topicName : ''}
            onClick={() => setFilterTopicModalOpen(true)}
          />
        ),
      },
    ],
    [filters.roundId, roundName, filters.trackId, trackName, filters.topicId, topicName],
  )

  return {
    filters, setFilter, resetFilters, active,
    // Names
    roundName, setRoundName, trackName, setTrackName, topicName, setTopicName,
    // Modal states (prefixed to avoid collision with assignment modals)
    filterRoundModalOpen, setFilterRoundModalOpen,
    filterTrackModalOpen, setFilterTrackModalOpen,
    filterTopicModalOpen, setFilterTopicModalOpen,
    // Handlers
    handleFilterSelect,
    // Configs
    filterConfigs,
  }
}
