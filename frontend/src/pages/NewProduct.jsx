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
    try { const res = await productAPI.getCategories(); setCategories(res.data) }
    catch (err) { console.error('Failed to load categories', err) }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="relative"><div className="w-14 h-14 border-4 border-primary-100 rounded-full"></div><div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'seller') return <Navigate to="/" replace />

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!formData.name || !formData.price || !formData.stock || !formData.category) { setError('Please fill in all required fields'); return }
    setLoading(true)
    try {
      await sellerAPI.createProduct({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) })
      setSuccess('Product created! Redirecting...')
      setTimeout(() => navigate('/seller'), 1500)
    } catch (err) { setError(err.response?.data?.error || 'Failed to create product') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/seller')} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 text-sm font-medium transition-colors animate-fade-in">
          <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-6">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <FiBox className="w-6 h-6" /> Create New Product
            </h1>
            <p className="text-white/80 text-sm mt-1">Add a new product to your shop</p>
          </div>

          <div className="p-8">
            {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{error}</span></div>}
            {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700">{success}</span></div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label flex items-center gap-1.5"><FiTag className="w-3.5 h-3.5 text-gray-400" /> Product Name *</label>
                <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required placeholder="e.g. Wireless Headphones" />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea name="description" className="input-field min-h-[100px] resize-y" value={formData.description} onChange={handleChange} placeholder="Describe your product..." rows={4} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-1.5"><FiDollarSign className="w-3.5 h-3.5 text-gray-400" /> Price *</label>
                  <input type="number" name="price" className="input-field" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="29.99" />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><FiBox className="w-3.5 h-3.5 text-gray-400" /> Stock *</label>
                  <input type="number" name="stock" className="input-field" value={formData.stock} onChange={handleChange} required min="0" placeholder="100" />
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><FiLayers className="w-3.5 h-3.5 text-gray-400" /> Category *</label>
                <div className="relative">
                  <select name="category" className="input-field appearance-none pr-10" value={formData.category} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><FiImage className="w-3.5 h-3.5 text-gray-400" /> Image URL</label>
                <input type="url" name="image" className="input-field" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                {formData.image && (
                  <div className="mt-3 w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><FiLoader className="w-5 h-5 animate-spin" /> Creating...</> : <><FiSave className="w-5 h-5" /> Create Product</>}
                </button>
                <button type="button" onClick={() => navigate('/seller')} className="px-6 py-3.5 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}