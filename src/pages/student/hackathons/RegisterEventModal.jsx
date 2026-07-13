import { useState, useEffect } from 'react'
import { X, UserPlus, Search, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStudentMyTeams, createStudentRegisterTeam } from '../../../api/student'
import { toast } from '../../../utils/toast'
import Pagination from '../../../components/Pagination'

const PAGE_SIZE = 5

export default function RegisterEventModal({ eventId, open, onClose, onSuccess }) {
  const [teams, setTeams] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    fetchTeams()
  }, [open, pageIndex, searchKeyword])

  async function fetchTeams() {
    setLoading(true)
    try {
      const res = await getStudentMyTeams({
        keyword: searchKeyword || undefined,
        pageIndex,
        pageSize: PAGE_SIZE,
      })
      setTeams(res.teams || [])
      setTotalCount(res.totalCount || 0)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load teams.')
      setTeams([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setPageIndex(1)
    setSearchKeyword(keyword.trim())
  }

  async function handleRegister() {
    if (!selectedTeamId) {
      toast.error('Please select a team.')
      return
    }
    setSubmitting(true)
    try {
      await createStudentRegisterTeam({
        teamId: selectedTeamId,
        eventId,
        description: description.trim() || undefined,
      })
      toast.success('Registration successful.')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to register.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <UserPlus className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Register Event</h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a9ba6]" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search teams..."
              className="w-full rounded-lg border border-[#d7e0e5] py-2.5 pl-9 pr-3 text-[14px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0]"
            />
          </form>

          {/* Teams list */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#1565c0]" />
            </div>
          ) : teams.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[14px] text-[#8a9ba6]">No teams found.</p>
              <Link
                to="/student/teams"
                className="mt-2 inline-block text-[13px] text-[#1565c0] hover:underline"
                onClick={onClose}
              >
                Create a team
              </Link>
            </div>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {teams.map((team) => (
                <label
                  key={team.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedTeamId === team.id
                      ? 'border-[#1565c0] bg-[#e3f2fd]'
                      : 'border-[#d7e0e5] hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="team"
                    value={team.id}
                    checked={selectedTeamId === team.id}
                    onChange={() => setSelectedTeamId(team.id)}
                    className="h-4 w-4 text-[#1565c0] focus:ring-[#1565c0]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-[#1f2f3a]">{team.name}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={pageIndex}
              totalPages={totalPages}
              onPageChange={setPageIndex}
            />
          )}

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1f2f3a]">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note about your registration..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#d7e0e5] px-3 py-2.5 text-[14px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e8ecf0] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1f2f3a] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={submitting || !selectedTeamId}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#1565c0] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
