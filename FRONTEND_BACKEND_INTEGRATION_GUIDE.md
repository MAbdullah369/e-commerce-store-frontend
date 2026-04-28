# Frontend-Backend Integration Guide: How Axios Connects Frontend to Backend

## Overview

The e-commerce application uses **Axios** as the HTTP client library to connect the React frontend (running on port 3000) with the Express.js backend API (running on port 5000). This document explains the complete architecture and how data flows between frontend and backend.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Port 3000)               │
├─────────────────────────────────────────────────────────────┤
│  Components (Login, Products, Cart, etc.)                   │
│         ↓                                                     │
│  Context API (AuthContext, CartContext)                     │
│         ↓                                                     │
│  API Service Layer (services/api.js)                        │
│  ├── Axios Instance                                          │
│  ├── Request Interceptor (Adds JWT Token)                   │
│  ├── Response Interceptor (Error Handling)                  │
│  └── Organized Endpoints (auth, product, order, etc.)       │
│         ↓                                                     │
├─────────────────────────────────────────────────────────────┤
│              VITE DEV SERVER (Proxy to Backend)              │
│  Forwards /api requests to http://localhost:5000/api        │
├─────────────────────────────────────────────────────────────┤
│         ↓                                                     │
│  EXPRESS.JS BACKEND API (Port 5000)                         │
├─────────────────────────────────────────────────────────────┤
│  Routes (/api/auth, /api/products, /api/orders, etc.)       │
│         ↓                                                     │
│  Middleware (Auth, Error Handling, CORS)                    │
│         ↓                                                     │
│  Controllers (Business Logic)                               │
│         ↓                                                     │
│  Models (Database Queries)                                  │
│         ↓                                                     │
│  MONGODB DATABASE                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. API Service Layer Configuration

### File: `src/services/api.js`

This is the **heart of the integration**. It creates a centralized Axios instance that all components use to communicate with the backend.

```javascript
import axios from 'axios'

// Create Axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR - Runs before every request
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR - Runs after every response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Export organized API endpoints by feature
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
}

export const productAPI = {
  getAllProducts: (filters) => api.get('/products', { params: filters }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCart: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getBuyerOrders: () => api.get('/buyer/orders'),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
}

export const paymentAPI = {
  initiatePayment: (orderId) => api.post(`/payments/initiate/${orderId}`),
  getOrderPayments: (orderId) => api.get(`/payments/order/${orderId}`),
  verifyPayment: (paymentId) => api.get(`/payments/verify/${paymentId}`),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
}

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
}

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export const sellerAPI = {
  getSellerStats: () => api.get('/seller/stats'),
  getSellerProducts: () => api.get('/seller/products'),
  getSellerOrders: () => api.get('/seller/orders'),
  createProduct: (data) => api.post('/seller/products', data),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
}

export default api
```

---

## 2. Request Flow Example: User Login

### Step-by-Step Process

```
USER ACTION: User clicks "Login" button
    ↓
LOGIN COMPONENT (pages/Login.jsx):
    - Captures email and password from form
    - Calls: authAPI.login(email, password)
    ↓
AXIOS REQUEST INTERCEPTOR (api.js):
    - Checks if token exists in localStorage (it doesn't for login)
    - Prepares request with headers:
      {
        'Content-Type': 'application/json',
        // No Authorization header for login
      }
    ↓
HTTP REQUEST TO BACKEND:
    POST http://localhost:5000/api/auth/login
    Body: { email: "user@example.com", password: "password123" }
    ↓
VITE DEV SERVER (Proxy):
    - Intercepts /api request
    - Forwards to: http://localhost:5000/api/auth/login
    ↓
EXPRESS BACKEND (authController.js):
    - Routes request to authController.login()
    - Finds user by email
    - Compares password with bcryptjs
    - If valid: Generates JWT token
    - Returns: { token: "eyJhbGciOi...", user: {...} }
    ↓
AXIOS RESPONSE (Response Interceptor):
    - Receives response with status 200
    - Checks for errors (none in this case)
    - Returns response to component
    ↓
LOGIN COMPONENT:
    - Extracts token and user data from response
    - Stores token in localStorage: localStorage.setItem('token', token)
    - Updates AuthContext with user data
    - Redirects to home page
    ↓
USER LOGGED IN ✓
```

---

## 3. Request Flow with Authentication: Adding to Cart

### Step-by-Step Process

