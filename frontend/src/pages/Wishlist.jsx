import { useContext, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { Loading } from '../components/Utils'
import { FiHeart, FiTrash2, FiShoppingCart, FiImage, FiStar, FiAlertCircle } from 'react-icons/fi'
import toast, { Toaster } from 'react-hot-toast'

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
    try { await addToCart(productId, 1); await removeFromWishlist(productId); toast.success('Moved to cart!') }
    catch { toast.error('Failed to move to cart') }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20"><FiHeart className="w-5 h-5 text-white" /></div>
          My Wishlist
          {items.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({items.length} items)</span>}
        </h1>

        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{error}</span></div>}

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiHeart className="w-10 h-10 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite items for later</p>
            <Link to="/products" className="btn-primary px-8 py-3 inline-flex items-center gap-2">Explore Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {items.map(item => {
              const product = item.product || item
              if (!product) return null
              return (
                <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-pink-200/50 transition-all duration-300 group">
                  <Link to={`/products/${product._id}`}>
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-10 h-10 text-gray-300" /></div>}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /><span className="text-xs font-bold text-gray-700">{product.rating?.toFixed(1) || 'N/A'}</span></div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/products/${product._id}`}><h3 className="font-bold text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3></Link>
                    <p className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">${Number(product.price).toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleMoveToCart(product._id)} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-1.5"><FiShoppingCart className="w-4 h-4" /> Move to Cart</button>
                      <button onClick={() => removeFromWishlist(product._id)} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"><FiTrash2 className="w-4 h-4" /></button>
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