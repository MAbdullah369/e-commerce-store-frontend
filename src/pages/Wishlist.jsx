// Wishlist.jsx — Premium Redesign
import { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { Loading } from '../components/Utils'
import { FiHeart, FiTrash2, FiShoppingCart, FiImage, FiStar, FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

const toastStyle = { background: '#18181b', color: '#fff', border: '1px solid #27272a', borderRadius: '14px', fontSize: '13px', fontWeight: '600' }

export default function Wishlist() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const { wishlist, fetchWishlist, removeFromWishlist, addToCart, loading, error } = useContext(CartContext)

  useEffect(() => { if (user) fetchWishlist() }, [user])

  if (authLoading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'buyer') return <Navigate to="/" replace />
  if (loading && !wishlist) return <Loading />

  const items = wishlist?.items || []

  const handleMoveToCart = async (productId) => {
    try { await addToCart(productId, 1); await removeFromWishlist(productId); toast.success('Moved to cart!', { style: toastStyle }) }
    catch { toast.error('Failed', { style: toastStyle }) }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <Toaster />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Saved Items</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              My Wishlist
              {items.length > 0 && <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full">{items.length}</span>}
            </h1>
          </div>
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6"><FiAlertCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}

        {items.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <FiHeart className="w-8 h-8 text-rose-300 dark:text-rose-700" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Save items you love to find them easily later.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              Explore Products <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => {
              const product = item.product || item
              if (!product) return null
              return (
                <div key={product._id} className="group bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden">
                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-48 bg-gray-50 dark:bg-white/3 overflow-hidden">
                      {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-10 h-10 text-gray-200 dark:text-gray-800" /></div>}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-[#0c0c14]/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm border border-black/5 dark:border-white/5">
                        <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" /><span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{product.rating?.toFixed(1) || '—'}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-xl font-black text-gray-900 dark:text-white mb-4">${Number(product.price).toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleMoveToCart(product._id)} className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all">
                        <FiShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(product._id)} className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/8 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}