import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when navigating to a new page
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/')
  }

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Store
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>

            {user && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition relative">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 transition">
                  Wishlist
                </Link>
              </>
            )}

            {user ? (
              // ── Click-based dropdown ──
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition select-none"
                >
                  <span className="font-medium">{user.name}</span>
                  {/* Chevron rotates when open */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {/* User info header */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {user.role}
                      </p>
                      <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      👤 Profile
                    </Link>

                    {/* Buyer-specific links */}
                    {user.role === 'buyer' && (
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        📦 Orders
                      </Link>
                    )}

                    {/* Seller links */}
                    {user.role === 'seller' && (
                      <>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          📦 Orders
                        </Link>
                        <Link
                          to="/seller"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          🏪 Seller Dashboard
                        </Link>
                      </>
                    )}

                    {/* Admin links */}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        ⚙️ Admin Dashboard
                      </Link>
                    )}

                    <hr className="my-1 border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}