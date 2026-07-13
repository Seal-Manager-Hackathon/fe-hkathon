import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Users, Calendar, Crown, FileText, Clock,
  Info, UserRound, Layers, Award, MapPin,
} from 'lucide-react'
import {
  getStudentRegisterTeamDetail,
} from '../../../api/student'
import Avatar from '../../../components/Avatar'
import RichTextViewer from '../../../components/RichTextViewer'
import { formatDateTime } from '../../../utils/format'
import { cn } from '../../../utils/cn'

const TABS = [
  { key: 'overview', label: 'Overview', icon: Info },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'rounds', label: 'Rounds', icon: Layers },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'leaderboard', label: 'Leaderboard', icon: MapPin },
]

export default function RegisterTeamDetailPage() {
  const { registerTeamId } = useParams()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!registerTeamId) return
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await getStudentRegisterTeamDetail(registerTeamId)
        if (!cancelled) setDetail(data)
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 404) setError('Không tìm thấy')
          else setError(err?.response?.data?.message || 'Không thể tải thông tin.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [registerTeamId])

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 h-5 w-36 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="rounded-xl border border-[#d7e0e5] bg-white p-6">
          <div className="mb-6 flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />)}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <Link to="/teams" className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
          <ArrowLeft size={16} /> Back to Teams
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626]">
            <FileText size={28} />
          </div>
          <p className="mb-1 text-[17px] font-semibold text-[#1f2f3a]">{error}</p>
          <Link to="/teams" className="mt-2 text-[14px] font-medium text-[#1565c0] hover:underline">&larr; Back to Teams</Link>
        </div>
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      {/* Back link */}
      <Link to={`/teams/${detail.teamId}/registrations`} className="mb-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1565c0] transition-colors hover:text-[#0d47a1]">
        <ArrowLeft size={16} /> Back to Registrations
      </Link>

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#d7e0e5] bg-gradient-to-r from-[#064f5d] via-[#0a6e7d] to-[#0d8a9a] shadow-[0_4px_16px_rgba(6,79,93,0.12)]">
        <div className="relative px-6 py-6 sm:px-7 sm:py-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/[0.03]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[24px] font-bold text-white sm:text-[28px]">{detail.eventName}</h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#80deea]">
              <span className="inline-flex items-center gap-1.5"><Users size={14} />{detail.teamName}</span>
              {detail.roundName && <span className="inline-flex items-center gap-1.5"><Clock size={14} />Round {detail.roundNo}: {detail.roundName}</span>}
              {detail.trackTitle && <span className="inline-flex items-center gap-1.5"><FileText size={14} />{detail.trackTitle}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="rounded-xl border border-[#d7e0e5] bg-white">
        {/* Tab nav */}
        <div className="flex border-b border-[#d7e0e5] px-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium cursor-pointer whitespace-nowrap transition-colors sm:px-5',
                  activeTab === tab.key ? 'text-[#1565c0]' : 'text-[#7a8e99] hover:text-[#1f2f3a]',
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
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="divide-y divide-[#f0f4f8] rounded-xl border border-[#e8ecf0]">
                <DetailRow icon={Calendar} label="Event" value={detail.eventName} accent="#3b82f6" />
                <DetailRow icon={Users} label="Team" value={detail.teamName} accent="#10b981" />
                {detail.roundName && <DetailRow icon={Clock} label="Round" value={`#${detail.roundNo} ${detail.roundName}`} accent="#f59e0b" />}
                {detail.trackTitle && <DetailRow icon={FileText} label="Track" value={detail.trackTitle} accent="#8b5cf6" />}
                {detail.topicTitle && <DetailRow icon={FileText} label="Topic" value={detail.topicTitle} accent="#8b5cf6" />}
                <DetailRow icon={Calendar} label="Registered" value={formatDateTime(detail.createdAt)} accent="#8a9ba6" />
              </div>
              {detail.description && (
                <div>
                  <p className="mb-2 text-[13px] font-bold text-[#1f2f3a]">Description</p>
                  <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4">
                    <RichTextViewer content={detail.description} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-2.5">
              {detail.members && detail.members.length > 0 ? (
                detail.members.map((m) => (
                  <div key={m.userId} className="flex items-center gap-4 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3 transition-colors hover:border-[#d7e0e5]">
                    <Avatar src={m.avatarUrl} name={`${m.firstName} ${m.lastName}`} size="h-10 w-10" textSize="text-[14px]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{m.firstName} {m.lastName}</p>
                        {m.isLeader && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[10px] font-semibold text-[#e65100] ring-1 ring-orange-200/60">
                            <Crown size={10} />
                            Leader
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[12px] text-[#8a9ba6]">{m.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <UserRound size={24} className="mb-2 text-[#8a9ba6]" />
                  <p className="text-[13px] text-[#7a8e99]">No members found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rounds' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Layers size={32} className="mb-3 text-[#8a9ba6]" />
              <p className="text-[15px] font-medium text-[#1f2f3a]">Rounds</p>
              <p className="mt-1 text-[13px] text-[#7a8e99]">View round information in the event detail page.</p>
              <Link to={`/hackathons/${detail.eventId}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]">
                View Event
              </Link>
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Award size={32} className="mb-3 text-[#8a9ba6]" />
              <p className="text-[15px] font-medium text-[#1f2f3a]">Awards</p>
              <p className="mt-1 text-[13px] text-[#7a8e99]">View award information in the event detail page.</p>
              <Link to={`/hackathons/${detail.eventId}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]">
                View Event
              </Link>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="flex flex-col items-center justify-center py-12">
              <MapPin size={32} className="mb-3 text-[#8a9ba6]" />
              <p className="text-[15px] font-medium text-[#1f2f3a]">Leaderboard</p>
              <p className="mt-1 text-[13px] text-[#7a8e99]">View leaderboard in the event detail page.</p>
              <Link to={`/hackathons/${detail.eventId}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#1565c0] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1]">
                View Event
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: accent }} />
        <span className="text-[13px] text-[#5a6a73]">{label}</span>
      </div>
      <span className="text-[13px] font-semibold text-[#1f2f3a]">{value}</span>
    </div>
  )
}