```
USER ACTION: User clicks "Add to Cart" on product
    ↓
PRODUCT CARD COMPONENT (components/ProductCard.jsx):
    - Gets productId and quantity
    - Calls: cartAPI.addToCart(productId, 2)
    ↓
AXIOS REQUEST INTERCEPTOR (api.js):
    - Reads token from localStorage: "eyJhbGciOi..."
    - Adds to request headers:
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOi...'  ← JWT TOKEN ADDED
      }
    ↓
HTTP REQUEST TO BACKEND:
    POST http://localhost:5000/api/cart
    Headers: { Authorization: 'Bearer eyJhbGciOi...' }
    Body: { productId: "507f1f77bcf86cd799439011", quantity: 2 }
    ↓
VITE DEV SERVER (Proxy):
    - Forwards to backend
    ↓
EXPRESS BACKEND (buyerController.js):
    - Routes request to buyerController.addToCart()
    - Middleware (authMiddleware) intercepts request:
      * Extracts token from Authorization header
      * Verifies JWT signature
      * Decodes token to get userId
      * If invalid: Returns 401 Unauthorized
      * If valid: Continues to controller
    - Controller adds product to user's cart in MongoDB
    - Returns: { cart: { items: [...], total: 150 } }
    ↓
AXIOS RESPONSE (Response Interceptor):
    - Receives response with status 200
    - If any error encountered (like 401):
      * Clears token from localStorage
      * Redirects to /login
    - Returns response to component
    ↓
PRODUCT CARD COMPONENT:
    - Updates CartContext with new cart data
    - Shows success message to user
    - Updates cart count in navbar
    ↓
PRODUCT ADDED TO CART ✓
```

---

## 4. Context API Integration

### AuthContext (context/AuthContext.jsx)

Manages user authentication state globally:

```javascript
import { createContext, useState } from 'react'
import { authAPI } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { token, user } = response.data
      
      // Store JWT token in localStorage
      localStorage.setItem('token', token)
      
      // Update context state
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = { user, isAuthenticated, loading, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### CartContext (context/CartContext.jsx)

Manages shopping cart state globally:

```javascript
import { createContext, useState } from 'react'
import { cartAPI } from '../services/api'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  const getCart = async () => {
    try {
      setLoading(true)
      const response = await cartAPI.getCart()
      setCart(response.data.items)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity)
      setCart(response.data.items)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error }
    }
  }

  const value = { cart, wishlist, loading, getCart, addToCart }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
```

---

## 5. How Components Use the API

### Example: Login Component

```javascript
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { authAPI } from '../services/api'

function Login() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Call login from AuthContext
    // Which internally calls: authAPI.login(email, password)
    const result = await login(email, password)
    
    if (result.success) {
      // Token is already saved in localStorage by login()
      // AuthContext is updated
      // Redirect to home
      navigate('/')
    } else {
      // Show error message
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Example: Products Component

```javascript
import { useEffect, useState } from 'react'
import { productAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Call productAPI endpoint
    productAPI.getAllProducts()
      .then(response => {
        // response.data contains the array of products from backend
        setProducts(response.data)
        setLoading(false)
      })
      .catch(error => console.error(error))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
```

---

## 6. Token Flow

### How JWT Authentication Works

```
1. USER LOGS IN:
   - Frontend sends email/password to backend
   - Backend verifies and generates JWT token
   - Token structure: HEADER.PAYLOAD.SIGNATURE
   - Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZjdhYzhlYTljMWE0MDAwMTc1ZGZkZTUiLCJpYXQiOjE2MDIyNjE1MDl9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

2. FRONTEND STORES TOKEN:
   localStorage.setItem('token', 'eyJhbGciOi...')

3. EVERY SUBSEQUENT REQUEST:
   - Request Interceptor reads token from localStorage
   - Adds to request header: Authorization: 'Bearer eyJhbGciOi...'
   - Sends request to backend

4. BACKEND VERIFIES TOKEN:
   - Middleware extracts token from Authorization header
   - Verifies JWT signature with secret key
   - If valid: Extracts userId from token payload
   - If invalid: Returns 401 Unauthorized

5. REQUEST CONTINUES WITH USER CONTEXT:
   - Controller now knows which user made the request
   - Can fetch/update only that user's data
   - Prevents users from accessing other users' data
```

---

## 7. Error Handling

### Response Interceptor Error Handling

```javascript
api.interceptors.response.use(
  (response) => response,  // Success case
  (error) => {             // Error case
    if (error.response?.status === 401) {
      // Unauthorized - Token invalid or expired
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      // Forbidden - User doesn't have permission
      console.error('Access denied')
    }
    
    if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found')
    }
    
    if (error.response?.status === 500) {
      // Server error
      console.error('Server error')
    }
    
    return Promise.reject(error)
  }
)
```

---

## 8. Vite Proxy Configuration

### File: `vite.config.js`

The Vite dev server proxies API requests to the backend:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Backend server
        changeOrigin: true,               // Change Host header
        rewrite: (path) => path.replace(/^\/api/, '/api')  // Keep /api prefix
      }
    }
  }
})
```

**How it works:**
- When frontend makes request to: `http://localhost:3000/api/products`
- Vite intercepts it and forwards to: `http://localhost:5000/api/products`
- Backend responds with data
- Vite forwards response back to frontend

