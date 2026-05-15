// NewProduct.jsx — Premium Redesign
import { useState, useEffect, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI, productAPI } from '../services/api'
import { FiArrowLeft, FiImage, FiDollarSign, FiTag, FiLayers, FiBox, FiSave, FiLoader, FiAlertCircle, FiCheckCircle, FiChevronDown } from 'react-icons/fi'

export default function NewProduct() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', image: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try { const res = await productAPI.getCategories(); setCategories(res.data) } catch { }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]"><div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'seller') return <Navigate to="/" replace />

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!formData.name || !formData.price || !formData.stock || !formData.category) { setError('Please fill in all required fields'); return }
    setLoading(true)
    try {
      await sellerAPI.createProduct({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) })
      setSuccess('Product created successfully! Redirecting...')
      setTimeout(() => navigate('/seller'), 1500)
    } catch (err) { setError(err.response?.data?.error || 'Failed to create product') }
    finally { setLoading(false) }
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"
  const labelClass = "block text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5"

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
        <button onClick={() => navigate('/seller')} className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Seller Tools</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Create New Product</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add a new item to your storefront</p>
        </div>

        <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-5"><FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}
          {success && <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-5"><FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{success}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input type="text" name="name" className={inputClass} value={formData.name} onChange={handleChange} required placeholder="e.g. Wireless Headphones Pro" />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" className={`${inputClass} min-h-[100px] resize-y`} value={formData.description} onChange={handleChange} placeholder="Describe your product in detail..." rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-semibold text-sm">$</span>
                  <input type="number" name="price" className={`${inputClass} pl-8`} value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="29.99" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Stock *</label>
                <input type="number" name="stock" className={inputClass} value={formData.stock} onChange={handleChange} required min="0" placeholder="100" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <div className="relative">
                <select name="category" className={`${inputClass} appearance-none pr-10`} value={formData.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Image URL</label>
              <input type="url" name="image" className={inputClass} value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              {formData.image && (
                <div className="mt-3 w-24 h-24 rounded-xl border border-gray-100 dark:border-white/8 overflow-hidden bg-gray-50 dark:bg-white/5">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Creating...</> : <><FiSave className="w-4 h-4" /> Create Product</>}
              </button>
              <button type="button" onClick={() => navigate('/seller')} className="px-6 py-3.5 border border-gray-200 dark:border-white/8 rounded-xl text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}