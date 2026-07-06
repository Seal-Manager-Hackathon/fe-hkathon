import { ArrowRight } from 'lucide-react'
import PopularHackathonCard from '../PopularHackathonCard'

export default function PopularHackathons({ hackathons }) {
  return (
    <section
      className="mt-10 rounded-2xl px-8 py-10"
      style={{
        background: 'linear-gradient(135deg, #0d7377 0%, #1a6d9f 40%, #5b4fa8 100%)',
      }}
    >
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[20px] font-bold text-white sm:text-[24px]">Popular SEAL hackathons</h2>
        <button className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-white/20">
          Explore SEAL hackathons
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hackathons.map((h) => (
          <PopularHackathonCard key={h.id} hackathon={h} />
        ))}
      </div>
    </section>
  )
}