---

## 9. Backend Setup (Express + MongoDB)

### Backend Server (server.js)

```javascript
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'

const app = express()

// Middleware
app.use(cors())  // Enable CORS for frontend requests
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
// ... other routes

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message })
})

app.listen(5000, () => console.log('Server running on port 5000'))
```

### Example Controller (productController.js)

```javascript
export const getAllProducts = async (req, res, next) => {
  try {
    // Query database
    const products = await Product.find()
      .populate('seller', 'name email')
      .populate('category', 'name')
    
    // Send response to frontend
    res.json(products)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware from JWT token
    const { name, price, description } = req.body
    
    const product = new Product({
      name,
      price,
      description,
      seller: req.user.id  // From JWT token
    })
    
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}
```

---

## 10. Complete Data Flow Diagram

```
FRONTEND                          BACKEND
=========                         =======

User Component
    ↓
    └──→ useContext(AuthContext)
         │
         └──→ authAPI.login()
              │
              └──→ Axios Instance
                   │
                   └──→ Request Interceptor (adds token)
                        │
                        └──→ HTTP POST /api/auth/login
                             │
                             ├──→ Vite Proxy
                             │    │
                             │    └──→ http://localhost:5000/api/auth/login
                             │         │
                             │         ├──→ authRoutes
                             │         │    │
                             │         │    └──→ authController.login()
                             │         │         │
                             │         │         ├──→ Query MongoDB
                             │         │         │
                             │         │         ├──→ Compare password (bcrypt)
                             │         │         │
                             │         │         └──→ Generate JWT token
                             │         │
                             │         └──→ Return { token, user }
                             │
                             └──→ Response Interceptor
                                  │
                                  └──→ Return to Component
                                       │
                                       ├──→ Save token in localStorage
                                       │
                                       ├──→ Update AuthContext
                                       │
                                       └──→ Redirect to home

Result: User is logged in and token is saved for future requests
```

---

## 11. Environment Setup

### Frontend (.env file - optional, not needed with Vite proxy)

```
# Not required - Vite proxy handles it
# VITE_API_URL=http://localhost:5000/api
```

### Backend (.env file)

```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

---

## 12. Running the Application

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend Server
cd backend
npm install
npm run dev
# Output: Server running on port 5000

# Terminal 3: Start Frontend Dev Server
cd frontend
npm install
npm run dev
# Output: Local: http://localhost:3000
```

---

## Summary

**How Axios Integrates Frontend with Backend:**

1. **Centralized API Service**: `services/api.js` creates a single Axios instance
2. **Automatic Token Management**: Request interceptor adds JWT token to every request
3. **Organized Endpoints**: API methods grouped by feature (auth, product, order, etc.)
4. **Global State Management**: AuthContext and CartContext manage global state
5. **Error Handling**: Response interceptor handles 401 errors and token expiration
6. **Vite Proxy**: Dev server proxies `/api` requests to backend
7. **Component Integration**: Components use context and API methods to fetch/mutate data
8. **Backend Authentication**: JWT middleware verifies token and sets user context

**Key Benefits:**
- ✅ Single source of truth for all API endpoints
- ✅ Automatic JWT token injection into every request
- ✅ Consistent error handling across the app
- ✅ Easy to maintain and scale
- ✅ Clean separation of concerns
- ✅ No CORS issues in development (thanks to Vite proxy)
- ✅ Type-safe API calls (with TypeScript if used)

This architecture allows seamless communication between the React frontend and Express backend, with automatic authentication handling, error management, and organized API endpoints.
