import { useState, useEffect } from 'react'
import HeroSection from '../../../components/HeroSection'
import HackathonForYouSection from '../../../components/HackathonForYouSection'
import TeamRanking from '../../../components/TeamRanking'
import PopularHackathons from '../../../components/PopularHackathons'
import {
  getStudentForYouEvents,
  getStudentPopularEvents,
  getStudentLeaderboard,
} from '../../../api/student'

const THEME_COLORS = ['blue', 'emerald', 'violet', 'rose', 'amber', 'teal', 'indigo', 'orange', 'green', 'cyan', 'slate', 'sky']

function getThemeColor(id) {
  const index = String(id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % THEME_COLORS.length
  return THEME_COLORS[index]
}

function normalizeForYou(event) {
  return {
    id: event.id,
    name: event.name,
    status: event.status,
    themeColor: getThemeColor(event.id),
    startTime: event.startTime,
    endTime: event.endTime,
    numberRound: event.numberRound,
    season: event.season,
  }
}

function normalizePopular(event) {
  return {
    ...normalizeForYou(event),
    approvedRegisterTeamCount: event.approvedRegisterTeamCount ?? 0,
  }
}

export default function HomePage() {
  const [forYouEvents, setForYouEvents] = useState([])
  const [popularEvents, setPopularEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      try {
        const [forYou, popular, lb] = await Promise.all([
          getStudentForYouEvents(),
          getStudentPopularEvents(),
          getStudentLeaderboard(new Date().getFullYear()),
        ])
        if (!cancelled) {
          setForYouEvents((forYou.events || []).map(normalizeForYou))
          setPopularEvents((popular.events || []).map(normalizePopular))
          setTeams((lb.items || []).map((item) => ({
            id: item.teamId,
            rank: item.rank,
            name: item.teamName,
            points: item.chapterScore,
            events: item.eventCount,
          })))
        }
      } catch {
        // silently fail — fall back to empty list
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <>
        <HeroSection />
        <section className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex-1 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[82px] animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
            <div className="w-full shrink-0 space-y-2 lg:w-[280px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <HeroSection />

      <section className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          <HackathonForYouSection hackathons={forYouEvents} />
          <TeamRanking teams={teams} />
        </div>

        <PopularHackathons hackathons={popularEvents} />
      </section>

    </>
  )
}
