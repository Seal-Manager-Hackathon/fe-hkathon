import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Users, Flag, Hash, UserPlus, FileText, Inbox } from 'lucide-react'
import { getStudentEventDetail } from '../../../api/student'
import Badge from '../../../components/Badge'
import { formatDateTime } from '../../../utils/format'

const STATUS_BADGE = {
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
}

const INFO_CARDS = [
  { key: 'season', label: 'Season', icon: <Flag className="h-5 w-5 text-[#ef6c00]" />, bg: 'bg-orange-50' },
  { key: 'startTime', label: 'Start Time', icon: <Calendar className="h-5 w-5 text-[#1565c0]" />, bg: 'bg-blue-50' },
  { key: 'endTime', label: 'End Time', icon: <Calendar className="h-5 w-5 text-[#c62828]" />, bg: 'bg-red-50' },
  { key: 'registerLimitTime', label: 'Reg Deadline', icon: <Clock className="h-5 w-5 text-[#e65100]" />, bg: 'bg-orange-50' },
  { key: 'limitTeam', label: 'Max Teams', icon: <Users className="h-5 w-5 text-[#2e7d32]" />, bg: 'bg-green-50' },
  { key: 'minMember', label: 'Min Members', icon: <UserPlus className="h-5 w-5 text-[#6a1b9a]" />, bg: 'bg-purple-50' },
  { key: 'maxMember', label: 'Max Members', icon: <UserPlus className="h-5 w-5 text-[#6a1b9a]" />, bg: 'bg-purple-50' },
  { key: 'numberRound', label: 'Rounds', icon: <Hash className="h-5 w-5 text-[#37474f]" />, bg: 'bg-gray-100' },
]

function getCardValue(event, key) {
  switch (key) {
    case 'season':
      return event.season || '—'
    case 'startTime':
    case 'endTime':
    case 'registerLimitTime':
      return event[key] ? formatDateTime(event[key]) : '—'
    case 'createdAt':
    case 'updatedAt':
      return event[key] ? formatDateTime(event[key]) : '—'
    case 'limitTeam':
    case 'minMember':
    case 'maxMember':
    case 'numberRound':
      return event[key] ?? '—'
    default:
      return event[key] ?? '—'
  }
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isForbidden, setIsForbidden] = useState(false)

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
            setError('Không tìm thấy sự kiện')
          } else if (status === 401) {
            // api.js interceptor handles redirect
          } else {
            setError(err?.response?.data?.message || 'Không thể tải thông tin sự kiện.')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchEvent()
    return () => { cancelled = true }
  }, [id])

  // Forbidden — hide the page entirely (matches HackathonsPage pattern)
  if (isForbidden) return null

  return (
    <div className="min-h-screen bg-[#f6f9fb]">
      <div className="mx-auto max-w-[1064px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/hackathons"
          className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a]"
        >
          <ArrowLeft size={16} />
          Back to Hackathons
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
              <Inbox size={28} />
            </div>
            <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
            <Link
              to="/hackathons"
              className="mt-2 text-[14px] font-medium text-[#064f5d] transition-colors hover:text-[#05404a] hover:underline"
            >
              &larr; Back to Hackathons
            </Link>
          </div>
        )}

        {/* Event detail */}
        {!loading && !error && event && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-[28px] font-bold text-[#1f2f3a] sm:text-[34px]">
                    {event.name}
                  </h1>
                  <Badge
                    label={event.status}
                    className={STATUS_BADGE[event.status] || 'bg-[#f5f5f5] text-[#757575]'}
                  />
                  {event.isDisable && (
                    <Badge label="Deleted" className="bg-[#fce4ec] text-[#c62828]" />
                  )}
                </div>
                <p className="mt-2 text-[14px] text-[#5a6a73]">
                  {event.season ? `${event.season} · ` : ''}
                  {formatDateTime(event.startTime)} – {formatDateTime(event.endTime)}
                </p>
              </div>
            </div>

            {/* Info cards */}
            <h3 className="text-[15px] font-bold text-[#1f2f3a]">Event Information</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.key}
                  className={`rounded-xl border border-[#e8ecf0] ${card.bg} p-4 flex flex-col gap-2`}
                >
                  <div className="flex items-center gap-2">
                    {card.icon}
                    <span className="text-[12px] font-medium text-gray-400 uppercase tracking-wide">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-[16px] font-bold text-[#1f2f3a]">
                    {getCardValue(event, card.key)}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="overflow-hidden rounded-xl border border-[#e8ecf0] bg-white">
              <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
                <h3 className="flex items-center gap-2 text-[15px] font-bold text-white">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
              </div>
              <div className="px-5 py-5 text-[14px] leading-relaxed text-[#1f2f3a] whitespace-pre-wrap">
                {event.description || 'No description provided.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
