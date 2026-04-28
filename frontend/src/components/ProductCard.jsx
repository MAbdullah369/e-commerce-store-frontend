import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist } = useContext(CartContext)

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1)
      alert('Added to cart!')
    } catch (err) {
      alert('Failed to add to cart')
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product._id)
      alert('Added to wishlist!')
    } catch (err) {
      alert('Failed to add to wishlist')
    }
  }

  return (
    <div className="card hover:shadow-lg transition">
      <Link to={`/products/${product._id}`}>
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <h3 className="text-lg font-bold mb-2 hover:text-blue-600">{product.name}</h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
        <span className="text-yellow-500">⭐ {product.rating?.toFixed(1) || 'N/A'}</span>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 btn text-white rounded-lg ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={handleAddToWishlist}
          className="btn-outline flex items-center justify-center"
        >
          ❤️
        </button>
      </div>

      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
    </div>
  )
}
