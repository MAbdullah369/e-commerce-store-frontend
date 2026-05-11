// ProductDetail.jsx — Premium Redesign
import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productAPI } from '../services/api'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { FiStar, FiShoppingCart, FiHeart, FiChevronRight, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRefreshCw, FiImage, FiLoader, FiUser, FiArrowLeft } from 'react-icons/fi'

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
    catch { setError('Product not found or failed to load.') } finally { setLoading(false) }
  }

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    try { setAddingToCart(true); await addToCart(product._id, quantity); setCartSuccess(true); setTimeout(() => setCartSuccess(false), 3000) }
    catch (err) { alert(err.response?.data?.error || 'Failed to add to cart') } finally { setAddingToCart(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div>
    </div>
  )
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="text-center"><p className="text-red-500 dark:text-red-400 mb-4 font-medium">{error || 'Product not found'}</p><Link to="/products" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Back to Products</Link></div>
    </div>
  )

  const trustBadges = [
    { icon: FiTruck, label: 'Free Shipping', sub: 'On orders over $50' },
    { icon: FiShield, label: 'Secure Payment', sub: '256-bit encrypted' },
    { icon: FiRefreshCw, label: 'Easy Returns', sub: '30-day policy' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-500 mb-8">
          <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">Products</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative bg-gray-50/50 dark:bg-[#0a0a0f] rounded-3xl border border-gray-100 dark:border-white/5 flex items-center justify-center min-h-[420px] overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:30px_30px] dark:bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[80px] pointer-events-none" />
            
            {product.image ? (
              <img src={product.image} alt={product.name} className="relative max-w-full max-h-[500px] object-contain group-hover:scale-[1.05] group-hover:-translate-y-2 transition-all duration-700 ease-out p-8 z-10 drop-shadow-2xl" />
            ) : (
              <div className="relative text-center p-8 z-10"><FiImage className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-3" /><span className="text-gray-400 dark:text-gray-500 text-sm">No image</span></div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              {product.category && <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">{product.category}</p>}
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black text-gray-900 dark:text-white">${product.price}</span>
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-200/60 dark:border-amber-500/20">
                  <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{product.rating?.toFixed(1) || '—'}</span>
                  <span className="text-[11px] text-amber-500/70 dark:text-amber-500/60">({product.reviews || 0})</span>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-fit border ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-500/20'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div>
                <label className="block text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/8">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all"><FiMinus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" /></button>
                    <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))} className="w-14 text-center bg-transparent text-gray-900 dark:text-white font-black text-base focus:outline-none" />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-9 h-9 rounded-lg hover:bg-white dark:hover:bg-white/10 flex items-center justify-center transition-all"><FiPlus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" /></button>
                  </div>
                  <span className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">{product.stock} available</span>
                </div>
              </div>
            )}

            {/* Cart success */}
            {cartSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-bold">
                <FiCheck className="w-4 h-4" /> Added to cart successfully!
              </div>
            )}

            {/* Actions */}
            {!user ? (
              <div className="space-y-3">
                <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 px-4 py-3 rounded-xl font-medium">
                  Please <Link to="/login" className="font-black underline">sign in</Link> to add items to your cart
                </p>
                <Link to="/login" className="block w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all">
                  Sign In to Purchase
                </Link>
              </div>
            ) : user.role === 'buyer' ? (
              <button onClick={handleAddToCart} disabled={product.stock === 0 || addingToCart} className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 ${product.stock === 0 ? 'bg-gray-200 dark:bg-white/8 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 active:translate-y-0'
                }`}>
                {addingToCart ? <><FiLoader className="w-4 h-4 animate-spin" /> Adding...</> : product.stock === 0 ? 'Out of Stock' : <><FiShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-2xl text-center">
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                  <FiShield className="w-4 h-4" /> Sellers and Admins cannot purchase items.
                </p>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100 dark:border-white/5">
              {trustBadges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-gray-50/50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                  <Icon className="w-4.5 h-4.5 text-violet-500 mx-auto mb-1.5" />
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</p>
                </div>
              ))}
            </div>

            {/* Seller */}
            {product.seller && (
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-white/5">
                <div className="w-9 h-9 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center"><FiUser className="w-4 h-4 text-violet-600 dark:text-violet-400" /></div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sold by</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{product.seller.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}