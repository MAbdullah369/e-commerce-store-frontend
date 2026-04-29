import { useContext, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'

export default function Checkout() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.phone || '',
    paymentMethod: 'credit_card',
  })

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }
  if (!user) return <Navigate to="/login" replace />

  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
      }

      const response = await orderAPI.createOrder(orderData)
      setSuccess('Order placed successfully! Redirecting...')
      await clearCart()
      setTimeout(() => {
        navigate(`/orders/${response.data.order._id}`)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Street Address *</label>
                  <input type="text" name="street" className={inputClass} value={formData.street} onChange={handleChange} placeholder="123 Main St" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" name="city" className={inputClass} value={formData.city} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input type="text" name="state" className={inputClass} value={formData.state} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Zip Code *</label>
                    <input type="text" name="zipCode" className={inputClass} value={formData.zipCode} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>Country *</label>
                    <input type="text" name="country" className={inputClass} value={formData.country} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>

                <div>
                  <label className={labelClass}>Payment Method *</label>
                  <select name="paymentMethod" className={inputClass} value={formData.paymentMethod} onChange={handleChange}>
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="debit_card">💳 Debit Card</option>
                    <option value="paypal">🅿 PayPal</option>
                    <option value="upi">📱 UPI</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 mt-2"
                >
                  {loading ? 'Placing Order...' : '🛍 Place Order'}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

              <div className="space-y-2 mb-5 pb-5 border-b max-h-56 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5 pb-5 border-b text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}