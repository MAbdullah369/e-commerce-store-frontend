import { useState, useContext } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, loading, user } = useContext(AuthContext)
  const navigate = useNavigate()

  // If already logged in, redirect based on role
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccess('')
    try {
      const loggedInUser = await login(email, password)
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        if (loggedInUser?.role === 'admin') navigate('/admin')
        else if (loggedInUser?.role === 'seller') navigate('/seller')
        else navigate('/')
      }, 1000)
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="flex flex-col gap-8 w-full max-w-4xl">

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Sign In</h2>

          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {localError}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-semibold mb-2 text-blue-900">Demo Credentials</p>
            <p className="text-xs text-gray-600">🛒 Buyer: buyer1@ecommerce.com / Buyer123@</p>
            <p className="text-xs text-gray-600">🏪 Seller: seller1@ecommerce.com / Seller123@</p>
            <p className="text-xs text-gray-600">⚙️ Admin: admin@ecommerce.com / Admin123@</p>
          </div>
        </div>

        {/* Role info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-blue-600">🛒 Buyer</h3>
            <p className="text-xs text-gray-500 font-semibold mb-2">After Login:</p>
            <p className="text-sm text-gray-600">✓ Add items to cart</p>
            <p className="text-sm text-gray-600">✓ Place and track orders</p>
            <p className="text-sm text-gray-600">✓ Manage wishlist</p>
            <p className="text-xs text-gray-500 font-semibold mt-3 mb-1">Without Login:</p>
            <p className="text-sm text-red-500">✗ Cannot buy or checkout</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-green-600">🏪 Seller</h3>
            <p className="text-xs text-gray-500 font-semibold mb-2">After Login:</p>
            <p className="text-sm text-gray-600">✓ Access seller dashboard</p>
            <p className="text-sm text-gray-600">✓ Create & manage shop</p>
            <p className="text-sm text-gray-600">✓ List and sell products</p>
            <p className="text-xs text-gray-500 font-semibold mt-3 mb-1">Requirement:</p>
            <p className="text-sm text-yellow-600">⚠ Must publish 3+ products to activate shop</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-purple-600">⚙️ Admin</h3>
            <p className="text-xs text-gray-500 font-semibold mb-2">After Login:</p>
            <p className="text-sm text-gray-600">✓ Access admin dashboard</p>
            <p className="text-sm text-gray-600">✓ Manage users & sellers</p>
            <p className="text-sm text-gray-600">✓ Manage categories & products</p>
            <p className="text-sm text-gray-600">✓ View platform statistics</p>
          </div>
        </div>

        {/* Anonymous info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-base font-bold mb-2 text-amber-800">Browsing without an account?</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-green-700">✓ Browse all products</p>
            <p className="text-green-700">✓ View product details & reviews</p>
            <p className="text-red-600">✗ Cannot add to cart</p>
            <p className="text-red-600">✗ Cannot checkout or place orders</p>
          </div>
        </div>

      </div>
    </div>
  )
}