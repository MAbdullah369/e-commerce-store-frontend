// Navbar.jsx — Premium Redesign
import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { FiShoppingCart, FiHeart, FiUser, FiChevronDown, FiMenu, FiX, FiLogOut, FiShield, FiPackage, FiSettings, FiShoppingBag, FiSun, FiMoon, FiGrid } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => { setDropdownOpen(false); setMobileMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate('/') }
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-2xl shadow-[0_1px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_40px_rgba(0,0,0,0.4)] border-b border-black/5 dark:border-white/5'
        : 'bg-transparent border-b border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-black text-lg tracking-tighter">λ</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-[#0a0a0f]"></div>
            </div>
            <span className="text-[17px] font-black tracking-[-0.5px] text-gray-900 dark:text-white">
              Luxe<span className="text-violet-600 dark:text-violet-400">Store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/products" className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${isActive('/products')
                ? 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}>
              <FiGrid className="w-3.5 h-3.5" /> Products
              {isActive('/products') && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-600 rounded-full" />}
            </Link>

            {user?.role === 'buyer' && (
              <>
                <Link to="/cart" className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${isActive('/cart') ? 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}>
                  <FiShoppingCart className="w-3.5 h-3.5" />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 left-7 min-w-[18px] h-[18px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-violet-500/40">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className={`flex items-center px-3 py-2 rounded-xl transition-all duration-200 ${isActive('/wishlist') ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                  }`}>
                  <FiHeart className="w-4 h-4" />
                </Link>
              </>
            )}

            <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-2" />

            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95" aria-label="Toggle Theme">
              {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(prev => !prev)} className="flex items-center gap-2.5 ml-1 pl-3 pr-3 py-1.5 rounded-2xl border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-all duration-200">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-100 max-w-[90px] truncate">{user.name}</span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-[240px] bg-white dark:bg-[#111118] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-black/8 dark:border-white/8 py-1.5 z-50 animate-[fadeInDown_0.15s_ease]">
                    <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{user.role}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.email}</p>
                    </div>

                    {[
                      { to: '/profile', icon: FiUser, label: 'Profile', show: true },
                      { to: '/orders', icon: FiPackage, label: 'My Orders', show: user.role === 'buyer' },
                      { to: '/wishlist', icon: FiHeart, label: 'Wishlist', show: user.role === 'buyer' },
                      { to: '/seller', icon: FiShoppingBag, label: 'Seller Dashboard', show: user.role === 'seller' },
                      { to: '/admin', icon: FiShield, label: 'Admin Dashboard', show: user.role === 'admin' },
                    ].filter(item => item.show).map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" /> {label}
                      </Link>
                    ))}

                    <div className="border-t border-black/5 dark:border-white/5 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className={`px-4 py-2 text-[13px] font-semibold rounded-xl transition-all ${scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}>
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[13px] font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              {darkMode ? <FiSun className="w-4.5 h-4.5" /> : <FiMoon className="w-4.5 h-4.5" />}
            </button>
            {user?.role === 'buyer' && cartItemCount > 0 && (
              <Link to="/cart" className="relative p-2">
                <FiShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-violet-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartItemCount}</span>
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              {mobileMenuOpen ? <FiX className="w-5 h-5 text-violet-600" /> : <FiMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Mobile panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[300px] bg-white dark:bg-[#0e0e16] z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl border-l border-black/5 dark:border-white/5 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black">λ</div>
              <span className="font-black text-gray-900 dark:text-white">LuxeStore</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-violet-50 dark:bg-violet-500/10 rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {[
              { to: '/products', icon: FiGrid, label: 'Products', show: true },
              { to: '/cart', icon: FiShoppingCart, label: 'Cart', show: user?.role === 'buyer', badge: cartItemCount },
              { to: '/wishlist', icon: FiHeart, label: 'Wishlist', show: user?.role === 'buyer' },
              { to: '/orders', icon: FiPackage, label: 'My Orders', show: user?.role === 'buyer' },
              { to: '/profile', icon: FiUser, label: 'Profile', show: !!user },
              { to: '/seller', icon: FiShoppingBag, label: 'Seller Dashboard', show: user?.role === 'seller' },
              { to: '/admin', icon: FiShield, label: 'Admin Dashboard', show: user?.role === 'admin' },
            ].filter(item => item.show).map(({ to, icon: Icon, label, badge }) => (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isActive(to) ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}>
                <Icon className="w-4.5 h-4.5" /> {label}
                {badge > 0 && <span className="ml-auto bg-violet-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
              </Link>
            ))}

            {!user && (
              <div className="pt-4 space-y-2">
                <Link to="/login" className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-violet-600 dark:text-violet-400 border-2 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">Sign In</Link>
                <Link to="/register" className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">Get Started</Link>
              </div>
            )}
          </div>

          {user && (
            <div className="p-4 border-t border-black/5 dark:border-white/5">
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 transition-all">
                <FiLogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}