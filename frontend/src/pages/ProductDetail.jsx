import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { addToCart } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartSuccess, setCartSuccess] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProductById(id)
      setProduct(response.data)
      setError('')
    } catch (err) {
      setError('Product not found or failed to load.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setAddingToCart(true)
      await addToCart(product._id, quantity)
      setCartSuccess(true)
      setTimeout(() => setCartSuccess(false), 3000)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center shadow-sm border min-h-80">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-w-full max-h-96 object-contain" />
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-2">📦</div>
                <span className="text-gray-400 text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              <span className="text-yellow-500">⭐ {product.rating?.toFixed(1) || 'N/A'}</span>
              <span className="text-gray-400 text-sm">({product.reviews || 0} reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-6 ${
              product.stock > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            {cartSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">
                ✓ Added to cart!
              </div>
            )}

            {!user ? (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
                  ⚠ Please <Link to="/login" className="font-semibold underline">sign in</Link> to add items to your cart
                </p>
                <Link
                  to="/login"
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Sign In to Purchase
                </Link>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className={`w-full py-3 rounded-xl font-semibold text-white transition ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
              </button>
            )}

            {/* Seller Info */}
            {product.seller && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">Sold by <span className="font-semibold text-gray-700">{product.seller.name}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}