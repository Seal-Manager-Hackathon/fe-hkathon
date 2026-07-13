import { useState } from 'react'
import { X, Send } from 'lucide-react'
import { sendStudentTeamInvitation } from '../../../api/student'
import { toast } from '../../../utils/toast'

export default function InviteModal({ teamId, open, onClose, onSent }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open || !teamId) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { toast.error('Email không được để trống'); return }
    setSubmitting(true)
    try {
      await sendStudentTeamInvitation(teamId, email.trim())
      setEmail('')
      onSent()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể gửi lời mời.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e8ecf0] px-6 py-4">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e3f2fd]"><Send className="h-5 w-5 text-[#1565c0]" /></div><h3 className="text-[16px] font-bold text-[#1f2f3a]">Invite Member</h3></div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1f2f3a]">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@email.com" className="w-full rounded-lg border border-[#d7e0e5] px-3 py-2.5 text-[14px] text-[#1f2f3a] outline-none placeholder:text-[#8a9ba6] focus:border-[#1565c0]" autoFocus />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-[#d7e0e5] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1f2f3a] hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="cursor-pointer rounded-lg bg-[#1565c0] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0d47a1] disabled:opacity-50">{submitting ? 'Sending...' : 'Send Invitation'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
