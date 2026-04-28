import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ErrorAlert, SuccessAlert } from '../components/Utils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSuccess('')

    try {
      await login(email, password)
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {localError && <ErrorAlert message={localError} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="text-sm font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Buyer: buyer1@ecommerce.com / Buyer123@</p>
          <p className="text-xs text-gray-600">Seller: seller1@ecommerce.com / Seller123@</p>
          <p className="text-xs text-gray-600">Admin: admin@ecommerce.com / Admin123@</p>
        </div>
      </div>
    </div>
  )
}
