import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiLoader } from 'react-icons/fi'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-accent-300 rounded-full animate-spin-slow border-b-transparent"></div>
        </div>
        <p className="mt-6 text-gray-500 font-medium tracking-wide">Authenticating...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}