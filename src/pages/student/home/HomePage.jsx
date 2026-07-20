import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import HeroSection from '../../../components/HeroSection'
import HackathonForYouSection from '../../../components/HackathonForYouSection'
import TeamRanking from '../../../components/TeamRanking'
import PopularHackathons from '../../../components/PopularHackathons'
import {
  getStudentForYouEvents,
  getStudentPopularEvents,
  getStudentLeaderboard,
} from '../../../api/student'
import { useAuth } from '../../../context/AuthContext'

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

const REQUIRED_PROFILE_FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'college', label: 'College' },
  { key: 'studentId', label: 'Student ID' },
  { key: 'phoneNumber', label: 'Phone Number' },
]

export default function HomePage() {
  const { user } = useAuth()
  const [forYouEvents, setForYouEvents] = useState([])
  const [popularEvents, setPopularEvents] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  const missingFields = useMemo(() => {
    if (!user) return []
    return REQUIRED_PROFILE_FIELDS.filter(({ key }) => !user[key]).map(({ label }) => label)
  }, [user])

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
        <WarningBanner missingFields={missingFields} />
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

      {missingFields.length > 0 && (
        <WarningBanner missingFields={missingFields} />
      )}

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

function WarningBanner({ missingFields }) {
  if (!missingFields?.length) return null

  return (
    <section className="mx-auto w-full max-w-[1100px] px-4 pt-6 sm:px-6 lg:px-10">
      <div className="rounded-xl border border-[#ffca28]/40 bg-[#fffbeb] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffca28]/20">
            <AlertTriangle className="h-4 w-4 text-[#b8860b]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#b8860b]" />
              <h3 className="text-[14px] font-bold text-[#92400e]">
                Complete your profile to join hackathons
              </h3>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#92400e]/80">
              You&#39;re missing the following required information:{' '}
              <span className="font-semibold text-[#92400e]">{missingFields.join(', ')}</span>.
              Please complete your profile to be able to register for hackathons.
            </p>
            <Link
              to="/profile/edit"
              className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a]"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
