import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      setError('Failed to load product details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorAlert message={error} />
  if (!product) return <ErrorAlert message="Product not found" />

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-w-full max-h-96" />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>

          {/* Details */}
          <div className="card">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              <p className="text-yellow-500 mt-2">⭐ Rating: {product.rating?.toFixed(1) || 'N/A'} ({product.reviews} reviews)</p>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold">
                Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn-outline"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="input-field w-20 text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="btn-outline"
                >
                  +
                </button>
              </div>
            </div>

            <button
              disabled={product.stock === 0}
              className={`w-full btn text-white text-lg py-3 mb-4 ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button className="w-full btn-outline">
              Add to Wishlist ❤️
            </button>

            {product.seller && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-bold mb-2">Seller Information</h3>
                <p className="text-gray-600">Seller: {product.seller.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
