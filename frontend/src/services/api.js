import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verify: () => API.get('/auth/verify'),
  logout: () => API.post('/auth/logout'),
};

// ===== USER ENDPOINTS =====
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
  getAllUsers: () => API.get('/users'),
  deleteUser: (userId) => API.delete(`/users/${userId}`),
};

// ===== PRODUCT ENDPOINTS =====
export const productAPI = {
  getAllProducts: (params) => API.get('/products', { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
  getProductsByCategory: (categoryId) => API.get(`/products/category/${categoryId}`),
};

// ===== ORDER ENDPOINTS =====
export const orderAPI = {
  getBuyerOrders: () => API.get('/orders'),
  createOrder: (data) => API.post('/orders', data),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id, reason) => API.put(`/orders/${id}/cancel`, { cancelReason: reason }),
  getAllOrders: () => API.get('/orders/admin/all'),
};

// ===== CART ENDPOINTS =====
export const cartAPI = {
  getCart: () => API.get('/buyers/cart'),
  addToCart: (data) => API.post('/buyers/cart/add', data),
  updateCartItem: (data) => API.put('/buyers/cart/update', data),
  removeFromCart: (productId) => API.delete(`/buyers/cart/remove/${productId}`),
  clearCart: () => API.delete('/buyers/cart/clear'),
};

// ===== WISHLIST ENDPOINTS =====
export const wishlistAPI = {
  getWishlist: () => API.get('/buyers/wishlist'),
  addToWishlist: (productId) => API.post('/buyers/wishlist/add', { productId }),
  removeFromWishlist: (productId) => API.delete(`/buyers/wishlist/remove/${productId}`),
};

// ===== PAYMENT ENDPOINTS =====
export const paymentAPI = {
  createPayment: (data) => API.post('/payments', data),
  processPayment: (paymentId) => API.post(`/payments/${paymentId}/process`),
  getPaymentDetails: (paymentId) => API.get(`/payments/${paymentId}`),
  refundPayment: (paymentId, reason) => API.post(`/payments/${paymentId}/refund`, { refundReason: reason }),
  getOrderPayments: (orderId) => API.get(`/payments/order/${orderId}`),
  getUserPayments: () => API.get('/payments/user/history'),
};

// ===== SELLER ENDPOINTS =====
export const sellerAPI = {
  registerAsSeller: (data) => API.post('/sellers/register', data),
  getSellerProfile: () => API.get('/sellers/profile'),
  updateSellerProfile: (data) => API.put('/sellers/profile', data),
  getSellerProducts: () => API.get('/sellers/products'),
  getSellerSales: () => API.get('/sellers/sales'),
  getAllSellers: () => API.get('/sellers'),
  getSellerById: (sellerId) => API.get(`/sellers/${sellerId}`),
};

// ===== ADMIN ENDPOINTS =====
export const adminAPI = {
  markReviewHelpful: (reviewId) => API.post(`/admin/reviews/${reviewId}/helpful`),
  deleteReview: (reviewId) => API.delete(`/admin/reviews/${reviewId}`),
};

export default API;
