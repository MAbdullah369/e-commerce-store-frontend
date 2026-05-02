import { useState, useContext } from 'react'
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiShield, FiShoppingBag, FiInfo, FiCheck, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, loading, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  if (user) {
    const destination = location.state?.from?.pathname
    if (destination) return <Navigate to={destination} replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLocalError(''); setSuccess('')
    try {
      const loggedInUser = await login(email, password)
      setSuccess('Login successful! Redirecting...')
      const destination = location.state?.from?.pathname
      setTimeout(() => {
        if (destination) navigate(destination, { replace: true })
        else if (loggedInUser.role === 'admin') navigate('/admin', { replace: true })
        else if (loggedInUser.role === 'seller') navigate('/seller', { replace: true })
        else navigate('/', { replace: true })
      }, 800)
    } catch (err) { setLocalError(err.response?.data?.error || 'Login failed. Please check your credentials.') }
  }

  const demoAccounts = [
    { role: 'Buyer', email: 'buyer1@ecommerce.com', password: 'Buyer123@', icon: FiShoppingBag, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { role: 'Seller', email: 'seller1@ecommerce.com', password: 'Seller123@', icon: FiUser, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { role: 'Admin', email: 'admin@ecommerce.com', password: 'Admin123@', icon: FiShield, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center py-12 px-4">
      <div className="flex flex-col gap-8 w-full max-w-5xl animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <FiLock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to your account</p>
            </div>

            {localError && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{localError}</span></div>}
            {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700">{success}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5 text-gray-400" /> Email Address</label>
                <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
              </div>
              <div>
                <label className="label flex items-center gap-1.5"><FiLock className="w-3.5 h-3.5 text-gray-400" /> Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input-field pr-12" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">
                    {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><FiLoader className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
            </p>
          </div>

          {/* Demo Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                  <FiUser className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Demo Accounts</h3>
                <p className="text-gray-500 text-sm mt-1">Click any role to test</p>
              </div>
              <div className="space-y-3">
                {demoAccounts.map((demo) => (
                  <button key={demo.role} onClick={() => { setEmail(demo.email); setPassword(demo.password) }} className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <demo.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 text-sm">{demo.role}</p>
                      <p className="text-xs text-gray-500 font-mono">{demo.email}</p>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-6 border border-primary-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0"><FiInfo className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">What can you do?</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-gray-600">
                    {['Browse products', 'Add to cart', 'Place orders', 'Track orders', 'Manage wishlist', 'Update profile'].map(item => (
                      <div key={item} className="flex items-center gap-1.5"><FiCheck className="w-3.5 h-3.5 text-primary-500" /> {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}