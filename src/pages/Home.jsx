// Home.jsx — Premium Redesign
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FiTruck, FiShield, FiLock, FiRefreshCw, FiTag, FiHeadphones, FiArrowRight, FiStar, FiZap, FiChevronRight } from 'react-icons/fi'

export default function Home() {
  const { user } = useContext(AuthContext)

  const features = [
    { icon: FiTruck, title: 'Free Delivery', description: 'Complimentary shipping on all orders over $50', accent: '#6366f1' },
    { icon: FiShield, title: 'Curated Quality', description: 'Every product vetted by our expert team', accent: '#06b6d4' },
    { icon: FiLock, title: 'Secure Checkout', description: 'Bank-grade encryption on every transaction', accent: '#8b5cf6' },
    { icon: FiRefreshCw, title: 'Easy Returns', description: '30-day no-questions-asked return policy', accent: '#f59e0b' },
    { icon: FiTag, title: 'Member Deals', description: 'Exclusive daily offers for registered users', accent: '#ec4899' },
    { icon: FiHeadphones, title: 'Concierge Support', description: 'Dedicated experts available around the clock', accent: '#10b981' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">

      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-68px)] flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)]" />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 dark:bg-indigo-500/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/6 dark:bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[12px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-widest">New Arrivals This Week</span>
              <FiZap className="w-3 h-3 text-violet-500" />
            </div>

            <h1 className="text-[52px] sm:text-[72px] lg:text-[88px] font-black leading-[0.95] tracking-[-3px] text-gray-900 dark:text-white mb-8">
              Shop the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                Future of
              </span>
              <span className="block">Commerce</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-xl font-medium">
              Discover curated products from the world's best sellers. Premium quality, exceptional prices, unmatched experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-[15px] hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300">
                Explore Products
                <FiArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!user && (
                <Link to="/register" className="inline-flex items-center gap-3 bg-white dark:bg-white/5 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-[15px] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/8 transition-all duration-300">
                  Join Free
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-black/8 dark:border-white/8">
              {[
                { value: '50K+', label: 'Products' },
                { value: '12K+', label: 'Happy Buyers' },
                { value: '2K+', label: 'Trusted Sellers' },
                { value: '4.9★', label: 'Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</p>
                  <p className="text-[12px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-gray-200 dark:border-gray-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Welcome Banner (logged in) ── */}
      {user && (
        <section className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-500/5 dark:via-purple-500/5 dark:to-indigo-500/5 border-y border-violet-100 dark:border-violet-500/10 py-4">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Welcome back, {user.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{user.role} account</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.role === 'seller' && <Link to="/seller" className="text-[12px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 px-4 py-2 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-500/25 transition-colors flex items-center gap-1.5"><FiChevronRight className="w-3.5 h-3.5" /> Dashboard</Link>}
                {user.role === 'admin' && <Link to="/admin" className="text-[12px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 px-4 py-2 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-500/25 transition-colors flex items-center gap-1.5"><FiChevronRight className="w-3.5 h-3.5" /> Admin Panel</Link>}
                {user.role === 'buyer' && <Link to="/products" className="text-[12px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 px-4 py-2 rounded-xl hover:bg-violet-200 dark:hover:bg-violet-500/25 transition-colors flex items-center gap-1.5"><FiArrowRight className="w-3.5 h-3.5" /> Browse Now</Link>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="py-28 bg-white dark:bg-[#07070d]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-16">
            <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Why LuxeStore</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-[-2px] leading-tight">
              Built around<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">your experience</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-[#0c0c14] p-8 hover:bg-gray-50/80 dark:hover:bg-[#0e0e18] transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 0% 0%, ${feature.accent}08 0%, transparent 60%)` }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center" style={{ backgroundColor: `${feature.accent}15` }}>
                    <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#050508] dark:bg-[#030306] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-[11px] font-black text-violet-400 uppercase tracking-widest mb-4">Limited Time</p>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-[-2px] leading-tight mb-6">
            Start shopping<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">smarter today</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of buyers who discovered premium shopping through LuxeStore.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300">
              Browse Collection
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {!user && (
              <Link to="/register" className="inline-flex items-center justify-center gap-3 bg-white/5 text-white px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}