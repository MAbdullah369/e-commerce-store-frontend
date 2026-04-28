import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { Loading, ErrorAlert } from '../components/Utils'

export default function Cart() {
  const { cart, loading, error, fetchCart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext)

  useEffect(() => {
    fetchCart()
  }, [])

  if (loading) return <Loading />

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card">
              {cart.items.map(item => (
                <div key={item.product._id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                        className="btn-outline px-2 py-1"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                        className="btn-outline px-2 py-1"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="btn-danger px-2 py-1 ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="btn-danger mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>TBD</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total:</span>
                <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center mb-4">
                Proceed to Checkout
              </Link>

              <Link to="/products" className="btn-outline w-full text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
