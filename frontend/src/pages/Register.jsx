// Register.jsx — Premium Redesign
import { useState, useContext } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiPackage, FiArrowRight, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'buyer' })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')
  const { register, loading, user } = useContext(AuthContext)
  const navigate = useNavigate()

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'seller') return <Navigate to="/seller" replace />
    return <Navigate to="/" replace />
  }

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLocalError(''); setSuccess('')
    if (formData.password !== formData.confirmPassword) { setLocalError('Passwords do not match'); return }
    if (formData.password.length < 6) { setLocalError('Password must be at least 6 characters'); return }
    try {
      const newUser = await register(formData.name, formData.email, formData.password, formData.confirmPassword, formData.role)
      setSuccess('Account created! Redirecting...')
      setTimeout(() => { if (newUser.role === 'seller') navigate('/seller', { replace: true }); else navigate('/', { replace: true }) }, 1000)
    } catch (err) { setLocalError(err.response?.data?.error || 'Registration failed.') }
  }

  const getPasswordStrength = () => {
    const p = formData.password; if (!p) return { level: 0, label: '', color: 'bg-gray-200 dark:bg-gray-800' }
    let score = 0; if (p.length >= 6) score++; if (p.length >= 8) score++; if (/[A-Z]/.test(p)) score++; if (/[0-9]/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' }
    if (score <= 3) return { level: score, label: 'Fair', color: 'bg-amber-500' }
    return { level: score, label: 'Strong', color: 'bg-emerald-500' }
  }
  const strength = getPasswordStrength()

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[520px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/30">
            <span className="text-white font-black text-2xl">λ</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Already have one? <Link to="/login" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Sign in</Link></p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0c0c14] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-black/40 p-8">

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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-3">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'buyer', label: 'Shop & Buy', icon: FiShoppingBag, desc: 'Browse & purchase products' },
                  { value: 'seller', label: 'Sell Products', icon: FiPackage, desc: 'List & manage your shop' },
                ].map(({ value, label, icon: Icon, desc }) => (
                  <label key={value} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${formData.role === value
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-gray-100 dark:border-white/8 hover:border-gray-200 dark:hover:border-white/15'
                    }`}>
                    <input type="radio" name="role" value={value} checked={formData.role === value} onChange={handleChange} className="hidden" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.role === value ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-gray-100 dark:bg-white/8 text-gray-400 dark:text-gray-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={`text-[13px] font-bold ${formData.role === value ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {formData.role === 'seller' && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2.5 flex items-start gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-2 rounded-xl">
                  <span className="mt-0.5">⚡</span> You'll need to list at least 3 products to activate your shop.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input type="text" name="name" className={`${inputClass} pl-11`} value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input type="email" name="email" className={`${inputClass} pl-11`} value={formData.email} onChange={handleChange} required placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} name="password" className={`${inputClass} pl-11 pr-12`} value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-200 dark:bg-gray-800'}`} />)}
                  </div>
                  <p className="text-[11px] text-gray-400">Password strength: <span className={`font-bold ${strength.level <= 2 ? 'text-red-500' : strength.level <= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>{strength.label}</span></p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input type="password" name="confirmPassword" className={`${inputClass} pl-11 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 dark:border-red-500/40' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-emerald-300 dark:border-emerald-500/40' : ''}`} value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" autoComplete="new-password" />
                {formData.confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <span className="text-red-400 text-xs">✗</span>}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Account <FiArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}