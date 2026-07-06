import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="back-link">
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
    // Already handled by NotFoundPage
    return <NotFoundPage />
  }

  return (
    <div className="not-found-page">
      <h1>Oops</h1>
      <p>Something went wrong while loading this page.</p>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </div>
  )
}
