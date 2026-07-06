import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return
    // TODO: call API
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
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 items-center justify-center rounded-md bg-[#064f5d] px-3 text-base font-extrabold text-white">
            SEAL
          </div>
          <span className="text-xl font-bold text-[#064f5d]">Hackathon</span>
        </div>

        <h2 className="mb-1 text-center text-[24px] font-bold text-[#1f2f3a]">
          Welcome back
        </h2>
        <p className="mb-6 text-center text-[14px] text-gray-500">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#d8e0e6] py-2.5 pl-10 pr-4 text-[15px] text-[#1f2f3a] placeholder-gray-400 outline-none transition-colors focus:border-[#064f5d]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-[14px] font-semibold text-[#1f2f3a]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#d8e0e6] py-2.5 pl-10 pr-4 text-[15px] text-[#1f2f3a] placeholder-gray-400 outline-none transition-colors focus:border-[#064f5d]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!email || !password}
            className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ffca28] px-6 py-3 text-[15px] font-semibold text-[#064f5d] transition-colors hover:bg-[#f5bf1b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#064f5d] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
