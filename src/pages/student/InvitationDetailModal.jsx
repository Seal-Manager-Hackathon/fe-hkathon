import { useEffect, useState } from 'react'
import { X, Clock, Users, Mail, Calendar, ShieldCheck } from 'lucide-react'
import { getStudentInvitationDetail } from '../../api/student'
import Avatar from '../../components/Avatar'
import { formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const INV_STATUS = {
  Pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60' },
  Accepted: { label: 'Accepted', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' },
  Rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 ring-1 ring-red-200/60' },
  Expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60' },
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f4f8]">
        <Icon size={15} className="text-[#5a6a73]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#8a9ba6]">{label}</p>
        <div className="mt-0.5 text-[14px] text-[#1f2f3a]">{children}</div>
      </div>
    </div>
  )
}

function ProfileRow({ avatarUrl, firstName, lastName, email }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={avatarUrl}
        name={`${firstName} ${lastName}`}
        size="h-10 w-10"
        textSize="text-[14px]"
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">
          {firstName} {lastName}
        </p>
        <p className="truncate text-[12px] text-[#5a6a73]">{email}</p>
      </div>
    </div>
  )
}

export default function InvitationDetailModal({ invitationId, open, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !invitationId) return
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const result = await getStudentInvitationDetail(invitationId)
        if (!cancelled) setDetail(result)
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Cannot load invitation details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [invitationId, open])

  if (!open) return null

  const st = detail ? INV_STATUS[detail.status] || INV_STATUS.Pending : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f2fd]">
              <Mail className="h-5 w-5 text-[#1565c0]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1f2f3a]">Invitation Details</h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1565c0] border-t-transparent" />
              <p className="mt-3 text-[13px] text-[#8a9ba6]">Loading details...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">{error}</div>
          ) : detail ? (
            <div className="space-y-1">
              {/* Team info */}
              <DetailRow icon={Users} label="Team">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#1565c0]">{detail.teamName}</span>
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold', st.cls)}>
                    {st.label}
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#5a6a73]">
                  {detail.teamMemberCount} member{detail.teamMemberCount !== 1 ? 's' : ''}
                  {detail.teamCanEdit ? ' · Editable' : ''}
                </p>
              </DetailRow>

              {/* Team members */}
              {detail.teamMembers && detail.teamMembers.length > 0 && (
                <>
                  <div className="border-t border-[#e8ecf0]" />
                  <div className="py-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[#8a9ba6] mb-3">Team Members</p>
                    <div className="space-y-2">
                      {detail.teamMembers.map((member) => (
                        <div key={member.userId} className="flex items-center justify-between gap-3 rounded-lg bg-[#f6f9fb] px-3 py-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar
                              src={member.avatarUrl}
                              name={`${member.firstName} ${member.lastName}`}
                              size="h-8 w-8"
                              textSize="text-[12px]"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium text-[#1f2f3a]">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="truncate text-[11px] text-[#5a6a73]">{member.email}</p>
                            </div>
                          </div>
                          {member.isLeader && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/60">
                              <ShieldCheck size={10} />
                              Leader
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Sent by */}
              <DetailRow icon={Mail} label="Sent By">
                <ProfileRow
                  avatarUrl={detail.sentByAvatarUrl}
                  firstName={detail.sentByFirstName}
                  lastName={detail.sentByLastName}
                  email={detail.sentByEmail}
                />
              </DetailRow>

              {detail.description && (
                <>
                  <div className="border-t border-[#e8ecf0]" />
                  <DetailRow icon={Mail} label="Description">
                    <p className="whitespace-pre-wrap text-[14px] text-[#1f2f3a]">{detail.description}</p>
                  </DetailRow>
                </>
              )}

              <div className="border-t border-[#e8ecf0]" />

              {/* Dates */}
              <DetailRow icon={Calendar} label="Created">
                <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(detail.createdAt)}</p>
              </DetailRow>

              {detail.limitTime && (
                <DetailRow icon={Clock} label="Expires">
                  <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(detail.limitTime)}</p>
                </DetailRow>
              )}

              {detail.updatedAt && detail.updatedAt !== detail.createdAt && (
                <DetailRow icon={Clock} label="Updated">
                  <p className="text-[14px] text-[#1f2f3a]">{formatDateTime(detail.updatedAt)}</p>
                </DetailRow>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#e8ecf0] px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d47a1]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
