import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { FiStar, FiShoppingCart, FiHeart, FiChevronRight, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRefreshCw, FiImage, FiLoader, FiUser } from 'react-icons/fi'

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

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try { setLoading(true); const res = await productAPI.getProductById(id); setProduct(res.data); setError('') }
    catch { setError('Product not found or failed to load.') }
    finally { setLoading(false) }
  }

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    try { setAddingToCart(true); await addToCart(product._id, quantity); setCartSuccess(true); setTimeout(() => setCartSuccess(false), 3000) }
    catch (err) { alert(err.response?.data?.error || 'Failed to add to cart') }
    finally { setAddingToCart(false) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="relative"><div className="w-14 h-14 border-4 border-primary-100 rounded-full"></div><div className="absolute top-0 left-0 w-14 h-14 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div></div>
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
      <div className="text-center animate-fade-in"><div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><FiShoppingCart className="w-8 h-8 text-red-400" /></div><p className="text-red-500 mb-4 font-medium">{error || 'Product not found'}</p><Link to="/products" className="btn-primary">Back to Products</Link></div>
    </div>
  )

  const trustBadges = [
    { icon: FiTruck, label: 'Free Shipping', sub: 'On orders over $50' },
    { icon: FiShield, label: 'Secure Payment', sub: '256-bit encryption' },
    { icon: FiRefreshCw, label: 'Easy Returns', sub: '30-day policy' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up">
          {/* Image */}
          <div className="bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm border border-gray-100 min-h-[400px] group overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="max-w-full max-h-[500px] object-contain group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="text-center"><FiImage className="w-16 h-16 mx-auto text-gray-200 mb-3" /><span className="text-gray-400 text-sm">No image available</span></div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">${product.price}</span>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                  <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700">{product.rating?.toFixed(1) || 'N/A'}</span>
                </div>
                <span className="text-gray-400 text-sm">({product.reviews || 0} reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse-soft' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <label className="label">Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all"><FiMinus className="w-4 h-4 text-gray-600" /></button>
                  <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))} className="w-16 text-center border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 font-semibold" />
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center transition-all"><FiPlus className="w-4 h-4 text-gray-600" /></button>
                </div>
              </div>
            )}

            {/* Cart Success */}
            {cartSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium animate-fade-in">
                <FiCheck className="w-4 h-4" /> Added to cart successfully!
              </div>
            )}

            {/* Actions */}
            {!user ? (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl font-medium">Please <Link to="/login" className="font-bold underline">sign in</Link> to add items to your cart</p>
                <Link to="/login" className="block w-full text-center btn-primary py-3.5">Sign In to Purchase</Link>
              </div>
            ) : user.role === 'buyer' ? (
              <button onClick={handleAddToCart} disabled={product.stock === 0 || addingToCart} className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5'}`}>
                {addingToCart ? <><FiLoader className="w-5 h-5 animate-spin" /> Adding...</> : product.stock === 0 ? 'Out of Stock' : <><FiShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                <p className="text-sm font-semibold text-gray-500 flex items-center justify-center gap-2">
                  <FiShield className="w-4 h-4" /> Sellers and Admins cannot purchase items.
                </p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {trustBadges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-gray-50/50">
                  <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-gray-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center"><FiUser className="w-4 h-4 text-primary-600" /></div>
                <div><p className="text-xs text-gray-500">Sold by</p><p className="text-sm font-bold text-gray-800">{product.seller.name}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}