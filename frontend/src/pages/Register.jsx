import { useState, useContext } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiPackage, FiAlertTriangle, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

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
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => { if (newUser.role === 'seller') navigate('/seller', { replace: true }); else navigate('/', { replace: true }) }, 1000)
    } catch (err) { setLocalError(err.response?.data?.error || 'Registration failed.') }
  }

  const getPasswordStrength = () => {
    const p = formData.password; if (!p) return { level: 0, label: '', color: '' }
    let score = 0; if (p.length >= 6) score++; if (p.length >= 8) score++; if (/[A-Z]/.test(p)) score++; if (/[0-9]/.test(p)) score++; if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' }
    if (score <= 3) return { level: score, label: 'Medium', color: 'bg-amber-500' }
    return { level: score, label: 'Strong', color: 'bg-emerald-500' }
  }
  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-accent-50/30 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 w-full max-w-md border border-gray-100 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <FiUser className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join our shopping community</p>
        </div>

        {localError && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{localError}</span></div>}
        {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700">{success}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="label flex items-center gap-1.5"><FiUser className="w-3.5 h-3.5 text-gray-400" /> Full Name</label><input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required placeholder="John Doe" /></div>
          <div><label className="label flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5 text-gray-400" /> Email</label><input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required placeholder="you@example.com" autoComplete="email" /></div>
          <div>
            <label className="label flex items-center gap-1.5"><FiLock className="w-3.5 h-3.5 text-gray-400" /> Password</label>
            <div className="relative"><input type={showPassword ? 'text' : 'password'} name="password" className="input-field pr-12" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1">{showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}</button></div>
            {formData.password && <div className="mt-2"><div className="flex gap-1 mb-1">{[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />)}</div><p className="text-xs text-gray-500">Strength: <span className={`font-semibold ${strength.level <= 2 ? 'text-red-500' : strength.level <= 3 ? 'text-amber-500' : 'text-emerald-500'}`}>{strength.label}</span></p></div>}
          </div>
          <div><label className="label flex items-center gap-1.5"><FiLock className="w-3.5 h-3.5 text-gray-400" /> Confirm Password</label><input type="password" name="confirmPassword" className="input-field" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" autoComplete="new-password" /></div>

          <div>
            <label className="label">Register As</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.role === 'buyer' ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="buyer" checked={formData.role === 'buyer'} onChange={handleChange} className="hidden" />
                <FiShoppingBag className={`w-5 h-5 ${formData.role === 'buyer' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${formData.role === 'buyer' ? 'text-primary-700' : 'text-gray-600'}`}>Buyer</span>
              </label>
              <label className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${formData.role === 'seller' ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="seller" checked={formData.role === 'seller'} onChange={handleChange} className="hidden" />
                <FiPackage className={`w-5 h-5 ${formData.role === 'seller' ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={`font-semibold text-sm ${formData.role === 'seller' ? 'text-primary-700' : 'text-gray-600'}`}>Seller</span>
              </label>
            </div>
            {formData.role === 'seller' && <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200"><FiAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> Publish at least 3 products to activate your shop.</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><FiLoader className="w-5 h-5 animate-spin" /> Creating...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}