// Cart.jsx — Premium Redesign
import { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiCheck, FiImage, FiAlertCircle, FiShield, FiTruck, FiLock, FiArrowRight } from 'react-icons/fi'

export default function Cart() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, loading, error, fetchCart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext)

  useEffect(() => { if (user) fetchCart() }, [user])

  const Spinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div>
    </div>
  )

  if (authLoading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'buyer') return <Navigate to="/" replace />
  if (loading) return <Spinner />

  const items = cart?.items || []

  if (items.length === 0) return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex items-center justify-center relative overflow-hidden">
      {/* Decorative background for empty state */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen" />
      
      <div className="relative text-center max-w-sm mx-auto px-4 z-10">
        <div className="w-24 h-24 bg-white dark:bg-[#0c0c14] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/10 border border-gray-100 dark:border-white/5 relative group">
          <div className="absolute inset-0 bg-violet-500/5 dark:bg-violet-500/10 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-500" />
          <FiShoppingCart className="relative w-10 h-10 text-gray-400 dark:text-gray-500 group-hover:text-violet-500 transition-colors duration-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Your cart is empty</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
          <FiShoppingCart className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Your Order</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shopping Cart</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6">
            <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {items.map((item, idx) => (
                  <div key={item.product._id} className="p-5 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/5">
                        {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" /> : <FiImage className="w-6 h-6 text-gray-300 dark:text-gray-700" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.product.name}</h3>
                            <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">${item.price.toFixed(2)} each</p>
                          </div>
                          <p className="font-black text-gray-900 dark:text-white text-base flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Qty controls */}
                          <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
                            <button onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))} className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90 shadow-sm hover:shadow">
                              <FiMinus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-800 dark:text-gray-200 text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartItem(item.product._id, item.quantity + 1)} className="w-7 h-7 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all active:scale-90 shadow-sm hover:shadow">
                              <FiPlus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.product._id)} className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                            <FiTrash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button onClick={clearCart} className="flex items-center gap-1.5 text-[12px] font-semibold text-red-400 hover:text-red-600 border border-red-100 dark:border-red-500/20 px-3.5 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                <FiTrash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
              <Link to="/products" className="flex items-center gap-1.5 text-[12px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                <FiArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6 sticky top-24">
              <h2 className="text-base font-black text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 pb-5 border-b border-gray-100 dark:border-white/5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal ({items.length} items)</span>
                  <span className="font-bold text-gray-900 dark:text-white">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><FiCheck className="w-3 h-3" /> Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-500 dark:text-gray-400 text-[12px]">At checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-black text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <Link to="/checkout" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all">
                Proceed to Checkout <FiArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-5 mt-5 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
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