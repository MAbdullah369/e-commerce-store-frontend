import { createContext, useState, useContext, useCallback } from 'react'
import { cartAPI, wishlistAPI } from '../services/api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext)

  const [cart, setCart] = useState(null)        // { items: [], totalPrice: 0 }
  const [wishlist, setWishlist] = useState(null) // { items: [] }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── CART ──────────────────────────────────────────

  const fetchCart = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      setCart(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load cart')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true)
      const res = await cartAPI.addToCart({ productId, quantity })
      setCart(res.data)
      setError('')
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      setLoading(true)
      const res = await cartAPI.updateCartItem({ productId, quantity })
      setCart(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cart')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    try {
      setLoading(true)
      const res = await cartAPI.removeFromCart(productId)
      setCart(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove item')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      setLoading(true)
      await cartAPI.clearCart()
      setCart(null)
      setError('')
    } catch (err) {
      setError('Failed to clear cart')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── WISHLIST ──────────────────────────────────────

  const fetchWishlist = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await wishlistAPI.getWishlist()
      setWishlist(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load wishlist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToWishlist = useCallback(async (productId) => {
    try {
      setLoading(true)
      const res = await wishlistAPI.addToWishlist(productId)
      setWishlist(res.data)
      setError('')
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to wishlist')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      setLoading(true)
      const res = await wishlistAPI.removeFromWishlist(productId)
      setWishlist(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from wishlist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <CartContext.Provider value={{
      // Cart
      cart,
      fetchCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      // Wishlist
      wishlist,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      // State
      loading,
      error,
    }}>
      {children}
    </CartContext.Provider>
  )
}