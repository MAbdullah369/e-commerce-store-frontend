// Checkout.jsx — Premium Redesign
import { useContext, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { FiMapPin, FiCreditCard, FiPhone, FiCheck, FiLoader, FiShield, FiLock, FiAlertCircle, FiCheckCircle, FiShoppingCart, FiArrowRight } from 'react-icons/fi'

export default function Checkout() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', zipCode: user?.address?.zipCode || '', country: user?.address?.country || '', phone: user?.phone || '', paymentMethod: 'credit_card' })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d]"><div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div></div>
  if (!user) return <Navigate to="/login" replace />

  const items = cart?.items || []
  if (items.length === 0) return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4"><FiShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-700" /></div>
        <p className="text-gray-500 dark:text-gray-400 mb-5 font-medium">Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-7 py-3 rounded-2xl font-bold text-sm hover:shadow-lg transition-all">Browse Products</button>
      </div>
    </div>
  )

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async () => {
    setError(''); setSuccess('')
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country || !formData.phone) { setError('Please fill in all required fields'); return }
    setLoading(true)
    try {
      const orderData = { items: items.map(item => ({ productId: item.product._id, quantity: item.quantity, price: item.price })), shippingAddress: { street: formData.street, city: formData.city, state: formData.state, zipCode: formData.zipCode, country: formData.country, phone: formData.phone }, paymentMethod: formData.paymentMethod }
      const response = await orderAPI.createOrder(orderData)
      setSuccess('Order placed! Redirecting...')
      await clearCart()
      setTimeout(() => navigate(`/orders/${response.data.order._id}`), 1500)
    } catch (err) { setError(err.response?.data?.error || 'Failed to place order.') }
    finally { setLoading(false) }
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"
  const labelClass = "block text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5"

  const paymentOptions = [
    { value: 'credit_card', label: 'Credit Card', icon: FiCreditCard },
    { value: 'debit_card', label: 'Debit Card', icon: FiCreditCard },
    { value: 'paypal', label: 'PayPal', icon: FiShield },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: FiLock },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Final Step</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Checkout</h1>
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6"><FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}
        {success && <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-6"><FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{success}</span></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center"><FiMapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" /></div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div><label className={labelClass}>Street Address *</label><input type="text" name="street" className={inputClass} value={formData.street} onChange={handleChange} placeholder="123 Main Street" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>City *</label><input type="text" name="city" className={inputClass} value={formData.city} onChange={handleChange} /></div>
                  <div><label className={labelClass}>State *</label><input type="text" name="state" className={inputClass} value={formData.state} onChange={handleChange} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>ZIP Code *</label><input type="text" name="zipCode" className={inputClass} value={formData.zipCode} onChange={handleChange} /></div>
                  <div><label className={labelClass}>Country *</label><input type="text" name="country" className={inputClass} value={formData.country} onChange={handleChange} /></div>
                </div>
                <div><label className={labelClass}>Phone *</label><input type="tel" name="phone" className={inputClass} value={formData.phone} onChange={handleChange} /></div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center"><FiCreditCard className="w-4 h-4 text-violet-600 dark:text-violet-400" /></div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map(({ value, label, icon: Icon }) => (
                  <label key={value} className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${formData.paymentMethod === value ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' : 'border-gray-100 dark:border-white/8 hover:border-gray-200 dark:hover:border-white/15'}`}>
                    <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="hidden" />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${formData.paymentMethod === value ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-white/8 text-gray-400 dark:text-gray-500'}`}><Icon className="w-4 h-4" /></div>
                    <span className={`text-[13px] font-semibold ${formData.paymentMethod === value ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6 sticky top-24">
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-5">Order Summary</h2>
              <div className="space-y-2 mb-5 pb-5 border-b border-gray-100 dark:border-white/5 max-h-52 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product._id} className="flex justify-between text-sm py-1.5">
                    <span className="text-gray-500 dark:text-gray-400 truncate flex-1 mr-2">{item.product.name} <span className="text-gray-300 dark:text-gray-600">×{item.quantity}</span></span>
                    <span className="font-bold text-gray-900 dark:text-white flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-5 pb-5 border-b border-gray-100 dark:border-white/5">
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span className="font-bold text-gray-900 dark:text-white">${cart?.totalPrice?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span className="font-bold text-emerald-600 dark:text-emerald-400">Free</span></div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Processing...</> : <>Place Order <FiArrowRight className="w-4 h-4" /></>}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-gray-400 dark:text-gray-500 font-medium"><FiLock className="w-3 h-3" /> 256-bit encrypted checkout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}