import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="flex grow flex-col items-center justify-center gap-4 px-6 py-12">
      <h1>Hello Vite!</h1>
      <p>
        React Router configured with senior best practices.
      </p>
      <Link
        to="/about"
        className="rounded-md border border-[var(--accent)] px-4 py-2 font-medium text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white"
      >
        Learn more →
      </Link>
    </div>
  )
}

