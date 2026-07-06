import { ArrowRight } from 'lucide-react'
import HackathonCard from '../HackathonCard'

export default function HackathonForYouSection({ hackathons }) {
  return (
    <div className="flex-1">
      <h2 className="mb-5 text-[22px] font-bold text-[#1f2f3a]">SEAL Hackathons for you</h2>
      <div className="flex flex-col gap-3">
        {hackathons.map((h) => (
          <HackathonCard key={h.id} hackathon={h} />
        ))}
      </div>
      <button className="mt-5 inline-flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-[#064f5d] hover:underline">
        View all SEAL hackathons
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
