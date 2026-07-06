import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import { verifyEmail } from '../../api/auth'
import { parseError } from '../../utils/error'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading') // loading | success | already-verified | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token provided.')
      return
    }

    let cancelled = false

    async function verify() {
      try {
        const result = await verifyEmail({ token })
        if (cancelled) return

        if (result.accessToken) {
          // First-time verify — save tokens and redirect to home
          localStorage.setItem('token', result.accessToken)
          if (result.refreshToken) {
            localStorage.setItem('refreshToken', result.refreshToken)
          }
          setStatus('success')
          setTimeout(() => navigate('/'), 2000)
        } else {
          // Already verified — no tokens returned
          setStatus('already-verified')
        }
      } catch (err) {
        if (cancelled) return
        const { message } = parseError(err)
        setStatus('error')
        setErrorMessage(message || 'Verification failed. Please try again.')
      }
    }

    verify()
    return () => { cancelled = true }
  }, [token, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
      <Link
        to="/"
        className="fixed left-6 top-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[14px] font-semibold text-[#064f5d] shadow-sm transition-colors hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-[440px] rounded-2xl bg-white p-10 shadow-sm text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 items-center justify-center rounded-md bg-[#064f5d] px-3 text-base font-extrabold text-white">
            SEAL
          </div>
          <span className="text-xl font-bold text-[#064f5d]">Hackathon</span>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f2fd]">
              <Loader2 className="h-8 w-8 animate-spin text-[#1565c0]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1f2f3a]">Verifying your email</h2>
            <p className="mt-2 text-[14px] text-gray-500">Please wait while we confirm your email address...</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9]">
              <CheckCircle className="h-8 w-8 text-[#2e7d32]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1f2f3a]">Email verified!</h2>
            <p className="mt-2 text-[14px] text-gray-500">
              Your account has been verified successfully. Redirecting you to the homepage...
            </p>
          </>
        )}

        {/* Already verified */}
        {status === 'already-verified' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f2fd]">
              <CheckCircle className="h-8 w-8 text-[#1565c0]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1f2f3a]">Already verified</h2>
            <p className="mt-2 text-[14px] text-gray-500">
              Your email has already been verified. You can sign in to your account.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#05404a]"
            >
              Go to Sign In
            </Link>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce4ec]">
              <XCircle className="h-8 w-8 text-[#c62828]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#1f2f3a]">Verification failed</h2>
            <p className="mt-2 text-[14px] text-gray-500">
              {errorMessage}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-5 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
              >
                Back to Home
              </Link>
              <Link
                to="/login"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
