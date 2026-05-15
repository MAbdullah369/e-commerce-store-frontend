// Login.jsx — Premium Redesign
import { useState, useContext } from 'react'
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiShield, FiShoppingBag, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi'

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
    const dest = location.state?.from?.pathname
    if (dest) return <Navigate to={dest} replace />
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLocalError(''); setSuccess('')
    try {
      const loggedInUser = await login(email, password)
      setSuccess('Welcome back! Redirecting...')
      const dest = location.state?.from?.pathname
      setTimeout(() => {
        if (dest) navigate(dest, { replace: true })
        else if (loggedInUser.role === 'admin') navigate('/admin', { replace: true })
        else if (loggedInUser.role === 'seller') navigate('/seller', { replace: true })
        else navigate('/', { replace: true })
      }, 800)
    } catch (err) { setLocalError(err.response?.data?.error || 'Invalid credentials. Please try again.') }
  }

  const demoAccounts = [
    { role: 'Buyer', email: 'buyer1@ecommerce.com', password: 'Buyer123@', icon: FiShoppingBag, color: 'from-blue-500 to-cyan-500', desc: 'Shop & order products' },
    { role: 'Seller', email: 'seller1@ecommerce.com', password: 'Seller123@', icon: FiUser, color: 'from-emerald-500 to-teal-500', desc: 'Manage your storefront' },
    { role: 'Admin', email: 'admin@ecommerce.com', password: 'Admin123@', icon: FiShield, color: 'from-violet-500 to-purple-600', desc: 'Full platform access' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-indigo-400/10 rounded-full blur-[60px]" />

        <div className="relative flex flex-col justify-between p-12 text-white">
          <div>
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2">
              <span className="font-black text-xl">λ</span>
            </div>
            <span className="font-black text-xl">LuxeStore</span>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-violet-300 mb-4">The Premium Way to Shop</p>
            <h2 className="text-4xl font-black leading-tight tracking-[-1.5px] mb-6">
              Everything you need,<br />curated for you.
            </h2>
            <div className="space-y-3">
              {['50,000+ premium products', 'Trusted by 12,000+ buyers', 'Free delivery over $50', '30-day easy returns'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-3 h-3" />
                  </div>
                  <span className="text-sm text-white/80 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — forms */}
      <div className="flex-1 flex flex-col lg:max-w-[640px] overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-12">
          <div className="max-w-[420px] mx-auto w-full">

            {/* Header */}
            <div className="mb-8">
              <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">Welcome back</p>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Sign in to your account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">New here? <Link to="/register" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Create an account</Link></p>
            </div>

            {/* Alerts */}
            {localError && (
              <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6">
                <FiAlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700 dark:text-red-400 font-medium">{localError}</span>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-6">
                <FiCheck className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input type="email" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <FiArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Try a demo account</p>
              <div className="space-y-2.5">
                {demoAccounts.map((demo) => (
                  <button key={demo.role} onClick={() => { setEmail(demo.email); setPassword(demo.password) }} className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/8 hover:border-gray-200 dark:hover:border-white/15 hover:bg-gray-50/80 dark:hover:bg-white/3 transition-all duration-200 group text-left">
                    <div className={`w-9 h-9 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <demo.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-[13px]">{demo.role}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{demo.desc}</p>
                    </div>
                    <FiArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}