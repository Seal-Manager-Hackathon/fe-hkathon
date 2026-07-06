import { Link } from 'react-router-dom'
import { LogIn, Trophy, Users, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function HeroSection() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  if (isAuthenticated) {
    return (
      <section className="bg-[#f4f6f8] px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[700px] text-center">
          <h1 className="mb-4 text-[32px] font-extrabold leading-tight tracking-tight text-[#1f2f3a] sm:text-[42px]">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-gray-600 sm:text-[17px]">
            Ready to build something amazing? Join a team, explore hackathons, or create your own team and compete.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/teams/create"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b]"
            >
              <Users className="h-4 w-4" />
              Create Team
            </Link>
            <Link
              to="/hackathons"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[#064f5d] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#064f5d] hover:text-white"
            >
              <Search className="h-4 w-4" />
              Explore Hackathons
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f4f6f8] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[700px] text-center">
        <h1 className="mb-4 text-[32px] font-extrabold leading-tight tracking-tight text-[#1f2f3a] sm:text-[42px]">
          SEAL Hackathon
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-gray-600 sm:text-[17px]">
          Where innovators, developers, and organizations come together to build
          impactful products, compete, and launch new ideas.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            to="/login"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b]"
          >
            Sign in
            <LogIn className="h-4 w-4" />
          </Link>
          <Link
            to="/hackathons"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[#064f5d] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#064f5d] hover:text-white"
          >
            Explore active hackathons
            <Trophy className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
