import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Search, Plus, X, UserCheck, Crown,
} from 'lucide-react'
import {
  getStudentMyTeams,
  createStudentTeam,
} from '../../../api/student'
import Pagination from '../../../components/Pagination'
import { toast } from '../../../utils/toast'

const PAGE_SIZE = 7

/* ================================================================== */
/*  Teams list                                                         */
/* ================================================================== */

export default function StudentTeamsPage() {
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const fetchTeams = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { PageIndex: pageIndex, PageSize: PAGE_SIZE }
      if (searchTerm.trim()) params.keyword = searchTerm.trim()
      const result = await getStudentMyTeams(params)
      setTeams(result.teams || [])
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      if (err?.response?.status === 403) return
      setError(err?.response?.data?.message || 'Không thể tải danh sách team.')
    } finally {
      setLoading(false)
    }
  }, [pageIndex, searchTerm])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-7 w-40 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">My Teams</h1>
          <p className="mt-1 text-[14px] text-[#5a6a73]">Teams you are currently a member of</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9ba6]" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPageIndex(1) }}
              className="w-full rounded-lg border border-[#d7e0e5] bg-white py-2 pl-9 pr-3 text-[13px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0]/20"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
          >
            <Plus size={16} />
            Create Team
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
      )}

      {!error && teams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8edf1] text-[#9ca3af]">
            <Users size={28} />
          </div>
          <h3 className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">No teams found</h3>
          <p className="max-w-xs text-center text-[14px] text-[#5a6a73]">
            {searchTerm ? 'No teams match your search.' : 'You haven\'t joined any teams yet.'}
          </p>
        </div>
      )}

      {teams.length > 0 && (
        <div className="space-y-3">
          {teams.map((team) => (
            <div
              key={team.teamId}
              className="flex flex-col gap-3 rounded-xl border border-[#d7e0e5] bg-[#f8fafb] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1565c0]/20 hover:shadow-[0_8px_24px_rgba(21,101,192,0.08)] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1565c0] to-[#42a5f5] text-white shadow-sm">
                  <Users size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h4 className="truncate text-[15px] font-bold text-[#1f2f3a]">{team.name}</h4>
                    {team.isLeader && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0] px-2 py-0.5 text-[10px] font-semibold text-[#e65100] ring-1 ring-orange-200/60">
                        <Crown size={10} />
                        Leader
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#5a6a73]">
                    <span className="inline-flex items-center gap-1">
                      <UserCheck size={12} className="text-[#8a9ba6]" />
                      {team.memberCount ?? '—'} member{team.memberCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to={`/teams/${team.teamId}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1565c0] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(21,101,192,0.2)] transition-all duration-200 hover:bg-[#0d47a1] hover:shadow-[0_4px_12px_rgba(21,101,192,0.3)] active:scale-[0.97]"
              >
                View Team
              </Link>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={pageIndex} totalPages={totalPages} onPageChange={setPageIndex} />
      )}

      <CreateTeamModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => { setShowCreate(false); setPageIndex(1); fetchTeams() }}
      />
    </div>
  )
}

/* ================================================================== */
/*  Create Team Modal                                                  */
/* ================================================================== */

function CreateTeamModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Tên team không được để trống'); return }
    setSubmitting(true)
    setError('')
    try {
      await createStudentTeam(name.trim())
      toast.success('Team created successfully.')
      onCreated()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tạo team.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Users className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Create Team</h3>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1f2f3a]">Team Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team name..."
              maxLength={200}
              className="w-full rounded-lg border border-[#d7e0e5] px-3 py-2.5 text-[14px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0]"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1f2f3a] hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
