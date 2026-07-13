import { useState, useEffect } from 'react'
import HeroSection from '../../../components/HeroSection'
import HackathonForYouSection from '../../../components/HackathonForYouSection'
import TeamRanking from '../../../components/TeamRanking'
import PopularHackathons from '../../../components/PopularHackathons'
import Footer from '../../../components/Footer'
import {
  getStudentForYouEvents,
  getStudentPopularEvents,
} from '../../../api/student'
import {
  mockRankingTeams,
  mockFooterColumns,
  mockFooterBottomLinks,
} from '../../../data/mockHomeData'

const THEME_COLORS = ['blue', 'emerald', 'violet', 'rose', 'amber', 'teal', 'indigo', 'orange', 'green', 'cyan', 'slate', 'sky']

function getThemeColor(id) {
  const index = String(id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % THEME_COLORS.length
  return THEME_COLORS[index]
}

function getRelativeTime(startTime, endTime) {
  const now = Date.now()
  const start = startTime ? new Date(startTime).getTime() : null
  const end = endTime ? new Date(endTime).getTime() : null

  if (start && now < start) {
    const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Starts today!', urgent: true }
    if (days === 1) return { label: 'Starts tomorrow', urgent: true }
    if (days <= 7) return { label: `Starts in ${days} days`, urgent: true }
    return { label: `Starts in ${days} days`, urgent: false }
  }
  if (end && now > end) {
    const days = Math.floor((now - end) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Ended today', urgent: false }
    if (days === 1) return { label: 'Ended yesterday', urgent: false }
    return { label: `Ended ${days} days ago`, urgent: false }
  }
  if (end) {
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    if (days <= 0) return { label: 'Last day!', urgent: true }
    if (days === 1) return { label: '1 day left', urgent: true }
    if (days <= 7) return { label: `${days} days left`, urgent: true }
    return { label: `${days} days left`, urgent: false }
  }
  return null
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
    label: event.status === 'Published' ? 'FEATURED' : 'ACTIVE',
  }
}

export default function HomePage() {
  const [forYouEvents, setForYouEvents] = useState([])
  const [popularEvents, setPopularEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      try {
        const [forYou, popular] = await Promise.all([
          getStudentForYouEvents(),
          getStudentPopularEvents(),
        ])
        if (!cancelled) {
          setForYouEvents((forYou.events || []).map(normalizeForYou))
          setPopularEvents((popular.events || []).map(normalizePopular))
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
          <TeamRanking teams={mockRankingTeams} />
        </div>

        <PopularHackathons hackathons={popularEvents} />
      </section>

      <Footer
        columns={mockFooterColumns}
        bottomLinks={mockFooterBottomLinks}
      />
    </>
  )
}
