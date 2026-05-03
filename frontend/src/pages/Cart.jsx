import { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiCheck, FiImage, FiAlertCircle, FiShield, FiTruck, FiLock } from 'react-icons/fi'

export default function Cart() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, loading, error, fetchCart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext)

  useEffect(() => { if (user) fetchCart() }, [user])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white"><div className="relative"><div className="w-14 h-14 border-4 border-primary-100 rounded-full"></div><div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'buyer') return <Navigate to="/" replace />

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white"><div className="relative"><div className="w-14 h-14 border-4 border-primary-100 rounded-full"></div><div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div><p className="mt-6 text-gray-500 font-medium">Loading your cart...</p></div>

  const items = cart?.items || []

  if (items.length === 0) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4 animate-fade-in-up">
        <div className="w-28 h-28 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6"><FiShoppingCart className="w-12 h-12 text-primary-500" /></div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3"><FiArrowLeft className="w-4 h-4" /> Continue Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"><FiShoppingCart className="w-5 h-5 text-white" /></div>
              Shopping Cart
            </h1>
            <p className="text-gray-500 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{error}</span></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.product._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-5">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                        {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" /> : <FiImage className="w-6 h-6 text-gray-300" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                            <p className="text-gray-400 text-sm mt-0.5">${item.price} each</p>
                          </div>
                          <p className="font-bold text-gray-900 ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all"><FiMinus className="w-3 h-3 text-gray-600" /></button>
                            <span className="w-10 text-center font-semibold text-gray-800 text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartItem(item.product._id, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all"><FiPlus className="w-3 h-3 text-gray-600" /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.product._id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"><FiTrash2 className="w-3.5 h-3.5" /> Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-5">
              <button onClick={clearCart} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"><FiTrash2 className="w-3.5 h-3.5" /> Clear Cart</button>
              <Link to="/products" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"><FiArrowLeft className="w-4 h-4" /> Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 animate-fade-in-up delay-200">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">${cart?.totalPrice?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-emerald-600 font-semibold flex items-center gap-1"><FiCheck className="w-3.5 h-3.5" /> Free</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax</span><span className="text-gray-400 text-sm">At checkout</span></div>
              </div>
              <div className="flex justify-between text-xl font-extrabold mb-6 text-gray-900">
                <span>Total</span>
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <Link to="/checkout" className="block w-full btn-primary text-center py-3.5 mb-4">Proceed to Checkout</Link>
              <div className="flex items-center justify-center gap-4 text-gray-400 text-xs">
                <span className="flex items-center gap-1"><FiLock className="w-3 h-3" /> Secure</span>
                <span className="flex items-center gap-1"><FiShield className="w-3 h-3" /> Protected</span>
                <span className="flex items-center gap-1"><FiTruck className="w-3 h-3" /> Free Ship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}