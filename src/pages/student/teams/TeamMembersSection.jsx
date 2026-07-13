import { Crown, Shield, UserMinus } from 'lucide-react'
import Avatar from '../../../components/Avatar'

export default function TeamMembersSection({ members, teamId, isCurrentUserLeader, onKick }) {
  return (
    <div className="space-y-3">
      {members && members.length > 0 ? (
        members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between rounded-xl border border-[#e8ecf0] bg-white px-4 py-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar src={member.avatarUrl} name={`${member.firstName} ${member.lastName}`} size="h-9 w-9" textSize="text-[13px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-semibold text-[#1f2f3a]">{member.firstName} {member.lastName}</p>
                  {member.isLeader && <Crown size={12} className="shrink-0 text-[#f59e0b]" />}
                </div>
                <p className="truncate text-[12px] text-[#8a9ba6]">{member.email}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {member.isLeader && <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3e0] px-2.5 py-1 text-[11px] font-semibold text-[#e65100]"><Shield size={11} /> Leader</span>}
              {isCurrentUserLeader && !member.isLeader && (
                <button type="button" onClick={() => onKick(member.userId)} title="Kick member" className="cursor-pointer rounded-lg bg-[#fce4ec] p-1.5 text-[#c62828] transition-colors hover:bg-[#f8bbd0]"><UserMinus size={14} /></button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-[13px] text-[#7a8e99]">No members found.</p>
      )}
    </div>
  )
}
