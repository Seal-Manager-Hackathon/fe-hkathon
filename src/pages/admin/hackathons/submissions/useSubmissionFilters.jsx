import { useState, useCallback, useMemo } from 'react'
import { Search, Layers, FolderKanban, FileText, User, ChevronDown } from 'lucide-react'

export const PAGE_SIZE = 10
export const INITIAL_FILTERS = { keyword: '', roundId: '', trackId: '', topicId: '', registerTeamId: '' }

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

export function useSubmissionFilters(tracks, topics) {
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS })

  // ── Display names ──
  const [roundName, setRoundName] = useState('')
  const [trackName, setTrackName] = useState('')
  const [topicName, setTopicName] = useState('')
  const [regTeamName, setRegTeamName] = useState('')

  // ── Modal open states ──
  const [roundModalOpen, setRoundModalOpen] = useState(false)
  const [trackModalOpen, setTrackModalOpen] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)
  const [regTeamModalOpen, setRegTeamModalOpen] = useState(false)

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
    setRoundName(''); setTrackName(''); setTopicName(''); setRegTeamName('')
  }, [])

  // ── Select handlers for each modal ──
  const handleSelect = useCallback((filterKey, nameSetter) => (id, name) => {
    setFilters((prev) => ({ ...prev, [filterKey]: id }))
    nameSetter(name)
  }, [])

  const filterConfigs = useMemo(
    () => [
      { type: 'search', key: 'keyword', label: 'Search', icon: Search, placeholder: 'Search team name...' },
      {
        type: 'custom',
        key: 'roundPicker',
        render: () => (
          <FilterPickButton
            key="round"
            icon={Layers} label="Round" allLabel="All Rounds"
            name={filters.roundId ? roundName : ''}
            onClick={() => setRoundModalOpen(true)}
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
            onClick={() => setTrackModalOpen(true)}
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
            onClick={() => setTopicModalOpen(true)}
          />
        ),
      },
      {
        type: 'custom',
        key: 'regTeamPicker',
        render: () => (
          <FilterPickButton
            key="regteam"
            icon={User} label="Register Team" allLabel="All Teams"
            name={filters.registerTeamId ? regTeamName : ''}
            onClick={() => setRegTeamModalOpen(true)}
          />
        ),
      },
    ],
    [filters.roundId, roundName, filters.trackId, trackName, filters.topicId, topicName, filters.registerTeamId, regTeamName],
  )

  return {
    filters, setFilter, resetFilters, active,
    // Names
    roundName, setRoundName, trackName, setTrackName, topicName, setTopicName, regTeamName, setRegTeamName,
    // Modal states
    roundModalOpen, setRoundModalOpen,
    trackModalOpen, setTrackModalOpen,
    topicModalOpen, setTopicModalOpen,
    regTeamModalOpen, setRegTeamModalOpen,
    // Handlers
    handleSelect,
    // Configs
    filterConfigs,
  }
}
