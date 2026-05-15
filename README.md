# E-Commerce Store Frontend

A modern, full-featured React e-commerce application built with Vite, React Router, and Tailwind CSS. This frontend provides a complete shopping experience with user authentication, product browsing, cart management, order processing, and admin/seller dashboards.

## ✨ Features

- **User Authentication** - Login and registration with secure authentication
- **Product Browsing** - Browse and search products with detailed information
- **Shopping Cart** - Add/remove items with real-time updates
- **Order Management** - Checkout and order history tracking
- **Wishlist** - Save favorite products for later
- **User Profile** - Manage account and personal information
- **Admin Dashboard** - Manage platform users and products
- **Seller Dashboard** - Manage seller's products and orders
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Toast Notifications** - User-friendly alerts and notifications
- **Protected Routes** - Role-based access control

## 🛠️ Technologies

- **React 18.2** - UI library
- **Vite 8.0** - Build tool and dev server
- **React Router 6.30** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Axios 1.5** - HTTP client for API calls
- **React Hot Toast 2.6** - Toast notifications
- **React Icons 5.6** - Icon library

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is required due to peer dependency constraints between Vite 8.0 and the React plugin.

### 2. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or another available port).

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── pages/                      # Page components
│   │   ├── Home.jsx                # Landing page
│   │   ├── Products.jsx            # Product listing
│   │   ├── ProductDetail.jsx       # Individual product details
│   │   ├── Login.jsx               # User login
│   │   ├── Register.jsx            # User registration
│   │   ├── Cart.jsx                # Shopping cart
│   │   ├── Checkout.jsx            # Order checkout
│   │   ├── Orders.jsx              # Order history
│   │   ├── OrderDetail.jsx         # Order details
│   │   ├── Wishlist.jsx            # Wishlist page
│   │   ├── Profile.jsx             # User profile
│   │   ├── AdminDashboard.jsx      # Admin panel
│   │   ├── SellerDashboard.jsx     # Seller panel
│   │   └── NotFound.jsx            # 404 page
│   │
│   ├── components/                 # Reusable components
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Footer.jsx              # Page footer
│   │   ├── ProductCard.jsx         # Product card component
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   └── Utils.jsx               # UI utilities
│   │
│   ├── context/                    # Global state management
│   │   ├── AuthContext.jsx         # Authentication state
│   │   ├── CartContext.jsx         # Shopping cart state
│   │   └── ThemeContext.jsx        # Theme state
│   │
│   ├── services/                   # API integration
│   │   └── api.js                  # Axios instance & API endpoints
│   │
│   ├── assets/                     # Images and static files
│   ├── App.jsx                     # Main app component with routing
│   ├── main.jsx                    # Application entry point
│   ├── index.css                   # Global Tailwind styles
│   └── style.css                   # Additional styles
│
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── README.md                       # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (if needed for API endpoints):

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` for custom theming and component styling.

### Vite

Development and build settings are in `vite.config.js`.

## 📡 API Integration

API calls are centralized in `src/services/api.js` using Axios. Update the API base URL there to match your backend server.

## 🔐 Authentication

User authentication state is managed via `AuthContext.jsx`. Protected routes are wrapped with `ProtectedRoute.jsx` to enforce access control.

## 🛒 Cart & State Management

Cart state is managed using `CartContext.jsx`. Global theme preferences are handled by `ThemeContext.jsx`.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

## 📄 License

This project is open source and available under the MIT License.
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- Backend server running on http://localhost:5000
- MongoDB database

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:3000`

## 📦 Dependencies

### Core Dependencies

```json
{
  "react": "^18.x",                    # UI library
  "react-dom": "^18.x",                # React DOM rendering
  "react-router-dom": "^6.x",          # Client-side routing
  "axios": "^1.x",                     # HTTP client
  "tailwindcss": "^3.x"                # Utility-first CSS
}
```

### Dev Dependencies

```json
{
  "@vitejs/plugin-react": "^4.x",      # Vite React plugin
  "vite": "^4.x",                      # Build tool
  "tailwindcss": "^3.x",               # CSS framework
  "postcss": "^8.x",                   # CSS processing
  "autoprefixer": "^10.x"              # CSS vendor prefixes
}
```

