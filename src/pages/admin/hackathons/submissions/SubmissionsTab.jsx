import { useState, useEffect } from 'react'
import BaseTable from '../../../../components/BaseTable'
import FilterBar from '../../../../components/FilterBar'
import RoundSelectModal from '../../../../components/RoundSelectModal'
import TrackSelectModal from '../../../../components/TrackSelectModal'
import TopicSelectModal from '../../../../components/TopicSelectModal'
import RegisterTeamSelectModal from '../../../../components/RegisterTeamSelectModal'
import { getRounds, getTracks, getTopics, getEventRegisterTeams } from '../../../../api/admin'
import { useSubmissionColumns } from './SubmissionColumns'
import { useSubmissionFilters, PAGE_SIZE } from './useSubmissionFilters'
import { useSubmissions } from './useSubmissions'

export default function SubmissionsTab({ eventId }) {
  // ── Dropdown options (tracks/topics still needed for SubmissionColumns links) ──
  const [tracks, setTracks] = useState([])
  const [topics, setTopics] = useState([])
  const [loadingOpts, setLoadingOpts] = useState(false)

  // ── Filters ──
  const {
    filters, setFilter, resetFilters, active,
    roundName, setRoundName, trackName, setTrackName, topicName, setTopicName, regTeamName, setRegTeamName,
    roundModalOpen, setRoundModalOpen,
    trackModalOpen, setTrackModalOpen,
    topicModalOpen, setTopicModalOpen,
    regTeamModalOpen, setRegTeamModalOpen,
    handleSelect,
    filterConfigs,
  } = useSubmissionFilters(tracks, topics)

  // ── Data ──
  const { items, totalCount: total, page, setPage, loading, error } = useSubmissions(eventId, filters)

  // ── Columns ──
  const columns = useSubmissionColumns(eventId)

  // Load tracks (for the dropdowns inside modals we don't need preload, but columns reference tracks)
  useEffect(() => {
    let c = false
    setLoadingOpts(true)
    Promise.all([getRounds(eventId, { PageSize: 5 }), getTracks(eventId, { PageSize: 10 })])
      .then(([, tr]) => { if (!c) setTracks(tr.tracks || []) })
      .catch(() => { if (!c) setTracks([]) })
      .finally(() => { if (!c) setLoadingOpts(false) })
    return () => { c = true }
  }, [eventId])

  // Load topics when track changes
  useEffect(() => {
    if (!filters.trackId) { setTopics([]); return }
    let c = false
    getTopics(filters.trackId, { PageSize: 10 })
      .then((r) => { if (!c) setTopics(r.topics || []) })
      .catch(() => { if (!c) setTopics([]) })
    return () => { c = true }
  }, [filters.trackId])

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[#e8ecf0] bg-white overflow-hidden">
        <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
          <FilterBar
            filters={filterConfigs}
            values={filters}
            onChange={setFilter}
            onReset={resetFilters}
            hasActive={active}
          />
        </div>

        <BaseTable
          borderless
          columns={columns}
          data={items}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          loading={loading || loadingOpts}
          serverSide
          emptyText={active ? 'No submissions match the current filters.' : 'No submissions found for this event.'}
          keyExtractor={(row) => row.registerTeamId + '-' + row.roundId}
          minWidth="900px"
        />
      </div>

      {/* ── Select Modals ── */}
      <RoundSelectModal
        open={roundModalOpen}
        onClose={() => setRoundModalOpen(false)}
        eventId={eventId}
        selectedRoundId={filters.roundId}
        onSelect={handleSelect('roundId', setRoundName)}
        fetchRounds={getRounds}
      />

      <TrackSelectModal
        open={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        eventId={eventId}
        selectedTrackId={filters.trackId}
        fetchTracks={getTracks}
        onSelect={(id, name) => {
          handleSelect('trackId', setTrackName)(id, name)
          if (id !== filters.trackId) {
            setFilter('topicId', '')
            setTopicName('')
            setTopics([])
          }
        }}
      />

      <TopicSelectModal
        open={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        trackId={filters.trackId}
        selectedTopicId={filters.topicId}
        onSelect={handleSelect('topicId', setTopicName)}
        fetchTopics={getTopics}
      />

      <RegisterTeamSelectModal
        open={regTeamModalOpen}
        onClose={() => setRegTeamModalOpen(false)}
        eventId={eventId}
        selectedRegisterTeamId={filters.registerTeamId}
        onSelect={handleSelect('registerTeamId', setRegTeamName)}
        fetchEventRegisterTeams={getEventRegisterTeams}
      />
    </>
  )
}
