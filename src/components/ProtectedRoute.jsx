import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RouteFallback from './RouteFallback'

/**
 * Route guard that checks authentication and optional role requirements.
 *
 * Props:
 *   roles  — optional array of allowed role values (e.g. ['Admin'], ['Staff', 'Admin'])
 *   children — content to render (if omitted, renders <Outlet /> for nested routes)
 *
 * Behavior:
 *   1. Shows full-screen loading spinner while auth is being resolved.
 *   2. Redirects unauthenticated users to /login.
 *   3. If `roles` is specified and the user's role isn't in it, redirects to /unauthorized.
 *   4. Otherwise renders children (or Outlet).
 */
export default function ProtectedRoute({ roles, children }) {
  const { user, loading, isAuthenticated } = useAuth()

  // 1. Auth still resolving from localStorage
  if (loading) {
    return <RouteFallback />
  }

  // 2. Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 3. Role mismatch
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 4. All good — render the protected content
  return children ?? <Outlet />
}