## 🔐 Authentication

### How it Works

1. **Login/Register**: User submits credentials
2. **Token Generation**: Backend generates JWT token
3. **Token Storage**: Token saved in `localStorage` as `token`
4. **Automatic Injection**: Request interceptor adds token to all requests
5. **Token Verification**: Backend middleware verifies token on protected routes

### Protected Routes

```jsx
// Routes that require authentication
<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
<Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

### Role-Based Access

```jsx
// Admin only
<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>

// Seller only
<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>
```

## 🌐 API Integration

### API Service Layer

All API calls go through `src/services/api.js`:

```javascript
import { authAPI, productAPI, cartAPI, orderAPI } from '../services/api'

// Authentication
await authAPI.login(email, password)
await authAPI.register(userData)
await authAPI.logout()

// Products
await productAPI.getAllProducts(filters)
await productAPI.getProductById(id)
await productAPI.createProduct(data)

// Cart
await cartAPI.getCart()
await cartAPI.addToCart(productId, quantity)
await cartAPI.removeFromCart(productId)
await cartAPI.updateCart(productId, quantity)

// Orders
await orderAPI.createOrder(orderData)
await orderAPI.getOrders()
await orderAPI.getOrderById(id)

// Admin
await adminAPI.getDashboardStats()
await adminAPI.getAllUsers()

// Seller
await sellerAPI.getSellerStats()
await sellerAPI.getSellerProducts()
```

### Base URL

- **Development**: http://localhost:3000 (proxied to http://localhost:5000/api)
- **Production**: Configure in `vite.config.js`

## 📄 Pages Overview

### Public Pages

#### Home (`/`)
- Hero section with search
- Featured products
- Call-to-action buttons
- "Why Shop With Us" section

#### Products (`/products`)
- Product listing grid
- Category filtering
- Product search
- Sorting options
- Add to cart/wishlist

#### Product Detail (`/products/:id`)
- Full product information
- Product images
- Price and stock status
- Customer reviews
- Add to cart with quantity selector

#### Login (`/login`)
- Email and password fields
- Remember me option
- Link to registration
- Error handling

#### Register (`/register`)
- Name, email, password fields
- Phone number (optional)
- Role selection (Buyer/Seller)
- Terms acceptance

### Protected Buyer Pages

#### Cart (`/cart`)
- List of cart items
- Quantity adjustment
- Remove items
- Cart total
- Checkout button

#### Checkout (`/checkout`)
- Shipping address form
- Billing address
- Order summary
- Place order button

#### Orders (`/orders`)
- Order history
- Order status
- Order dates and amounts
- Link to order details

#### Order Detail (`/orders/:id`)
- Complete order information
- Shipping address
- Order items
- Payment status
- Order timeline

#### Wishlist (`/wishlist`)
- Saved products
- Remove from wishlist
- View product details
- Add to cart from wishlist

#### Profile (`/profile`)
- User information
- Address management
- Password change
- Phone and email updates

### Dashboard Pages

#### Admin Dashboard (`/admin`)
- Dashboard statistics
- User management
- Product management
- Order management
- Sales analytics

#### Seller Dashboard (`/seller`)
- Sales statistics
- Product management
- Order fulfillment
- Sales analytics
- Shop management

## 🎨 Tailwind CSS Styling

### Custom Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Blue
        secondary: '#10B981',  // Green
      },
    },
  },
  plugins: [],
}
```

### Common Classes

```css
/* Buttons */
.btn-primary     { @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700; }
.btn-secondary   { @apply px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700; }
.btn-danger      { @apply px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700; }

/* Cards */
.card            { @apply bg-white rounded-lg shadow p-6; }

/* Inputs */
.input-field     { @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500; }
```

## 📱 Responsive Design

