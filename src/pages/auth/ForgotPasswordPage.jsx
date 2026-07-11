import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2, Send, CheckCircle } from 'lucide-react'
import { forgotPassword } from '../../api/auth'
import { getErrorMessage } from '../../utils/error'
import { toast } from '../../utils/toast'

import BrandLogo from '../../components/BrandLogo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg?.toLowerCase().includes('email')) {
        toast.error(msg)
      } else {
        // Always show generic success to prevent email enumeration
        setSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
      <Link
        to="/"
        className="fixed left-6 top-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-[#064f5d] shadow-sm transition-colors hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-sm">
        <BrandLogo className="mb-8" />

        {sent ? (
          /* ── Success state ── */
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9]">
              <CheckCircle className="h-8 w-8 text-[#2e7d32]" />
            </div>
            <h2 className="mb-1 text-center text-[24px] font-bold text-[#1f2f3a]">Check your email</h2>
            <p className="mb-2 text-center text-[14px] text-gray-500">
              If an account with <strong className="text-[#064f5d]">{email}</strong> exists,
              we&apos;ve sent a password reset link. It expires in 2 minutes.
            </p>
            <p className="mb-6 text-center text-[13px] text-gray-400">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSent(false)}
                className="cursor-pointer font-semibold text-[#064f5d] hover:underline"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b]"
            >
              ← Back to Sign In
            </Link>
          </>
        ) : (
          /* ── Form state ── */
          <>
            <h2 className="mb-1 text-center text-[24px] font-bold text-[#1f2f3a]">Forgot password?</h2>
            <p className="mb-6 text-center text-[14px] text-gray-500">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-icon"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || loading}
                className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <p className="mt-6 text-center text-[14px] text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="font-semibold text-[#064f5d] hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
