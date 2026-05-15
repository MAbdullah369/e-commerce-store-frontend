import { createContext, useState, useContext, useCallback, useRef } from 'react'
import { cartAPI, wishlistAPI } from '../services/api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext)

  const [cart, setCart] = useState(null)        // { items: [], totalPrice: 0, totalItems: 0 }
  const [wishlist, setWishlist] = useState(null) // { items: [] }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Track pending operations
  const pendingOperations = useRef(new Map())

  // ── CART ──────────────────────────────────────────

  const fetchCart = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const res = await cartAPI.getCart()
      // Ensure cart always has items array even if null
      setCart(res.data || { items: [], totalPrice: 0, totalItems: 0 })
      setError('')
    } catch (err) {
      setError('Failed to load cart')
      console.error(err)
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const operationKey = `add_${productId}`
    if (pendingOperations.current.has(operationKey)) {
      throw new Error('Operation in progress')
    }
    
    pendingOperations.current.set(operationKey, true)
    
    try {
      setLoading(true)
      
      // Optimistic update
      setCart(prevCart => {
        if (!prevCart || !prevCart.items) {
          return {
            items: [{ product: productId, quantity, price: 0 }],
            totalPrice: 0,
            totalItems: quantity
          }
        }
        
        const existingItemIndex = prevCart.items.findIndex(
          item => item.product === productId || item.product?._id === productId
        )
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevCart.items]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          }
          
          return {
            ...prevCart,
            items: updatedItems,
            totalItems: prevCart.totalItems + quantity
          }
        }
        
        return {
          ...prevCart,
          items: [...prevCart.items, { product: productId, quantity, price: 0 }],
          totalItems: prevCart.totalItems + quantity
        }
      })
      
      const res = await cartAPI.addToCart({ productId, quantity })
      setCart(res.data.cart || res.data)
      setError('')
      return res.data
    } catch (err) {
      // Revert optimistic update on error
      await fetchCart()
      setError(err.response?.data?.error || 'Failed to add to cart')
      throw err
    } finally {
      setLoading(false)
      pendingOperations.current.delete(operationKey)
      setTimeout(() => {
        if (pendingOperations.current.get(operationKey) === false) {
          pendingOperations.current.delete(operationKey)
        }
      }, 500)
    }
  }, [fetchCart])

  const updateCartItem = useCallback(async (productId, quantity) => {
    if (!productId) {
      console.error('updateCartItem called without productId')
      return
    }
    
    const operationKey = `update_${productId}`
    if (pendingOperations.current.has(operationKey)) return
    
    pendingOperations.current.set(operationKey, true)
    
    try {
      setLoading(true)
      
      // Optimistic update
      setCart(prevCart => {
        if (!prevCart || !prevCart.items) return prevCart
        
        const updatedItems = prevCart.items.map(item =>
          (item.product === productId || item.product?._id === productId)
            ? { ...item, quantity }
            : item
        )
        
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        return {
          ...prevCart,
          items: updatedItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice
        }
      })
      
      const res = await cartAPI.updateCartItem({ productId, quantity })
      setCart(res.data.cart || res.data)
      setError('')
    } catch (err) {
      await fetchCart() // Revert on error
      setError(err.response?.data?.error || 'Failed to update cart')
      console.error(err)
    } finally {
      setLoading(false)
      pendingOperations.current.delete(operationKey)
    }
  }, [fetchCart])

  const removeFromCart = useCallback(async (productId) => {
    if (!productId) {
      console.error('removeFromCart called without productId')
      return
    }
    
    const operationKey = `remove_${productId}`
    if (pendingOperations.current.has(operationKey)) return
    
    pendingOperations.current.set(operationKey, true)
    
    try {
      setLoading(true)
      
      // Save current cart state for potential rollback
      const previousCart = cart
      
      // Optimistic update - remove the item from UI immediately
      setCart(prevCart => {
        if (!prevCart || !prevCart.items) return { items: [], totalPrice: 0, totalItems: 0 }
        
        // Find the item to remove
        const itemToRemove = prevCart.items.find(
          item => item.product === productId || item.product?._id === productId
        )
        
        if (!itemToRemove) return prevCart
        
        // Calculate new totals
        const newItems = prevCart.items.filter(
          item => item.product !== productId && item.product?._id !== productId
        )
        
        const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
        const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        return {
          ...prevCart,
          items: newItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice
        }
      })
      
      // Make API call
      const res = await cartAPI.removeFromCart(productId)
      
      // Update with server response
      if (res && res.data) {
        setCart(res.data.cart || res.data)
      }
      
      setError('')
    } catch (err) {
      // Revert optimistic update by restoring previous cart
      console.error('Failed to remove item:', err)
      if (cart) {
        // Don't revert if cart is null, just fetch fresh
        await fetchCart()
      }
      setError(err.response?.data?.error || 'Failed to remove item')
    } finally {
      setLoading(false)
      pendingOperations.current.delete(operationKey)
    }
  }, [cart, fetchCart])

  const clearCart = useCallback(async () => {
    try {
      setLoading(true)
      await cartAPI.clearCart()
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
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
      setWishlist(res.data || { items: [] })
      setError('')
    } catch (err) {
      setError('Failed to load wishlist')
      console.error(err)
      setWishlist({ items: [] })
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToWishlist = useCallback(async (productId) => {
    const operationKey = `wishlist_add_${productId}`
    if (pendingOperations.current.has(operationKey)) return
    
    pendingOperations.current.set(operationKey, true)
    
    try {
      setLoading(true)
      const res = await wishlistAPI.addToWishlist(productId)
      setWishlist(res.data.wishlist || res.data)
      setError('')
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to wishlist')
      throw err
    } finally {
      setLoading(false)
      pendingOperations.current.delete(operationKey)
    }
  }, [])

  const removeFromWishlist = useCallback(async (productId) => {
    const operationKey = `wishlist_remove_${productId}`
    if (pendingOperations.current.has(operationKey)) return
    
    pendingOperations.current.set(operationKey, true)
    
    try {
      setLoading(true)
      const res = await wishlistAPI.removeFromWishlist(productId)
      setWishlist(res.data.wishlist || res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from wishlist')
      console.error(err)
    } finally {
      setLoading(false)
      pendingOperations.current.delete(operationKey)
    }
  }, [])

  return (
    <CartContext.Provider value={{
      cart,
      fetchCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      wishlist,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      loading,
      error,
    }}>
      {children}
    </CartContext.Provider>
  )
}