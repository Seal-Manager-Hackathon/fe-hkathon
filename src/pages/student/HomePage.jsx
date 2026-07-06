import HeroSection from '../../components/HeroSection'
import HackathonForYouSection from '../../components/HackathonForYouSection'
import TeamRanking from '../../components/TeamRanking'
import PopularHackathons from '../../components/PopularHackathons'
import Footer from '../../components/Footer'
import {
  mockHackathons,
  mockRankingTeams,
  mockPopularHackathons,
  mockFooterColumns,
  mockFooterBottomLinks,
} from '../../data/mockHomeData'

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          <HackathonForYouSection hackathons={mockHackathons} />
          <TeamRanking teams={mockRankingTeams} />
        </div>

        <PopularHackathons hackathons={mockPopularHackathons} />
      </section>

      <Footer
        columns={mockFooterColumns}
        bottomLinks={mockFooterBottomLinks}
      />
    </>
  )
}
