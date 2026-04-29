import { useContext, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function Wishlist() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useContext(CartContext)

  useEffect(() => {
    if (user) fetchWishlist()
  }, [user])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading wishlist...</div>

  const items = wishlist?.items || []

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💛</div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite items for later</p>
          <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.product._id} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden">
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.product.name}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.product.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-600">${item.product.price}</span>
                  <span className="text-yellow-500 text-sm">⭐ {item.product.rating?.toFixed(1) || 'N/A'}</span>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Product
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="w-full border border-red-200 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}