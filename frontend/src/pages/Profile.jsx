import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { userAPI } from '../services/api'

export default function Profile() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {},
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '')
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleProfileSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await userAPI.updateProfile(formData)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })
      setSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    seller: 'bg-green-100 text-green-700',
    buyer: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center h-fit">
            <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase ${roleColors[user?.role] || 'bg-gray-100 text-gray-600'}`}>
              {user?.role}
            </span>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
            )}

            {/* Profile Form */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-5 text-gray-900">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" className={inputClass} value={formData.name} onChange={handleProfileChange} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleProfileChange} />
                </div>
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input type="text" name="address.street" className={inputClass} value={formData.address?.street || ''} onChange={handleProfileChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="address.city" className={inputClass} value={formData.address?.city || ''} onChange={handleProfileChange} />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" name="address.state" className={inputClass} value={formData.address?.state || ''} onChange={handleProfileChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Zip Code</label>
                    <input type="text" name="address.zipCode" className={inputClass} value={formData.address?.zipCode || ''} onChange={handleProfileChange} />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input type="text" name="address.country" className={inputClass} value={formData.address?.country || ''} onChange={handleProfileChange} />
                  </div>
                </div>
                <button
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Password Form */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-5 text-gray-900">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input type="password" name="currentPassword" className={inputClass} value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                </div>
                <div>
                  <label className={labelClass}>New Password</label>
                  <input type="password" name="newPassword" className={inputClass} value={passwordForm.newPassword} onChange={handlePasswordChange} />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input type="password" name="confirmPassword" className={inputClass} value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                </div>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-900 transition disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}