import { useContext, useEffect } from 'react'
import { CartContext } from '../context/CartContext'
import { Loading } from '../components/Utils'

export default function Wishlist() {
  const { wishlist, loading, fetchWishlist, removeFromWishlist } = useContext(CartContext)

  useEffect(() => {
    fetchWishlist()
  }, [])

  if (loading) return <Loading />

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600">Save your favorite items for later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.items.map(item => (
            <div key={item.product._id} className="card hover:shadow-lg transition">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              
              <h3 className="text-lg font-bold mb-2">{item.product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">${item.product.price}</span>
                <span className="text-yellow-500">⭐ {item.product.rating?.toFixed(1) || 'N/A'}</span>
              </div>

              <button
                onClick={() => removeFromWishlist(item.product._id)}
                className="btn-danger w-full"
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
