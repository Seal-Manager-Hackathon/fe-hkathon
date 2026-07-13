import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, Clock, Users, Flag, UserPlus, FileText,
  Layers, Award, MapPin, BarChart3, Trophy,
} from 'lucide-react'
import { getStudentEventDetail } from '../../../api/student'
import Avatar from '../../../components/Avatar'
import { formatDate, formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'
import { getInitials, getRelativeStatus, getCardValue } from './eventDetailHelpers'
import { STATUS_STYLES, TABS, ITEM_META, GROUP_INFO } from './eventDetailConstants'
import TabDescription from './TabDescription'
import TabRounds from './TabRounds'
import TabAwards from './TabAwards'
import TabAssignments from './TabAssignments'
import TabEventLeaderboard from './TabEventLeaderboard'
import RegisterEventModal from './RegisterEventModal'

function ScheduleRow({ icon: Icon, label, value, accent = '#8a9ba6' }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#1f2f3a]">{label}</span>
      </div>
      <span className="shrink-0 text-right text-[13px] font-semibold text-[#1f2f3a]">
        {value}
      </span>
    </div>
  )
}

function SidebarSection({ title, icon: Icon, children, className }) {
  return (
    <div className={cn('rounded-xl border border-[#d7e0e5] bg-white overflow-hidden', className)}>
      <div className="flex items-center gap-2 border-b border-[#e8ecf0] bg-[#fafbfc] px-5 py-3">
        {Icon && <Icon size={15} className="text-[#8a9ba6]" />}
        <h4 className="text-[13px] font-bold text-[#1f2f3a]">{title}</h4>
      </div>
      <div className="px-5 py-2.5">{children}</div>
    </div>
  )
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isForbidden, setIsForbidden] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [registerEventModalOpen, setRegisterEventModalOpen] = useState(false)

  /* ---- data fetching ---- */

  useEffect(() => {
    let cancelled = false

    async function fetchEvent() {
      setLoading(true)
      setError('')
      setIsForbidden(false)
      try {
        const data = await getStudentEventDetail(id)
        if (!cancelled) setEvent(data)
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status
          if (status === 403) {
            setIsForbidden(true)
          } else if (status === 404) {
            setError('Event not found')
          } else if (status === 401) {
            // api.js interceptor handles redirect
          } else {
            setError(err?.response?.data?.message || 'Cannot load event information.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvent()
    return () => { cancelled = true }
  }, [id])

  /* ---- early returns ---- */

  if (isForbidden) return null

  /* ---- loading skeleton ---- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mb-8 overflow-hidden rounded-xl border border-[#d7e0e5] bg-white">
            <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:gap-7 sm:px-8 sm:py-7">
              <div className="mx-auto h-[68px] w-[68px] shrink-0 animate-pulse rounded-2xl bg-gray-200 sm:mx-0 sm:h-[76px] sm:w-[76px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div className="space-y-3">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-5">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-24 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
              <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
            </div>
            <div className="space-y-5">
              <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---- error state ---- */

  if (!loading && error) {
    return (
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/hackathons"
            className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]"
          >
            <ArrowLeft size={16} />
            Back to hackathons
          </Link>

          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
              <FileText size={28} />
            </div>
            <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
            <Link
              to="/hackathons"
              className="mt-2 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1] hover:underline"
            >
              &larr; Back to hackathons
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ---- main content ---- */

  if (!loading && !error && event) {
    const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.Draft
    const initials = getInitials(event.name)
    const relative = getRelativeStatus(event.startTime, event.endTime)

    return (<>
      <div className="min-h-screen bg-[#f6f9fb]">
        <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
          {/* ---------- Back link ---------- */}
          <Link
            to="/hackathons"
            className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]"
          >
            <ArrowLeft size={16} />
            Back to hackathons
          </Link>

          {/* ========== Info card ========== */}
          <div className="mb-8 overflow-hidden rounded-xl border border-[#d7e0e5] bg-gradient-to-r from-[#064f5d] via-[#0a6e7d] to-[#0d8a9a] shadow-[0_4px_16px_rgba(6,79,93,0.12)]">
            <div className="relative px-6 py-6 sm:px-8 sm:py-7">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.03]" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
                {/* Avatar */}
                <div className="relative shrink-0 self-center sm:self-start">
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-white/20 text-[22px] font-bold leading-none tracking-wide text-white shadow-md backdrop-blur sm:h-[76px] sm:w-[76px] sm:text-[26px] sm:rounded-[18px]">
                    {initials}
                  </div>
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-white',
                      relative.dot,
                    )}
                  />
                </div>

                {/* Right content */}
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  {/* Title section */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-[24px] font-bold leading-tight text-white sm:text-[28px]">
                        {event.name}
                      </h1>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          statusStyle.cls,
                        )}
                      >
                        {statusStyle.label}
                      </span>
                      {event.isDisable && (
                        <span className="inline-flex items-center rounded-full bg-[#fce4ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#c62828] ring-1 ring-[#ef9a9a]">
                          Deleted
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#80deea]">
                      {event.season && (
                        <span className="inline-flex items-center gap-1.5">
                          <Flag size={14} className="text-[#ffca28]" />
                          {event.season}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-[#80deea]" />
                        {event.numberRound ?? 0} {event.numberRound === 1 ? 'Round' : 'Rounds'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn('h-1.5 w-1.5 rounded-full', relative.dot)} />
                        <span className={cn('font-medium', relative.color === 'text-blue-600' ? 'text-blue-200' : relative.color === 'text-emerald-600' ? 'text-emerald-200' : 'text-slate-300')}>{relative.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Info rows: Timeline + Constraints */}
                  <div className="space-y-2">
                    {GROUP_INFO.map((group) => (
                      <div key={group.key} className="flex flex-wrap gap-x-5 gap-y-1">
                        {group.items.map((key) => {
                          const meta = ITEM_META[key]
                          const Icon = meta.icon
                          return (
                            <span key={key} className="inline-flex items-center gap-1.5">
                              <Icon size={12} className="shrink-0 text-[#80deea]" />
                              <span className="text-[12px] text-[#b2ebf2]">{meta.label}:</span>
                              <span className="text-[13px] font-semibold text-white">{getCardValue(event, key)}</span>
                            </span>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Register Event button — inside the card */}
                  {event.status === 'Published' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setRegisterEventModalOpen(true)}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/30 active:scale-[0.98]"
                      >
                        <UserPlus className="h-4 w-4" />
                        Register Event
                      </button>
                    </div>
                  )}

              </div>
            </div>
          </div>

          {/* ========== Tabs + sidebar layout ========== */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ---- Left: tabs ---- */}
            <div className="lg:col-span-2">
              {/* Tab nav */}
              <div className="flex border-b border-[#d7e0e5]">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'relative flex cursor-pointer items-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors sm:px-5',
                        activeTab === tab.key
                          ? 'text-[#1565c0]'
                          : 'text-[#7a8e99] hover:text-[#1f2f3a]',
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                      {activeTab === tab.key && (
                        <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#1565c0]" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Tab content */}
              <div className="mt-5">
                {activeTab === 'description' && (
                  <TabDescription description={event.description} />
                )}
                {activeTab === 'rounds' && (
                  <TabRounds eventId={event.id} />
                )}
                {activeTab === 'awards' && (
                  <TabAwards eventId={event.id} />
                )}
                {activeTab === 'assignments' && (
                  <TabAssignments eventId={event.id} />
                )}
                {activeTab === 'leaderboard' && (
                  <TabEventLeaderboard eventId={event.id} />
                )}
              </div>
            </div>

            {/* ---- Right: sidebar ---- */}
            <div className="space-y-5 self-start lg:sticky lg:top-8">
              {/* Schedule */}
              <SidebarSection title="Schedule" icon={Calendar}>
                <div className="divide-y divide-[#f0f4f8]">
                  <ScheduleRow
                    icon={Calendar}
                    label="Start Date"
                    value={event.startTime ? formatDate(event.startTime) : '—'}
                    accent="#3b82f6"
                  />
                  <ScheduleRow
                    icon={Calendar}
                    label="End Date"
                    value={event.endTime ? formatDate(event.endTime) : '—'}
                    accent="#ef4444"
                  />
                  <ScheduleRow
                    icon={Clock}
                    label="Reg. Deadline"
                    value={event.registerLimitTime ? formatDate(event.registerLimitTime) : '—'}
                    accent="#f59e0b"
                  />
                </div>
              </SidebarSection>

              {/* Team Rules */}
              <SidebarSection title="Team Rules" icon={UserPlus}>
                <div className="divide-y divide-[#f0f4f8]">
                  <ScheduleRow icon={Users} label="Max Teams" value={event.limitTeam ?? '—'} accent="#10b981" />
                  <ScheduleRow icon={UserPlus} label="Members / Team" value={`${event.minMember ?? '—'} – ${event.maxMember ?? '—'}`} accent="#8b5cf6" />
                </div>
              </SidebarSection>

            </div>
          </div>
        </div>
      </div>

      <RegisterEventModal
        eventId={event.id}
        open={registerEventModalOpen}
        onClose={() => setRegisterEventModalOpen(false)}
        onSuccess={() => {
          // Refresh event data to reflect new registration status
          getStudentEventDetail(id).then(setEvent).catch(() => {})
        }}
      />
    </>
    )
  }
}
