import { useState, useEffect } from 'react'
import { UsersRound, FileText, Loader2 } from 'lucide-react'
import Avatar from '../../../components/Avatar'
import { cn } from '../../../utils/cn'
import { getStudentEventAssignments } from '../../../api/student'

/* ------------------------------------------------------------------ */
/*  Person card                                                         */
/* ------------------------------------------------------------------ */

function PersonCard({ person }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
      <Avatar
        src={person.avatarUrl}
        name={`${person.firstName} ${person.lastName}`}
        size="h-9 w-9"
        textSize="text-[13px]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">
          {person.firstName} {person.lastName}
        </p>
        <p className="truncate text-[12px] text-[#8a9ba6]">{person.email}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Role group                                                         */
/* ------------------------------------------------------------------ */

function RoleGroup({ title, items }) {
  if (items.length === 0) return null
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-[#1f2f3a]">{title}</h3>
        <span className="rounded-md bg-[#f0f0f0] px-2 py-0.5 text-[12px] font-semibold text-[#5a6a73]">
          {items.length} person{items.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.map((person) => (
          <PersonCard key={person.assignEventId} person={person} />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                    */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((g) => (
        <div key={g}>
          <div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-[68px] animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#d7e0e5] bg-white py-16">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4f8] text-[#8a9ba6]">
        <UsersRound size={22} />
      </div>
      <p className="text-[15px] font-medium text-[#1f2f3a]">No assignments</p>
      <p className="mt-1 text-[13px] text-[#7a8e99]">
        Judges and mentors will appear here once assigned.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Error banner                                                        */
/* ------------------------------------------------------------------ */

function ErrorBanner({ message }) {
  return (
    <div className="rounded-xl border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
      {message}
    </div>
  )
}

/* ================================================================== */
/*  TabAssignments                                                     */
/* ================================================================== */

export default function TabAssignments({ eventId }) {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!eventId) return
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        const [judges, mentors] = await Promise.all([
          getStudentEventAssignments(eventId, { EventRole: 'Judge', PageSize: 100 }),
          getStudentEventAssignments(eventId, { EventRole: 'Mentor', PageSize: 100 }),
        ])
        if (!cancelled) {
          const combined = [
            ...(judges.items || []).map((i) => ({ ...i, _group: 'Judge' })),
            ...(mentors.items || []).map((i) => ({ ...i, _group: 'Mentor' })),
          ]
          setAllItems(combined)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Cannot load assignments.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [eventId])

  if (loading) return <LoadingSkeleton />

  if (error) return <ErrorBanner message={error} />

  const judges = allItems.filter((i) => i._group === 'Judge')
  const mentors = allItems.filter((i) => i._group === 'Mentor')

  if (allItems.length === 0) return <EmptyState />

  return (
    <div className="space-y-6">
      <RoleGroup title="Judge" items={judges} />
      <RoleGroup title="Mentor" items={mentors} />
    </div>
  )
}
