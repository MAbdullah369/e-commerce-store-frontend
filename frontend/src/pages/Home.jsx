// Home.jsx
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FiTruck, FiShield, FiLock, FiRefreshCw, FiTag, FiHeadphones, FiArrowRight, FiStar, FiZap } from 'react-icons/fi'

export default function Home() {
  const { user } = useContext(AuthContext)

  const features = [
    { icon: FiTruck, title: 'Fast Shipping', description: 'Quick and reliable delivery to your doorstep', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { icon: FiShield, title: 'Quality Products', description: 'Only the best products from trusted sellers', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { icon: FiLock, title: 'Secure Shopping', description: 'Safe and secure payment processing', gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-50' },
    { icon: FiRefreshCw, title: 'Easy Returns', description: '30-day return policy on all items', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-50' },
    { icon: FiTag, title: 'Best Deals', description: 'Exclusive discounts and offers daily', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50' },
    { icon: FiHeadphones, title: '24/7 Support', description: 'Dedicated customer service team', gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-primary-700 min-h-[85vh] flex items-center">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary-400/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-20 left-1/3 w-3 h-3 bg-white/40 rounded-full animate-pulse-soft"></div>
          <div className="absolute top-40 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-pulse-soft delay-300"></div>
          <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse-soft delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 border border-white/20 animate-fade-in-up">
              <FiZap className="w-4 h-4 text-amber-300" />
              <span className="font-medium">New arrivals every week</span>
              <FiStar className="w-3 h-3 text-amber-300" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] animate-fade-in-up">
              Discover Amazing
              <span className="block mt-2 bg-gradient-to-r from-amber-300 via-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Products & Deals
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Your one-stop destination for quality products at unbeatable prices. Shop with confidence and enjoy premium service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <Link to="/products" className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 group">
                Shop Now
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!user && (
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/25 hover:bg-white/25 transition-all duration-300">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Role-based Welcome */}
      {user && (
        <section className="py-6 bg-gradient-to-r from-primary-50/50 to-accent-50/50 border-b border-primary-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-white/50">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-600 animate-pulse-soft"></div>
              <p className="text-gray-800 font-semibold">Welcome back, <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">{user.name}</span>!</p>
              {user.role === 'seller' && <Link to="/seller" className="ml-2 btn-secondary text-xs px-4 py-1.5">Dashboard →</Link>}
              {user.role === 'admin' && <Link to="/admin" className="ml-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold hover:shadow-md transition-all">Dashboard →</Link>}
              {user.role === 'buyer' && <Link to="/products" className="ml-2 btn-primary text-xs px-4 py-1.5">Browse →</Link>}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-widest mb-3">
              <div className="w-8 h-px bg-primary-400"></div> Why Choose Us <div className="w-8 h-px bg-primary-400"></div>
            </span>
            <h2 className="section-title">Shopping Experience <span className="gradient-text">Redefined</span></h2>
            <p className="section-subtitle">Discover the benefits that make us your preferred shopping destination</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm mb-6 border border-white/20">
            <FiZap className="w-4 h-4 text-amber-300" /> Limited Time Offer
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5">Ready to explore?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Browse our latest collection of products and enjoy exclusive discounts</p>
          <Link to="/products" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            Start Shopping <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}