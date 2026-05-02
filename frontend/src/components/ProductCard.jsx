// ProductCard.jsx
import { Link } from 'react-router-dom'
import { useContext, useState, useRef } from 'react'
import { CartContext } from '../context/CartContext'
import toast, { Toaster } from 'react-hot-toast'
import { FiShoppingCart, FiHeart, FiStar, FiImage, FiLoader, FiEye } from 'react-icons/fi'

export default function ProductCard({ product }) {
  const { addToCart, addToWishlist } = useContext(CartContext)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisting, setIsWishlisting] = useState(false)
  const actionInProgress = useRef(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0 || isAdding || actionInProgress.current) return
    actionInProgress.current = true
    setIsAdding(true)
    try {
      await addToCart(product._id, 1)
      toast.success(`${product.name} added to cart!`, { duration: 2000, position: 'bottom-center' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart')
    } finally {
      setIsAdding(false)
      setTimeout(() => { actionInProgress.current = false }, 300)
    }
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisting || actionInProgress.current) return
    actionInProgress.current = true
    setIsWishlisting(true)
    try {
      await addToWishlist(product._id)
      toast.success('Added to wishlist!')
    } catch (err) {
      toast.error('Failed to add to wishlist')
    } finally {
      setIsWishlisting(false)
      setTimeout(() => { actionInProgress.current = false }, 300)
    }
  }

  if (!product) return null

  return (
    <>
      <Toaster />
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary-200/50 animate-fade-in-up">
        <Link to={`/products/${product._id}`} className="block">
          <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><FiImage className="w-12 h-12 text-gray-300" /></div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">Out of Stock</span>
              </div>
            )}
            {/* Rating badge */}
            <div className="absolute top-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm border border-white/50">
                <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-gray-700">{product.rating?.toFixed(1) || 'N/A'}</span>
              </div>
            </div>
            {/* Quick view overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
              <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <FiEye className="w-3.5 h-3.5" /> Quick View
              </span>
            </div>
          </div>
        </Link>

        <div className="p-5">
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-base font-bold text-gray-800 mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-1">{product.name}</h3>
          </Link>
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">${Number(product.price).toFixed(2)}</span>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {product.stock > 0 ? `${product.stock} left` : 'Sold Out'}
            </span>
          </div>

          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                product.stock === 0 || isAdding
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isAdding ? (
                <><FiLoader className="w-4 h-4 animate-spin" /> Adding...</>
              ) : (
                <><FiShoppingCart className="w-4 h-4" /> Add to Cart</>
              )}
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={isWishlisting}
              className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
            >
              {isWishlisting ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiHeart className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}