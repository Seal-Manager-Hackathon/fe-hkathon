import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import RouteFallback from '../RouteFallback'

/**
 * Route guard for student-facing public pages.
 *
 * Allows access only for:
 *   - Guests (not authenticated)
 *   - Students
 *
 * If an authenticated user with a non-student role (Admin, Staff, Lecturer)
 * tries to access a student page, they are redirected to their own dashboard.
 */
export default function GuestOrStudentRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()

  // 1. Auth still resolving from localStorage
  if (loading) {
    return <RouteFallback />
  }

  // 2. Authenticated but not a student → redirect to role dashboard
  if (isAuthenticated && user.role !== 'Student') {
    const dashboards = {
      Admin: '/admin',
      Staff: '/staff',
      Lecturer: '/lecture',
    }
    return <Navigate to={dashboards[user.role] || '/'} replace />
  }

  // 3. Guest or Student — allow
  return children
}
