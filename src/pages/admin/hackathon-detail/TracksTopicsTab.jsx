export default function TracksTopicsTab({ tracks }) {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[15px] text-gray-400">No tracks configured yet.</p>
      </div>
    )
  }
  return (
    <div className="space-y-5">
      {tracks.map((track) => (
        <div key={track.id} className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white">
          <div className="border-b border-[#f0f0f0] bg-[#fafbfc] px-5 py-4">
            <h3 className="text-[15px] font-bold text-[#1f2f3a]">{track.name}</h3>
            <p className="mt-0.5 text-[12px] text-gray-400">{track.topics.length} topics</p>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {track.topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[14px] font-medium text-[#1f2f3a]">{topic.name}</span>
                <span className="text-[13px] text-gray-400">{topic.teams} team{topic.teams !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}