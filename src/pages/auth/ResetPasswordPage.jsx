import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Lock, CheckCircle, XCircle } from 'lucide-react'
import { resetPassword } from '../../api/auth'
import { getErrorMessage } from '../../utils/error'
import { toast } from '../../utils/toast'
import PasswordInput from '../../components/PasswordInput'

import BrandLogo from '../../components/BrandLogo'

const TOKEN_ERROR_MSG = 'Invalid Or Expired Email Verification Token'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const confirmError = confirm && password !== confirm ? 'Passwords do not match' : ''

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password || password !== confirm || !token) return
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)

    try {
      await resetPassword({ token, newPassword: password })
      setDone(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg === TOKEN_ERROR_MSG || msg?.toLowerCase().includes('invalid or expired')) {
        toast.error('This reset link is invalid or has expired. Please request a new one.')
      } else if (msg?.toLowerCase().includes('must be different')) {
        toast.error('New password must be different from your old password.')
      } else if (msg?.toLowerCase().includes('user not found')) {
        toast.error('Something went wrong. Please try again.')
      } else {
        toast.error(msg || 'Failed to reset password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ── No token provided ── */
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
        <Link
          to="/"
          className="fixed left-6 top-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-[#064f5d] shadow-sm transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-sm text-center">
          <BrandLogo className="mb-8" />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce4ec]">
            <XCircle className="h-8 w-8 text-[#c62828]" />
          </div>
          <h2 className="mb-1 text-[24px] font-bold text-[#1f2f3a]">Invalid link</h2>
          <p className="mb-6 text-[14px] text-gray-500">
            No reset token found in the URL. Please check your email for the full reset link.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b]"
          >
            Request new link
          </Link>
        </div>
      </div>
    )
  }

  /* ── Success ── */
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-sm text-center">
          <BrandLogo className="mb-8" />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9]">
            <CheckCircle className="h-8 w-8 text-[#2e7d32]" />
          </div>
          <h2 className="mb-1 text-[24px] font-bold text-[#1f2f3a]">Password reset!</h2>
          <p className="mb-6 text-[14px] text-gray-500">
            Your password has been updated successfully. Redirecting to sign in...
          </p>
          <Link
            to="/login"
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
      <Link
        to="/login"
        className="fixed left-6 top-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-[#064f5d] shadow-sm transition-colors hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-sm">
        <BrandLogo className="mb-8" />

        <h2 className="mb-1 text-center text-[24px] font-bold text-[#1f2f3a]">Set new password</h2>
        <p className="mb-6 text-center text-[14px] text-gray-500">
          Enter your new password below (min. 6 characters).
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
          />

          <PasswordInput
            label="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            error={confirmError}
            icon={Lock}
          />

          <button
            type="submit"
            disabled={!password || !confirm || password !== confirm || loading || password.length < 6}
            className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  )
}
