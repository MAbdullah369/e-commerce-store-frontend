import React, { createContext, useState, useCallback, useEffect } from 'react';
import { cartAPI, wishlistAPI } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity) => {
    try {
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart');
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from cart');
      throw err;
    }
  }, []);

  const updateCartItem = useCallback(async (productId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem({ productId, quantity });
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cart');
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      const response = await cartAPI.clearCart();
      setCart(response.data.cart);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clear cart');
      throw err;
    }
  }, []);

  const addToWishlist = useCallback(async (productId) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      setWishlist(response.data.wishlist);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to wishlist');
      throw err;
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data.wishlist);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from wishlist');
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        error,
        fetchCart,
        fetchWishlist,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
