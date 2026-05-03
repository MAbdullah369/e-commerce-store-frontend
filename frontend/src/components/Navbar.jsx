// Navbar.jsx
import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { FiShoppingCart, FiHeart, FiUser, FiChevronDown, FiMenu, FiX, FiLogOut, FiShield, FiPackage, FiGrid, FiSettings, FiShoppingBag } from 'react-icons/fi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100/50' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              E-Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/products"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/products') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              Products
            </Link>

            {user && user.role === 'buyer' && (
              <>
                <Link to="/cart" className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive('/cart') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}>
                  <FiShoppingCart className="w-4.5 h-4.5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 left-7 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/30 animate-bounce-in">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className={`flex items-center px-3 py-2 rounded-xl transition-all duration-200 ${isActive('/wishlist') ? 'bg-pink-50 text-pink-600' : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'}`}>
                  <FiHeart className="w-4.5 h-4.5" />
                </Link>
              </>
            )}

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2.5 text-gray-700 hover:text-primary-600 transition-colors select-none px-3 py-1.5 rounded-xl hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary-500/20">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium text-sm">{user.name}</span>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 py-2 z-50 animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {user.role}
                      </p>
                      <p className="text-sm font-medium text-gray-800 truncate mt-1">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <FiUser className="w-4 h-4 text-gray-400" />
                      Profile
                    </Link>

                    {user.role === 'buyer' && (
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <FiPackage className="w-4 h-4 text-gray-400" />
                        Orders
                      </Link>
                    )}

                    {user.role === 'seller' && (
                      <Link
                        to="/seller"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <FiShoppingBag className="w-4 h-4 text-gray-400" />
                        Seller Dashboard
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <FiShield className="w-4 h-4 text-gray-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 text-red-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-5 py-2 text-primary-600 font-medium text-sm rounded-xl hover:bg-primary-50 transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5 text-gray-600" />
            ) : (
              <FiMenu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              <Link to="/products" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                <HiOutlineSquares2X2 className="w-5 h-5" />
                Products
              </Link>
              {user && (
                <>
                  {user.role === 'buyer' && (
                    <>
                      <Link to="/cart" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                        <FiShoppingCart className="w-5 h-5" />
                        Cart
                        {cartItemCount > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all py-2.5 px-3 rounded-xl">
                        <FiHeart className="w-5 h-5" />
                        Wishlist
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-100 my-2"></div>
                  <div className="flex items-center gap-3 py-2.5 px-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                    <FiUser className="w-5 h-5" />
                    Profile
                  </Link>
                  {user.role === 'buyer' && (
                    <Link to="/orders" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                      <FiPackage className="w-5 h-5" />
                      Orders
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link to="/seller" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                      <FiShoppingBag className="w-5 h-5" />
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all py-2.5 px-3 rounded-xl">
                      <FiShield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-left text-red-600 hover:bg-red-50 transition-all py-2.5 px-3 rounded-xl"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <div className="flex gap-3 pt-3">
                  <Link to="/login" className="flex-1 text-center px-4 py-2.5 text-primary-600 font-semibold text-sm rounded-xl border-2 border-primary-200 hover:bg-primary-50 transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}