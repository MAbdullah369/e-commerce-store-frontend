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

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const handleProfileChange = (e) => { const { name, value } = e.target; if (name.startsWith('address.')) { const field = name.replace('address.', ''); setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } })) } else { setFormData(prev => ({ ...prev, [name]: value })) } }
  const handleProfileSubmit = async () => { setLoading(true); setError(''); setSuccess(''); try { await userAPI.updateProfile(formData); setSuccess('Profile updated!') } catch (err) { setError(err.response?.data?.error || 'Failed to update') } finally { setLoading(false) } }
  const handlePasswordChange = (e) => { const { name, value } = e.target; setPasswordForm(prev => ({ ...prev, [name]: value })) }
  const handlePasswordSubmit = async () => { if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError('Passwords do not match'); return }; setLoading(true); setError(''); setSuccess(''); try { await userAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword, confirmPassword: passwordForm.confirmPassword }); setSuccess('Password changed!'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) } catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) } }

  const roleConfig = { admin: { bg: 'from-violet-500 to-purple-500', badge: 'badge-purple' }, seller: { bg: 'from-emerald-500 to-teal-500', badge: 'badge-success' }, buyer: { bg: 'from-blue-500 to-cyan-500', badge: 'badge-info' } }
  const rc = roleConfig[user?.role] || roleConfig.buyer

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"><FiUser className="w-5 h-5 text-white" /></div>
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center h-fit animate-fade-in-up">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${rc.bg} mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1.5"><FiMail className="w-3.5 h-3.5" /> {user?.email}</p>
            <span className={`inline-block mt-3 ${rc.badge} uppercase`}>{user?.role}</span>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-200">
            {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{error}</span></div>}
            {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700">{success}</span></div>}

            {/* Profile Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><FiEdit3 className="w-5 h-5 text-primary-500" /> Edit Profile</h2>
              <div className="space-y-4">
                <div><label className="label">Full Name</label><input type="text" name="name" className="input-field" value={formData.name} onChange={handleProfileChange} /></div>
                <div><label className="label flex items-center gap-1.5"><FiPhone className="w-3.5 h-3.5 text-gray-400" /> Phone</label><input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleProfileChange} /></div>
                <div><label className="label flex items-center gap-1.5"><FiMapPin className="w-3.5 h-3.5 text-gray-400" /> Street</label><input type="text" name="address.street" className="input-field" value={formData.address?.street || ''} onChange={handleProfileChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">City</label><input type="text" name="address.city" className="input-field" value={formData.address?.city || ''} onChange={handleProfileChange} /></div>
                  <div><label className="label">State</label><input type="text" name="address.state" className="input-field" value={formData.address?.state || ''} onChange={handleProfileChange} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">Zip</label><input type="text" name="address.zipCode" className="input-field" value={formData.address?.zipCode || ''} onChange={handleProfileChange} /></div>
                  <div><label className="label">Country</label><input type="text" name="address.country" className="input-field" value={formData.address?.country || ''} onChange={handleProfileChange} /></div>
                </div>
                <button onClick={handleProfileSubmit} disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">{loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save Changes</button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><FiShield className="w-5 h-5 text-primary-500" /> Change Password</h2>
              <div className="space-y-4">
                <div><label className="label">Current Password</label><input type="password" name="currentPassword" className="input-field" value={passwordForm.currentPassword} onChange={handlePasswordChange} /></div>
                <div><label className="label">New Password</label><input type="password" name="newPassword" className="input-field" value={passwordForm.newPassword} onChange={handlePasswordChange} /></div>
                <div><label className="label">Confirm New Password</label><input type="password" name="confirmPassword" className="input-field" value={passwordForm.confirmPassword} onChange={handlePasswordChange} /></div>
                <button onClick={handlePasswordSubmit} disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60">{loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiLock className="w-4 h-4" />} Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}