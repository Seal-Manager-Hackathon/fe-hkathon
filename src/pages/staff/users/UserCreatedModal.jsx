import { useState } from 'react'
import { UserPlus, X, Copy, Check } from 'lucide-react'

/**
 * Modal that shows created user credentials after successful creation.
 * @param {{ createdUser: object|null, onClose: () => void }} props
 */
export default function UserCreatedModal({ createdUser, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!createdUser) return null

  function handleCopy() {
    const text = `Email: ${createdUser.email}\nPassword: ${createdUser.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[92%] sm:max-w-[420px] rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f5e9]">
              <UserPlus className="h-5 w-5 text-[#2e7d32]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2f3a]">User Created</h3>
              <p className="text-[12px] text-gray-400">{createdUser.firstName} {createdUser.lastName} · {createdUser.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl border border-[#e8ecf0] bg-[#fafbfc] p-4 space-y-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Email</p>
              <p className="text-[15px] font-semibold text-[#1f2f3a] mt-0.5">{createdUser.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Password</p>
              <div className="mt-0.5 flex items-center gap-2">
                <code className="rounded-md bg-[#fff3e0] px-3 py-1 text-[15px] font-bold text-[#e65100]">{createdUser.password}</code>
                <button onClick={handleCopy} className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-[#064f5d]">
                  {copied ? <Check className="h-4 w-4 text-[#2e7d32]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Role</p>
              <p className="text-[14px] font-semibold text-[#1f2f3a] mt-0.5">{createdUser.role}</p>
            </div>
            {createdUser.college && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">College</p>
                <p className="text-[14px] font-semibold text-[#1f2f3a] mt-0.5">{createdUser.college}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[#e3f2fd] bg-[#e8f4fd] px-4 py-3 text-[13px] text-[#1565c0]">
            Copy the credentials and share with the user. Password is default, user should change it after first login.
          </div>
        </div>

        <div className="border-t border-[#f0f0f0] px-6 py-4">
          <button onClick={onClose} className="w-full cursor-pointer rounded-lg bg-[#064f5d] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">
            Done — Go to Users
          </button>
        </div>
      </div>
    </div>
  )
}
