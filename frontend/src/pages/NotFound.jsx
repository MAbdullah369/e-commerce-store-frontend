import { Link } from 'react-router-dom'
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary-400/40 rounded-full animate-pulse-soft"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-accent-400/40 rounded-full animate-pulse-soft delay-300"></div>

      <div className="text-center max-w-lg relative z-10 animate-fade-in-up">
        {/* 404 Text */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-primary-200 via-accent-200 to-primary-200 bg-clip-text text-transparent select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/30 rotate-12 hover:rotate-0 transition-transform duration-500">
              <FiSearch className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-1 transition-all duration-300"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-bold text-base hover:border-primary-300 hover:text-primary-600 hover:shadow-md transition-all duration-300"
          >
            <FiArrowLeft className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}