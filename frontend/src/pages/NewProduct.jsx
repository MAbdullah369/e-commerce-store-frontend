import { useState, useContext } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI } from '../services/api'

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
  'Books',
  'Toys & Games',
  'Beauty & Personal Care',
  'Groceries',
  'Automotive',
  'Other',
]

export default function NewProduct() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    isPublished: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'seller') return <Navigate to="/" replace />

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError('Please fill in all required fields')
      return
    }
    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0')
      return
    }
    if (Number(formData.stock) < 0) {
      setError('Stock cannot be negative')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0,
        image: formData.image || '',
        isPublished: formData.isPublished,
      }

      await sellerAPI.createProduct(payload)

      setSuccess(
        formData.isPublished
          ? 'Product created and published successfully!'
          : 'Product saved as draft successfully!'
      )

      setTimeout(() => navigate('/seller'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white transition"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5"

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/seller"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to list a new product in your shop</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            ⚠ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">

            {/* Product Name */}
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                name="name"
                className={inputClass}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Bluetooth Headphones"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                className={inputClass}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your product — features, materials, dimensions, etc."
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    name="price"
                    className={`${inputClass} pl-8`}
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  className={inputClass}
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                className={inputClass}
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className={labelClass}>Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="url"
                name="image"
                className={inputClass}
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
              />
              {formData.image && (
                <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
            </div>

            {/* Publish toggle */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="isPublished" className="text-sm font-semibold text-blue-900 cursor-pointer">
                  Publish immediately
                </label>
                <p className="text-xs text-blue-700 mt-0.5">
                  Published products are visible in the store. You need at least 3 published products to activate your shop.
                  Leave unchecked to save as a draft first.
                </p>
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Saving...'
                : formData.isPublished
                  ? '🚀 Create & Publish'
                  : '💾 Save as Draft'}
            </button>

            <Link
              to="/seller"
              className="flex-1 text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </div>
  )
}