All components are mobile-first and responsive:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Responsive grid: 1 col on mobile, 2 on small screens, 4 on desktop */}
</div>
```

## 🔄 State Management

### AuthContext

Manages user authentication state globally:

```javascript
const { user, isAuthenticated, login, logout } = useContext(AuthContext)
```

### CartContext

Manages shopping cart and wishlist state:

```javascript
const { cart, wishlist, addToCart, removeFromCart } = useContext(CartContext)
```

## ⚠️ Error Handling

### Global Error Handler

```javascript
// Automatically handles:
// - 401 Unauthorized: Logs out user and redirects to login
// - 403 Forbidden: Shows permission error
// - 404 Not Found: Shows not found error
// - 500 Server Error: Shows server error message
```

### Component Error Handling

```jsx
try {
  const response = await productAPI.getAllProducts()
  setProducts(response.data)
} catch (error) {
  setError(error.response?.data?.error || 'An error occurred')
}
```

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Test Files

```
src/__tests__/
├── components/
├── pages/
├── context/
└── services/
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Create `.env.production` for production:

```
VITE_API_URL=https://your-backend-api.com/api
```

Update `vite.config.js`:

```javascript
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})
```

## 🔧 Development Tips

### Hot Module Replacement

Changes are automatically reflected in the browser as you edit files.

### Debugging

```bash
# Enable Chrome DevTools
npm run dev

# Open Chrome DevTools (F12)
# Go to Sources tab to see source maps
```

### Component Development

```jsx
// Use React Developer Tools extension
// to inspect component props and state
```

### Network Debugging

```javascript
// Check Network tab in Chrome DevTools
// All API requests should show /api/* paths
// Token should be in Authorization header
```

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/login              # Login user
POST   /api/auth/register           # Register user
POST   /api/auth/logout             # Logout user
GET    /api/auth/verify             # Verify token
```

### Products

```
GET    /api/products                # Get all products
GET    /api/products/:id            # Get product by ID
POST   /api/products                # Create product (seller)
PUT    /api/products/:id            # Update product (seller)
DELETE /api/products/:id            # Delete product (seller)
```

### Cart

```
GET    /api/cart                    # Get cart
POST   /api/cart                    # Add to cart
PUT    /api/cart/:productId         # Update cart item
DELETE /api/cart/:productId         # Remove from cart
DELETE /api/cart                    # Clear cart
```

### Orders

```
GET    /api/orders                  # Get user orders
POST   /api/orders                  # Create order
GET    /api/orders/:id              # Get order details
DELETE /api/orders/:id              # Cancel order
```

### Wishlist

```
GET    /api/wishlist                # Get wishlist
POST   /api/wishlist                # Add to wishlist
DELETE /api/wishlist/:productId     # Remove from wishlist
```

### User

```
GET    /api/user/profile            # Get user profile
PUT    /api/user/profile            # Update profile
POST   /api/user/change-password    # Change password
```

### Admin

```
GET    /api/admin/stats             # Dashboard stats
GET    /api/admin/users             # All users
PUT    /api/admin/users/:id         # Update user
DELETE /api/admin/users/:id         # Delete user
```

### Seller

```
GET    /api/seller/stats            # Seller stats
GET    /api/seller/products         # Seller products
GET    /api/seller/orders           # Seller orders
POST   /api/seller/products         # Create product
PUT    /api/seller/products/:id     # Update product
DELETE /api/seller/products/:id     # Delete product
```

## 🐛 Troubleshooting

### CORS Errors

**Solution**: Make sure Vite proxy is configured correctly in `vite.config.js`

### 401 Unauthorized

**Solution**: Token is invalid or expired. User will be redirected to login.

### API Not Found

**Solution**: Make sure backend is running on http://localhost:5000

### Blank Page

**Solution**: Check browser console for errors, clear localStorage

### Token Not Sent

**Solution**: Check Request Interceptor in `services/api.js`

## 📖 Documentation

- [Frontend-Backend Integration Guide](../FRONTEND_BACKEND_INTEGRATION_GUIDE.md)
- [Backend README](../backend/README.md)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)

## 📄 License

MIT

## 👨‍💻 Author

E-Commerce Team

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📞 Support

For support, email: support@ecommerce.com
