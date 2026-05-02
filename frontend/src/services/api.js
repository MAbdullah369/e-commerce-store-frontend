import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler — token expired or invalid
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verify: () => API.get('/auth/verify'),
  logout: () => API.post('/auth/logout'),
};

// ===== USER =====
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
  getAllUsers: () => API.get('/users'),
  deleteUser: (userId) => API.delete(`/users/${userId}`),
};

// ===== PRODUCTS =====
export const productAPI = {
  getAllProducts: (params) => API.get('/products', { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
  getProductsByCategory: (categoryId) => API.get(`/products/category/${categoryId}`),
};

// ===== ORDERS =====
export const orderAPI = {
  getBuyerOrders: () => API.get('/orders'),
  createOrder: (data) => API.post('/orders', data),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id, reason) => API.put(`/orders/${id}/cancel`, { cancelReason: reason }),
  getAllOrders: () => API.get('/orders/admin/all'),
};

// ===== CART =====
export const cartAPI = {
  getCart: () => API.get('/buyers/cart'),
  addToCart: (data) => API.post('/buyers/cart/add', data),
  updateCartItem: (data) => API.put('/buyers/cart/update', data),
  removeFromCart: (productId) => API.delete(`/buyers/cart/remove/${productId}`),
  clearCart: () => API.delete('/buyers/cart/clear'),
};

// ===== WISHLIST =====
export const wishlistAPI = {
  getWishlist: () => API.get('/buyers/wishlist'),
  addToWishlist: (productId) => API.post('/buyers/wishlist/add', { productId }),
  removeFromWishlist: (productId) => API.delete(`/buyers/wishlist/remove/${productId}`),
};

// ===== PAYMENTS =====
export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  processPayment: (paymentId) => API.post(`/payments/${paymentId}/process`),
  getPaymentDetails: (paymentId) => API.get(`/payments/${paymentId}`),
  refundPayment: (paymentId, reason) => API.post(`/payments/${paymentId}/refund`, { refundReason: reason }),
  getOrderPayments: (orderId) => API.get(`/payments/order/${orderId}`),
  getUserPayments: () => API.get('/payments/user/history'),
};

// ===== SELLER =====
// These were missing — SellerDashboard.jsx needs them
export const sellerAPI = {
  // Shop
  getMyShop:    ()       => API.get('/sellers/shop'),
  createShop:   (data)   => API.post('/sellers/shop', data),
  updateShop:   (data)   => API.put('/sellers/shop', data),
  getShopStatus: ()      => API.get('/sellers/shop/status'),
 
  // Dashboard stats
  getSellerStats:   ()   => API.get('/sellers/stats'),
  getSellerOrders:  ()   => API.get('/sellers/orders'),
  getSellerSales:   ()   => API.get('/sellers/sales'),
 
  // Profile (legacy)
  getSellerProfile:    ()     => API.get('/sellers/profile'),
  updateSellerProfile: (data) => API.put('/sellers/profile', data),
 
  // Products
  getSellerProducts: ()           => API.get('/sellers/products'),
  createProduct:     (data)       => API.post('/sellers/products/create', data),
  updateProduct:     (id, data)   => API.put(`/sellers/products/${id}`, data),
  deleteProduct:     (id)         => API.delete(`/sellers/products/${id}`),
  publishProduct:    (id)         => API.patch(`/sellers/products/${id}/publish`),
 
  // Public
  getAllSellers:  ()         => API.get('/sellers'),
  getSellerById: (sellerId) => API.get(`/sellers/${sellerId}`),
};
// ===== ADMIN =====
// Used directly with `api.get/post/patch/delete` in AdminDashboard
export const adminAPI = {
  markReviewHelpful: (reviewId) => API.post(`/admin/reviews/${reviewId}/helpful`),
  deleteReview: (reviewId) => API.delete(`/admin/reviews/${reviewId}`),
};

// Export raw instance so AdminDashboard can call api.get('/admin/...')
export { API as api };
export default API;