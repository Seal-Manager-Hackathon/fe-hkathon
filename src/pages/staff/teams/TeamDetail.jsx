import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTeamDetail, getTeamRegisterHistory } from '../../../api/staff'
import TeamDetailHeader from './TeamDetailHeader'
import TeamDetailMembers from './TeamDetailMembers'
import TeamDetailRegistrations from './TeamDetailRegistrations'

const REG_PAGE_SIZE = 10

export default function TeamDetail() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Registration history
  const [registers, setRegisters] = useState([])
  const [regTotal, setRegTotal] = useState(0)
  const [regLoading, setRegLoading] = useState(false)
  const [regPage, setRegPage] = useState(1)
  const [regStatus, setRegStatus] = useState('')
  const regHasActive = regStatus !== ''

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true); setError('')
      try { const data = await getTeamDetail(id); if (!cancelled) setTeam(data) }
      catch (err) { if (!cancelled) setError(err?.response?.data?.message || 'Failed to load team detail.') }
      finally { if (!cancelled) setLoading(false) }
    }
    fetch(); return () => { cancelled = true }
  }, [id])

  // Fetch registration history
  const fetchRegisters = useCallback(async () => {
    setRegLoading(true)
    try {
      const params = { pageIndex: regPage, pageSize: REG_PAGE_SIZE }
      if (regStatus) params.status = regStatus
      const result = await getTeamRegisterHistory(id, params)
      setRegisters(result.items || [])
      setRegTotal(result.totalCount || 0)
    } catch {}
    finally { setRegLoading(false) }
  }, [id, regPage, regStatus])

  useEffect(() => { if (team) fetchRegisters() }, [fetchRegisters, team])

  function handleRegFilterChange(key, value) { setRegStatus(value); setRegPage(1) }
  function handleRegReset() { setRegStatus(''); setRegPage(1) }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  if (error) {
    const nf = error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Team not found' : error}</p>
        <Link to="/staff/teams" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Teams</Link>
      </div>
    )
  }

  const members = team?.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <TeamDetailHeader team={team} />

      <div className="mt-5">
        <TeamDetailMembers members={members} />
      </div>

      <TeamDetailRegistrations
        registers={registers}
        regTotal={regTotal}
        regLoading={regLoading}
        regPage={regPage}
        regStatus={regStatus}
        regHasActive={regHasActive}
        onPageChange={setRegPage}
        onFilterChange={handleRegFilterChange}
        onFilterReset={handleRegReset}
      />
    </div>
  )
}
