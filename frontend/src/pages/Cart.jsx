import { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function Cart() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { cart, loading, error, fetchCart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext)

  useEffect(() => {
    if (user) fetchCart()
  }, [user])

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  }

  if (!user) return <Navigate to="/login" replace />

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading cart...</div>
  }

  // Safe check — cart or empty items
  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
              {items.map(item => (
                <div key={item.product._id} className="flex gap-4 pb-5 border-b last:border-b-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">No image</span>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price} each</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Order Summary</h2>

              <div className="space-y-3 mb-5 pb-5 border-b text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>At checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6 text-gray-900">
                <span>Total</span>
                <span>${cart?.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <Link to="/checkout" className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition mb-3">
                Proceed to Checkout
              </Link>

              <Link to="/products" className="block w-full border border-gray-300 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}