// ProtectedRoute.jsx — Premium Redesign
import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#07070d]">
        <div className="relative mb-6">
          <div className="w-14 h-14 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" />
          <div className="absolute inset-0 w-14 h-14 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" />
          <div className="absolute top-2 left-2 w-10 h-10 border-[3px] border-indigo-400/30 rounded-full animate-spin border-b-transparent" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 tracking-wide">Authenticating...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />

  return children
}