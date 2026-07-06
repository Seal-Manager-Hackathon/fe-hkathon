import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex grow flex-col items-center justify-center gap-3 px-6 py-12">
      <h1 className="!text-8xl !tracking-[-3px]">404</h1>
      <p className="text-lg text-[var(--text)]">Page not found.</p>
      <Link
        to="/"
        className="mt-2 font-medium text-[var(--accent)] hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  )
}

/**
 * Route-level error boundary component.
 * Attached to specific routes that need custom error UI.
 */
export function NotFoundPageErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }

  return (
    <div className="flex grow flex-col items-center justify-center gap-3 px-6 py-12">
      <h1>Oops</h1>
      <p>Something went wrong while loading this page.</p>
      <Link
        to="/"
        className="mt-2 font-medium text-[var(--accent)] hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  )
}

