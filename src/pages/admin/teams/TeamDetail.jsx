import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Send, Users as UsersIcon } from 'lucide-react'
import { getTeamDetail, getTeamRegisterHistory, getRegisterTeamSubmissions } from '../../../api/admin'
import TeamDetailHeader from './TeamDetailHeader'
import TeamDetailMembers from './TeamDetailMembers'
import TeamDetailSubmissions from './TeamDetailSubmissions'
import TeamDetailRegistrations from './TeamDetailRegistrations'

const REG_PAGE_SIZE = 10

const SUB_TABS = [
  { key: 'members', label: 'Members', icon: <UsersIcon className="h-4 w-4" /> },
  { key: 'submissions', label: 'Submissions', icon: <Send className="h-4 w-4" /> },
]

export default function TeamDetail() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [subTab, setSubTab] = useState('members')

  // Registration history
  const [registers, setRegisters] = useState([])
  const [regTotal, setRegTotal] = useState(0)
  const [regLoading, setRegLoading] = useState(false)
  const [regPage, setRegPage] = useState(1)
  const [regStatus, setRegStatus] = useState('')
  const regHasActive = regStatus !== ''

  // Submissions
  const [selectedRegisterId, setSelectedRegisterId] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [subPage, setSubPage] = useState(1)
  const [subLoading, setSubLoading] = useState(false)
  const SUB_PAGE_SIZE = 10

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

  const [allRegisters, setAllRegisters] = useState([])
  useEffect(() => {
    if (!team) return
    let cancelled = false
    async function fetchAll() {
      try {
        const result = await getTeamRegisterHistory(id, { pageIndex: 1, pageSize: 100 })
        if (!cancelled) setAllRegisters(result.items || [])
      } catch {}
    }
    fetchAll()
    return () => { cancelled = true }
  }, [id, team])

  useEffect(() => {
    if (subTab === 'submissions' && !selectedRegisterId && allRegisters.length > 0) {
      setSelectedRegisterId(allRegisters[0].id)
    }
  }, [subTab, allRegisters, selectedRegisterId])

  const fetchSubmissions = useCallback(async () => {
    if (!selectedRegisterId) { setSubmissions([]); setSubTotal(0); return }
    setSubLoading(true)
    try {
      const params = { pageIndex: subPage, pageSize: SUB_PAGE_SIZE }
      const result = await getRegisterTeamSubmissions(selectedRegisterId, params)
      setSubmissions(result.items || [])
      setSubTotal(result.totalCount || 0)
    } catch { setSubmissions([]); setSubTotal(0) }
    finally { setSubLoading(false) }
  }, [selectedRegisterId, subPage])

  useEffect(() => {
    if (subTab === 'submissions') fetchSubmissions()
  }, [fetchSubmissions, subTab])

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
        <Link to="/admin/teams" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">&larr; Back to Teams</Link>
      </div>
    )
  }

  const members = team?.members || []

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <TeamDetailHeader team={team} />

      <div className="mt-5">
        <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[#e8ecf0]">
          {SUB_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={`cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                subTab === t.key
                  ? 'border-b-2 border-[#064f5d] text-[#064f5d]'
                  : 'text-gray-400 hover:text-[#1f2f3a]'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {subTab === 'members' && <TeamDetailMembers members={members} />}

        {subTab === 'submissions' && (
          <TeamDetailSubmissions
            allRegisters={allRegisters}
            selectedRegisterId={selectedRegisterId}
            submissions={submissions}
            subTotal={subTotal}
            subPage={subPage}
            subLoading={subLoading}
            onRegisterChange={(id) => { setSelectedRegisterId(id); setSubPage(1) }}
            onPageChange={setSubPage}
          />
        )}
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
