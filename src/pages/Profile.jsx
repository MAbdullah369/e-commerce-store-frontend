// Profile.jsx — Premium Redesign
import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { userAPI } from '../services/api'
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiShield, FiEdit3, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi'

export default function Profile() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || {} })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]"><div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div></div>
  if (!user) return <Navigate to="/login" replace />

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) { const field = name.replace('address.', ''); setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } })) }
    else setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handleProfileSubmit = async () => {
    setLoading(true); setError(''); setSuccess('')
    try { await userAPI.updateProfile(formData); setSuccess('Profile updated successfully!') }
    catch (err) { setError(err.response?.data?.error || 'Failed to update') } finally { setLoading(false) }
  }
  const handlePasswordChange = (e) => { const { name, value } = e.target; setPasswordForm(prev => ({ ...prev, [name]: value })) }
  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true); setError(''); setSuccess('')
    try { await userAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword, confirmPassword: passwordForm.confirmPassword }); setSuccess('Password changed!'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
    catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) }
  }

  const roleColors = { admin: 'from-violet-500 to-purple-600', seller: 'from-emerald-500 to-teal-600', buyer: 'from-blue-500 to-indigo-600' }
  const roleGrad = roleColors[user?.role] || roleColors.buyer

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"
  const labelClass = "block text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5"

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile card */}
          <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6 text-center h-fit">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleGrad} mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-xl`}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 flex items-center justify-center gap-1.5"><FiMail className="w-3.5 h-3.5" /> {user?.email}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${roleGrad} text-white shadow-sm`}>
              {user?.role}
            </span>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4"><FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}
            {success && <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4"><FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{success}</span></div>}

            {/* Edit profile */}
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <h2 className="text-sm font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2"><FiEdit3 className="w-4 h-4 text-violet-500" /> Edit Profile</h2>
              <div className="space-y-4">
                <div><label className={labelClass}>Full Name</label><input type="text" name="name" className={inputClass} value={formData.name} onChange={handleProfileChange} /></div>
                <div><label className={labelClass}>Phone</label><input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleProfileChange} /></div>
                <div><label className={labelClass}>Street Address</label><input type="text" name="address.street" className={inputClass} value={formData.address?.street || ''} onChange={handleProfileChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>City</label><input type="text" name="address.city" className={inputClass} value={formData.address?.city || ''} onChange={handleProfileChange} /></div>
                  <div><label className={labelClass}>State</label><input type="text" name="address.state" className={inputClass} value={formData.address?.state || ''} onChange={handleProfileChange} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>ZIP Code</label><input type="text" name="address.zipCode" className={inputClass} value={formData.address?.zipCode || ''} onChange={handleProfileChange} /></div>
                  <div><label className={labelClass}>Country</label><input type="text" name="address.country" className={inputClass} value={formData.address?.country || ''} onChange={handleProfileChange} /></div>
                </div>
                <button onClick={handleProfileSubmit} disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-60">
                  {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Changes
                </button>
              </div>
            </div>

            {/* Change password */}
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <h2 className="text-sm font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2"><FiShield className="w-4 h-4 text-violet-500" /> Change Password</h2>
              <div className="space-y-4">
                <div><label className={labelClass}>Current Password</label><input type="password" name="currentPassword" className={inputClass} value={passwordForm.currentPassword} onChange={handlePasswordChange} /></div>
                <div><label className={labelClass}>New Password</label><input type="password" name="newPassword" className={inputClass} value={passwordForm.newPassword} onChange={handlePasswordChange} /></div>
                <div><label className={labelClass}>Confirm New Password</label><input type="password" name="confirmPassword" className={inputClass} value={passwordForm.confirmPassword} onChange={handlePasswordChange} /></div>
                <button onClick={handlePasswordSubmit} disabled={loading} className="w-full bg-gray-900 dark:bg-white/8 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-white/12 transition-all disabled:opacity-60">
                  {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiLock className="w-4 h-4" />} Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}