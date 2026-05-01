import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

/**
 * ProtectedRoute — wraps pages that require authentication.
 *
 * Usage:
 *   <ProtectedRoute>                          // any logged-in user
 *   <ProtectedRoute requiredRole="seller">    // seller only
 *   <ProtectedRoute requiredRole="admin">     // admin only
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  // While AuthContext is restoring session from localStorage, show nothing
  // (prevents flash-redirect to /login on page refresh)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  // Not logged in at all → send to login, remember where they were going
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but wrong role → send home with an explanation
  if (requiredRole && user.role !== requiredRole) {
    // Admin trying to reach seller dashboard (or vice versa) → redirect to their own area
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/" replace />
  }

  return children
}