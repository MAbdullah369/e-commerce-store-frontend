import { useContext, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { FiMapPin, FiCreditCard, FiPhone, FiCheck, FiLoader, FiShield, FiLock, FiAlertCircle, FiCheckCircle, FiShoppingCart } from 'react-icons/fi'

export default function Checkout() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', zipCode: user?.address?.zipCode || '', country: user?.address?.country || '', phone: user?.phone || '', paymentMethod: 'credit_card' })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white"><div className="relative"><div className="w-14 h-14 border-4 border-primary-100 rounded-full"></div><div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div></div>
  if (!user) return <Navigate to="/login" replace />

  const items = cart?.items || []
  if (items.length === 0) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center animate-fade-in"><div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><FiShoppingCart className="w-10 h-10 text-orange-500" /></div><p className="text-gray-600 mb-6 text-lg font-medium">Your cart is empty</p><button onClick={() => navigate('/products')} className="btn-primary px-8 py-3">Browse Products</button></div>
    </div>
  )

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country || !formData.phone) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      const orderData = { items: items.map(item => ({ productId: item.product._id, quantity: item.quantity, price: item.price })), shippingAddress: { street: formData.street, city: formData.city, state: formData.state, zipCode: formData.zipCode, country: formData.country, phone: formData.phone }, paymentMethod: formData.paymentMethod }
      const response = await orderAPI.createOrder(orderData)
      setSuccess('Order placed successfully! Redirecting...')
      await clearCart()
      setTimeout(() => navigate(`/orders/${response.data.order._id}`), 1500)
    } catch (err) { setError(err.response?.data?.error || 'Failed to place order.') }
    finally { setLoading(false) }
  }

  const paymentOptions = [
    { value: 'credit_card', label: 'Credit Card', icon: FiCreditCard },
    { value: 'debit_card', label: 'Debit Card', icon: FiCreditCard },
    { value: 'paypal', label: 'PayPal', icon: FiShield },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: FiLock },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"><FiCheck className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1><p className="text-gray-500 text-sm">Complete your order</p></div>
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500" /><span className="text-sm text-red-700">{error}</span></div>}
        {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-sm text-emerald-700">{success}</span></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"><FiMapPin className="w-4 h-4 text-white" /></div>
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div><label className="label">Street Address *</label><input type="text" name="street" className="input-field" value={formData.street} onChange={handleChange} placeholder="123 Main Street" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">City *</label><input type="text" name="city" className="input-field" value={formData.city} onChange={handleChange} /></div>
                  <div><label className="label">State *</label><input type="text" name="state" className="input-field" value={formData.state} onChange={handleChange} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">ZIP Code *</label><input type="text" name="zipCode" className="input-field" value={formData.zipCode} onChange={handleChange} /></div>
                  <div><label className="label">Country *</label><input type="text" name="country" className="input-field" value={formData.country} onChange={handleChange} /></div>
                </div>
                <div><label className="label flex items-center gap-1.5"><FiPhone className="w-3.5 h-3.5 text-gray-400" /> Phone *</label><input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center"><FiCreditCard className="w-4 h-4 text-white" /></div>
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {paymentOptions.map(({ value, label, icon: Icon }) => (
                  <label key={value} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === value ? 'border-primary-500 bg-primary-50/30 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.paymentMethod === value ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}><Icon className="w-5 h-5" /></div>
                    <span className="text-gray-700 font-medium text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 animate-fade-in-up delay-200">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-2 mb-5 pb-5 border-b border-gray-100 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm py-2">
                    <span className="text-gray-600">{item.product.name} <span className="text-gray-400 text-xs">×{item.quantity}</span></span>
                    <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">${cart?.totalPrice?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-emerald-600 font-semibold">Free</span></div>
              </div>
              <div className="flex justify-between text-xl font-extrabold mb-6">
                <span>Total</span>
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary py-3.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><FiLoader className="w-5 h-5 animate-spin" /> Processing...</> : 'Place Order'}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-400 text-xs"><FiLock className="w-3 h-3" /> Secured by 256-bit encryption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}