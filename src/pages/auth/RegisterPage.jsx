import BrandLogo from '../../components/BrandLogo'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, User, ArrowLeft, Loader2 } from 'lucide-react'
import { register } from '../../api/auth'
import { parseError } from '../../utils/error'
import { toast } from '../../utils/toast'
import PasswordInput from '../../components/PasswordInput'

const UNVERIFIED_MSG = 'Unverified Account Please Login To Verify'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function clearErrors() {
    setErrors({})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!firstName || !lastName || !email || !password || password !== confirm) return

    clearErrors()
    setLoading(true)

    try {
      await register({ email, password, firstName, lastName })
      toast.success('Registration successful! Please check your email to verify your account.')
      navigate('/login')
    } catch (err) {
      const { message, errors: fieldErrors } = parseError(err)

      if (message === UNVERIFIED_MSG) {
        toast.warning('This email is already registered but not verified. Please log in to resend the verification email.')
        navigate('/login')
        return
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const isValid = firstName && lastName && email && password && password === confirm
  const confirmError = confirm && password !== confirm ? 'Passwords do not match' : ''

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

        <h2 className="mb-1 text-center text-[24px] font-bold text-[#1f2f3a]">Create an account</h2>
        <p className="mb-6 text-center text-[14px] text-gray-500">Join SEAL Hackathon and start building</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">First name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearErrors() }}
                  placeholder="John"
                  className={`input-icon ${errors.firstName ? 'input-error' : ''}`}
                />
              </div>
              {errors.firstName && <p className="mt-1 text-[12px] text-red-500">{errors.firstName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">Last name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); clearErrors() }}
                  placeholder="Doe"
                  className={`input-icon ${errors.lastName ? 'input-error' : ''}`}
                />
              </div>
              {errors.lastName && <p className="mt-1 text-[12px] text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErrors() }}
                placeholder="you@example.com"
                className={`input-icon ${errors.email ? 'input-error' : ''}`}
              />
            </div>
            {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearErrors() }}
            placeholder="••••••••"
            error={errors.password}
          />

          <PasswordInput
            label="Confirm password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); clearErrors() }}
            placeholder="••••••••"
            error={confirmError}
          />

          <button
            type="submit"
            disabled={!isValid || loading}
            className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#064f5d] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
