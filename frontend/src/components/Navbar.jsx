import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const cartCount = cart?.items?.length || 0

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            E-Store
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-200 transition">Home</Link>
            <Link to="/products" className="hover:text-blue-200 transition">Products</Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/seller" className="hover:text-blue-200 transition">Dashboard</Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-200 transition">Admin</Link>
            )}
          </div>

          {/* Right Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="hover:text-blue-200 transition">
                  ❤️ Wishlist
                </Link>
                <Link to="/cart" className="hover:text-blue-200 transition relative">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="hover:text-blue-200 transition">
                    👤 {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-blue-50">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-blue-50">Orders</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-red-600">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
                <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
